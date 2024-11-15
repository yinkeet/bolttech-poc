import { useState } from 'react'
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
import { CustomAlertDialog } from "@/components/customalertdialog"
import { useToast } from "@/components/hooks/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { ErrorResponse } from '@/models/errorresponse'
import { Pencil } from 'lucide-react'

const formSchema = z.object({
    amount_claimed: z.coerce.number().positive()
})

export interface EditClaimDialogProps {
    claimId: number;
    amountClaimed: string;
    onClaimUpdated: EditClaimDialogSubmitCallbackProps;
}

export interface EditClaimDialogSubmitCallbackProps {
    (): void
}

export function EditClaimDialog({ claimId, amountClaimed, onClaimUpdated }: EditClaimDialogProps) {
    const [open, setOpen] = useState(false);
    
    // Alert dialog
    const [alertDialogMessage, setAlertDialogMessage] = useState("");
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);

    // Toast
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount_claimed: parseFloat(amountClaimed),
        },
    })

    async function editClaim(amount_claimed: number) {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/claims/${claimId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
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
                title: "Claim updated"
            })

            onClaimUpdated()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        editClaim(values.amount_claimed)
        setOpen(false)
    }

    return (
        <>
            <CustomAlertDialog title="Error" message={alertDialogMessage} open={alertDialogOpen} onOpenChange={setAlertDialogOpen} />
            <Dialog open={open} onOpenChange={(value) => {
                setOpen(value)
                if (value) {
                    form.resetField("amount_claimed")
                }
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon"><Pencil /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Claim</DialogTitle>
                    </DialogHeader>
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
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}