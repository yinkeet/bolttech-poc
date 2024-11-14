import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CustomAlertDialog } from "@/components/customalertdialog"
import { useToast } from "@/components/hooks/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Label } from '@/components/ui/label'
import { ErrorResponse } from '@/models/errorresponse'

const formSchema = z.object({
    amount_claimed: z.coerce.number().positive()
})

export interface CreateClaimDialogProps {
    onClaimCreated: CreateClaimDialogSubmitCallbackProps;
}

export interface CreateClaimDialogSubmitCallbackProps {
    (): void
}

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
}

interface Device {
    id: number;
    type: string;
    brand: string;
    model: string;
}

interface Coverage {
    policy_id: number;
    coverage_id: number;
    policy_number: string;
    status: string;
    name: string;
    coverage_limit_override: string;
}

export function CreateClaimDialog({ onClaimCreated }: CreateClaimDialogProps) {
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerId, setCustomerId] = useState("");
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [coverages, setCoverages] = useState<Coverage[]>([]);
    const [selectedCoverage, setSelectedCoverage] = useState("");
    const [policyId, setPolicyId] = useState(0);
    const [coverageId, setCoverageId] = useState(0);

    // Alert dialog
    const [alertDialogMessage, setAlertDialogMessage] = useState("");
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);

    // Toast
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const url = `http://localhost:8080/api/v1/customers`
            const result = await fetch(url);

            const newData = await result.json() as Customer[]
            setCustomers(newData);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [refresh]);

    async function onCustomerSelected(customer_id: string) {
        try {
            setCustomerId(customer_id)
            setSelectedDevice("")
            setDeviceId("")
            setSelectedCoverage("")
            const url = `http://localhost:8080/api/v1/customers/${customer_id}/devices`
            const result = await fetch(url);

            const newData = await result.json() as Device[]
            setDevices(newData)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function onDeviceSelected(index: number) {
        const device = devices[index]
        const device_id = device.id.toString()
        try {
            setDeviceId(device_id)
            setSelectedCoverage("")
            const url = `http://localhost:8080/api/v1/customers/${customerId}/devices/${device_id}/policy`
            const result = await fetch(url);

            const newData = await result.json() as Coverage[]
            setCoverages(newData)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function onCoverageSelected(index: number) {
        const coverage = coverages[index]
        setPolicyId(coverage.policy_id)
        setCoverageId(coverage.coverage_id)
        form.setValue("amount_claimed", parseInt(coverage.coverage_limit_override))
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount_claimed: 0,
        },
    })

    async function createClaim(amount_claimed: number) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/claims', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    policy_id: policyId,
                    coverage_id: coverageId,
                    amount_claimed: amount_claimed
                }),
            });

            if (!response.ok) {
                const data = await response.json() as ErrorResponse;
                setAlertDialogMessage(data.message)
                setAlertDialogOpen(true);
                if (data.error) console.error(data.error)
                return
            }

            toast({
                title: "Claim created"
            })

            onClaimCreated()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        createClaim(values.amount_claimed)
        setOpen(false)
    }

    return (
        <>
            <CustomAlertDialog title="Error" message={alertDialogMessage} open={alertDialogOpen} onOpenChange={setAlertDialogOpen} />
            <Dialog open={open} onOpenChange={(value) => {
                setOpen(value)
                if (value) {
                    setRefresh(refresh + 1)
                    setCustomerId("")
                    setSelectedDevice("")
                    setDeviceId("")
                    setSelectedCoverage("")
                    setPolicyId(0)
                    setCoverageId(0)
                    form.resetField("amount_claimed")
                }
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Claim</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Claim</DialogTitle>
                    </DialogHeader>
                    <Label>Customer</Label>
                    <Select
                        onValueChange={onCustomerSelected}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {customers.map((customer, index) => {
                                    return (
                                        <SelectItem key={index} value={customer.id.toString()}>{customer.first_name} {customer.last_name}</SelectItem>
                                    )
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label>Device</Label>
                    <Select
                        disabled={customerId == ""}
                        value={selectedDevice}
                        onValueChange={(value) => {
                            setSelectedDevice(value)
                            onDeviceSelected(parseInt(value))
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pick a device" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {devices.map((device, index) => {
                                    const type = device.type.charAt(0).toUpperCase() + device.type.slice(1);
                                    return (
                                        <SelectItem key={index} value={index.toString()}>{type}: {device.brand} {device.model}</SelectItem>
                                    )
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label>Coverage</Label>
                    <Select
                        disabled={deviceId == ""}
                        value={selectedCoverage}
                        onValueChange={(value) => {
                            setSelectedCoverage(value)
                            onCoverageSelected(parseInt(value))
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a coverage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {coverages.map((coverage, index) => {
                                    return (
                                        <SelectItem key={index} value={index.toString()} disabled={coverage.status == "expired"}>{coverage.name}: Limit RM{coverage.coverage_limit_override}</SelectItem>
                                    )
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* <Button type="button" className="w-20" onClick={_OnSubmit}>Submit</Button> */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="amount_claimed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount Claimed</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={policyId == 0 || coverageId == 0}>Submit</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}