import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { File, Plus, CircleX } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { ColumnDef } from '@tanstack/react-table'
import { CustomTable } from '@/components/customtable'
import { CustomAlertDialog } from '@/components/customalertdialog'
import { useToast } from "@/components/hooks/use-toast"
import { ErrorResponse } from '@/models/errorresponse'
import { ConfirmationDialog } from '@/components/confirmationdialog';


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
        {
            accessorKey: 'id',
            header: 'Action',
            cell: ({ row }) => {
                const [open, setOpen] = useState(false)
                return (
                    <>
                        <ConfirmationDialog title='Confirm Delete?' message='Are you sure you want to delete this?' open={open} onOpenChange={setOpen} onAction={(confirm) => {
                            if (confirm) {
                                
                            }
                        }}/>
                        <Button variant="outline" size="icon" onClick={() => {
                            setOpen(true)
                        }}><CircleX /></Button>
                    </>
                )
            }
        },
    ];

    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [docs, setDocs] = useState<Doc[]>([]);

    // Alert dialog
    const [alertDialogTitle, setAlertDialogTitle] = useState("");
    const [alertDialogMessage, setAlertDialogMessage] = useState("");
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    
    // Doc upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { register, reset } = useForm();

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

    const handleFileUpload = async () => {
        if (selectedFile != null) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const url = `http://localhost:8080/api/v1/claims/${claimId}/docs`
                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    const data = await response.json() as ErrorResponse;
                    setAlertDialogTitle("Error");
                    setAlertDialogMessage(data.message);
                    setAlertDialogOpen(true);
                    if (data.error) console.error(data.error);
                    return;
                }

                setAlertDialogTitle("Success");
                setAlertDialogMessage("File uploaded");
                setAlertDialogOpen(true);
                setRefresh(refresh+1);
                reset({ file: null });
            } catch (error: any) {
                console.error('Error:', error);
            }
        }
    }

    return (
        <>
            <CustomAlertDialog title={alertDialogTitle} message={alertDialogMessage} open={alertDialogOpen} onOpenChange={setAlertDialogOpen} />
            <Dialog open={open} onOpenChange={(status) => {
                setOpen(status)
                if (status) {
                    setSelectedFile(null);
                }
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon"><File /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
                    <DialogHeader>
                        <DialogTitle>Documents</DialogTitle>
                    </DialogHeader>
                    <div className='flex space-x-2'>
                        <Input type="file" className='w-auto' {...register("file")} onChange={(event) => {
                            const file = event.target.files && event.target.files[0]
                            if (file) {
                                setSelectedFile(file)
                            }
                        }} />
                        <Button variant="outline" size="icon" onClick={handleFileUpload}><Plus /></Button>
                    </div>
                    <CustomTable columns={columns} data={docs} />
                </DialogContent>
            </Dialog>
        </>
    )
}