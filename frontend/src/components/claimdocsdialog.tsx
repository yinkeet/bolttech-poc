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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { File, Plus } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { ColumnDef } from '@tanstack/react-table'
import { CustomTable } from '@/components/customtable'

const formSchema = z.object({
    // name: z.string().min(1).max(255),
    // description: z.string().min(1),
    // due_date: z.coerce.date(),
})

export interface ClaimDocsDialogProps {
    claimId: string;
    // onSubmit: CustomDialogSubmitCallbackProps;
}

export interface CustomDialogSubmitCallbackProps {
    (name: string, description: string, due_date: Date): Promise<void>
}

export interface Doc {
    id: number;
    type: string;
    path: string;
    original_filename: string;
    created_at: Date;
}

export function ClaimDocsDialog({ claimId }: ClaimDocsDialogProps) {
    const columns: ColumnDef<Doc>[] = [
        {
            accessorKey: 'original_filename',
            header: 'Filename',
            cell: ({ row }) => {
                return (
                    <Button variant="link" onClick={() => {
                        window.open(`http://localhost:8080/api/v1/claims/${claimId}/docs/${row.original.id}`, "_blank")
                    }}>{row.original.original_filename}</Button>
                )
            }
        },
        {
            accessorKey: 'created_at',
            header: 'Uploaded At',
        },
    ];

    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [docs, setDocs] = useState<Doc[]>([]);

    const fetchData = async () => {
        try {
            const url = `http://localhost:8080/api/v1/claims/${claimId}/docs`
            const result = await fetch(url);

            const newData = await result.json() as Doc[]
            setDocs(newData);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [refresh]);



    function _OnSubmit(values: z.infer<typeof formSchema>) {
        // onSubmit(values.name, values.description, values.due_date)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><File /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>Documents</DialogTitle>
                </DialogHeader>
                <div className='flex space-x-2'>
                    <Input type="file" className='w-auto' onChange={(event) => {
                        console.log(event.target.files && event.target.files[0])
                    }}/>
                    <Button variant="outline" size="icon"><Plus /></Button>
                </div>
                <CustomTable columns={columns} data={docs} />
                {/* <Form {...form}>
                    <form onSubmit={form.handleSubmit(_OnSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="due_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "yyyy-MM-dd")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form> */}
            </DialogContent>
        </Dialog>
    )
}