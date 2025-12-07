"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import AddLoanDialog from "@/components/dialogs/loan/add-loan";
import EditLoanDialog from "@/components/dialogs/loan/edit-loan";
import LoanCard from "@/components/cards/loan-card";
import DocumentDownload from "@/components/document-download";
import { Bank as LoanIcon } from "@phosphor-icons/react";
import { listSecuredLoans, listUnsecuredLoans, deleteSecuredLoan, deleteUnsecuredLoan } from "@/lib/loan-api";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const [secured, unsecured] = await Promise.all([
        listSecuredLoans().catch(() => ({ data: [] })),
        listUnsecuredLoans().catch(() => ({ data: [] }))
      ]);
      const all = [
        ...(secured.data || []).map(l => ({ ...l, type: "Secured" })),
        ...(unsecured.data || []).map(l => ({ ...l, type: "Unsecured" }))
      ];
      setLoans(all);
    } catch { setLoans([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleDelete = async (id, type) => {
    const fn = type === "Secured" ? deleteSecuredLoan : deleteUnsecuredLoan;
    await fn(id);
    fetchLoans();
  };

  if (loading) return <div className="flex justify-center items-center h-96"><LoanIcon size={48} className="animate-pulse" /></div>;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Toaster richColors />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Loans ({loans.length})</h1>
        <div className="flex gap-3">
          {loans.length > 0 && <DocumentDownload data={loans} title="All Loans" />}
          <Button onClick={() => setOpenAdd(true)} className="gap-2 hidden sm:flex">
            <LoanIcon size={20} /> Add Loan
          </Button>
        </div>
      </div>

      <AddLoanDialog open={openAdd} onOpenChange={setOpenAdd} onSuccess={fetchLoans} />
      <EditLoanDialog open={openEdit} onOpenChange={setOpenEdit} loan={selected} onSuccess={fetchLoans} />

      {loans.length === 0 ? (
        <div className="text-center py-20">
          <LoanIcon size={80} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">No loans found</p>
          <Button onClick={() => setOpenAdd(true)} className="mt-6 gap-2">
            <LoanIcon size={20} /> Add Loan
          </Button>
        </div>
      ) : (
        <div className="space-y-4 pb-20 sm:pb-0">
          {loans.map(loan => (
            <LoanCard key={loan.id} loan={loan} onEdit={(l) => { setSelected(l); setOpenEdit(true); }} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden">
        <div className="flex gap-3 max-w-md mx-auto">
          {loans.length > 0 && <DocumentDownload data={loans} title="Loans" />}
          <Button onClick={() => setOpenAdd(true)} className="flex-1 gap-2">
            <LoanIcon size={20} /> Add Loan
          </Button>
        </div>
      </div>
    </div>
  );
}