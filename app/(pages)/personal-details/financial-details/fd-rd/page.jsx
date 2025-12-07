"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import AddDepositDialog from "@/components/dialogs/deposit/add-deposit";
import DepositCard from "@/components/cards/deposit-card";
import DocumentDownload from "@/components/document-download";
import { Bank } from "@phosphor-icons/react";
import { listDeposits } from "@/lib/deposit-api";

export default function FDRDPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await listDeposits();
      setDeposits(res.status && res.data ? res.data : []);
    } catch (err) {
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeposits(); }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Bank size={48} className="animate-pulse" /></div>;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Toaster richColors />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Deposits (FD/RD) ({deposits.length})</h1>
        <div className="flex gap-3">
          {deposits.length > 0 && <DocumentDownload data={deposits} title="FD & RD Deposits" />}
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 hidden sm:flex">
            <Bank size={20} /> Add Deposit
          </Button>
        </div>
      </div>

      <AddDepositDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={fetchDeposits} />

      {deposits.length === 0 ? (
        <div className="text-center py-20">
          <Bank size={80} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">No deposits found</p>
          <Button onClick={() => setOpenAddDialog(true)} className="mt-6 gap-2">
            <Bank size={20} /> Add First Deposit
          </Button>
        </div>
      ) : (
        <div className="space-y-4 pb-20 sm:pb-0">
          {deposits.map(d => <DepositCard key={d.id} deposit={d} onEdit={fetchDeposits} />)}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden">
        <div className="flex gap-3 max-w-md mx-auto">
          {deposits.length > 0 && <DocumentDownload data={deposits} title="Deposits" />}
          <Button onClick={() => setOpenAddDialog(true)} className="flex-1 gap-2">
            <Bank size={20} /> Add Deposit
          </Button>
        </div>
      </div>
    </div>
  );
}