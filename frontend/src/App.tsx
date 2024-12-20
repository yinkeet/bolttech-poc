import { useEffect, useState } from "react";
import './App.css'
import { CustomTable } from '@/components/customtable'
import { ColumnDef } from "@tanstack/react-table";
import { Toaster } from "@/components/ui/toaster"
import { format } from "date-fns";
import { CreateClaimDialog } from "@/components/createclaimdialog";
import { ClaimDocsDialog } from "@/components/claimdocsdialog";
import { EditClaimDialog} from "@/components/editclaimdialog";

interface Claim {
  id: number;
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
      header: 'Claim',
    },
    {
      accessorKey: 'policy_number',
      header: 'Policy',
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
    },
    {
      accessorKey: 'device',
      header: 'Device',
    },
    {
      accessorKey: 'coverage_name',
      header: 'Coverage',
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
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <EditClaimDialog claimId={row.original.id} amountClaimed={row.original.amount_claimed} onClaimUpdated={() => setRefresh(refresh+1)}/>
            <ClaimDocsDialog claimId={row.original.id}/>
          </div>
        )
      }
    },
  ];

  // Claims
  const [data, setData] = useState<Claim[]>([]);
  const [refresh, setRefresh] = useState(0);

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

  return (
    <>
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
