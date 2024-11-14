import { useEffect, useState } from "react";
import './App.css'
import { CustomTable } from '@/components/customtable'
import { ColumnDef } from "@tanstack/react-table";
import { CustomDialog, CustomDialogSubmitCallbackProps } from "@/components/customdialog";
import { formatISO } from "date-fns";
import { useToast } from "@/components/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { CustomAlertDialog } from "@/components/customalertdialog";
import { format } from "date-fns";
import { CreateClaimDialog } from "@/components/createclaimdialog";

interface Claim {
  claim_number: string;
  claim_date: string;
  amount_claimed: string;
  amount_approved: string;
  status: string;
};

function App() {
  // Define Columns
  const columns: ColumnDef<Claim>[] = [
    {
      accessorKey: 'claim_number',
      header: 'No.',
    },
    {
      accessorKey: 'claim_date',
      header: 'Date',
      cell: ({ row }) => {
        return format(row.original.claim_date, 'yyyy-MM-dd')
      }
    },
    {
      accessorKey: 'amount_claimed',
      header: 'Amount Claimed',
    },
    {
      accessorKey: 'amount_approved',
      header: 'Amount Approved',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      // cell: ({ row }) => {
      //   // Edit button that will trigger a dialog
      //   return (
      //     <TaskDialog triggerTitle="Edit" title="Edit task" onSubmit={(name, description, due_date) => onEditTaskSubmit(row.original.uuid, name, description, due_date)} defaultName={row.getValue('name')} defaultDescription={row.getValue('description')} defaultDueDate={row.getValue('due_date')} />
      //   )
      // }
    },
  ];

  // Tasks
  const [data, setData] = useState<Claim[]>([]);
  // Task pages
  // const [totalPages, setTotalPages] = useState(1);
  // const [currentPage, setCurrentPage] = useState(1);
  // Task refresh
  const [refresh, setRefresh] = useState(0);

  // Alert dialog
  const [alertDialogMessage, setAlertDialogMessage] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // Toast
  const { toast } = useToast();

  // Task list
  const fetchData = async () => {
    let url = `http://localhost:8080/api/v1/claims`
    const result = await fetch(url);

    const newData = await result.json() as Claim[]
    setData(newData)
  };
  useEffect(() => {
    fetchData();
  }, [refresh]);

  // Create task handler
  const onCreateClaimSubmit: CustomDialogSubmitCallbackProps = async (name, description, due_date) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
          due_date: formatISO(due_date)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setAlertDialogMessage(JSON.stringify(data, null, 2))
        setAlertDialogOpen(true);
        return
      }

      const data = await response.json();
      console.log('Response data:', data);
      setRefresh(refresh + 1)
      toast({
        title: "Task created"
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Edit task handler
  const onEditTaskSubmit = async (uuid: string, name: string, description: string, due_date: Date) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tasks/${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
          due_date: formatISO(due_date)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setAlertDialogMessage(JSON.stringify(data, null, 2))
        setAlertDialogOpen(true);
        return
      }

      setRefresh(refresh + 1)
      toast({
        title: "Task edited"
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <CustomAlertDialog title="Error" message={alertDialogMessage} open={alertDialogOpen} onOpenChange={setAlertDialogOpen} />
      <Toaster />
      <div className="hidden h-full flex-1 flex-col space-y-2 p- md:flex">
        <div className='flex'>
          {/* Create button */}
          <CreateClaimDialog onClaimCreated={() => setRefresh(refresh+1)} />
          <div className='flex-1'></div>
        </div>
        {/* Tasks list */}
        <div className="text-left">
          <CustomTable columns={columns} data={data} />
        </div>
      </div>
    </>
  )
}

export default App
