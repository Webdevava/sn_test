"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import AddLoanDialog from "@/components/dialogs/loan/add-loan";
import EditLoanDialog from "@/components/dialogs/loan/edit-loan";
import LoanCard from "@/components/cards/loan-card";
import { listSecuredLoans, listUnsecuredLoans, deleteSecuredLoan, deleteUnsecuredLoan } from "@/lib/loan-api";
import { Bank as LoanIcon } from "@phosphor-icons/react";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      
      // Get secured loans
      let securedLoans = [];
      try {
        const securedResponse = await listSecuredLoans();
        // Don't check status - we'll handle the empty data separately
        securedLoans = securedResponse.data && securedResponse.data.length > 0 
          ? securedResponse.data.map(loan => ({ ...loan, type: "Secured" })) 
          : [];
      } catch (securedErr) {
        console.error("Error fetching secured loans:", securedErr);
        // Continue with empty secured loans
      }
      
      // Get unsecured loans
      let unsecuredLoans = [];
      try {
        const unsecuredResponse = await listUnsecuredLoans();
        // Don't check status - we'll handle the empty data separately
        unsecuredLoans = unsecuredResponse.data && unsecuredResponse.data.length > 0 
          ? unsecuredResponse.data.map(loan => ({ ...loan, type: "Unsecured" })) 
          : [];
      } catch (unsecuredErr) {
        console.error("Error fetching unsecured loans:", unsecuredErr);
        // Continue with empty unsecured loans
      }
      
      // Combine loans - this will work even if only one type is available
      const allLoans = [...securedLoans, ...unsecuredLoans];
      setLoans(allLoans);
    } catch (err) {
      console.error("Error in overall loan fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDelete = async (loanId, loanType) => {
    try {
      const response = loanType === "Secured" ? await deleteSecuredLoan(loanId) : await deleteUnsecuredLoan(loanId);
      if (response.status) {
        setLoans(loans.filter((loan) => loan.id !== loanId));
        toast.success("Loan deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete loan");
    }
  };

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
    setOpenEditDialog(true);
  };

  const handleSuccess = () => {
    fetchLoans();
  };

  if (loading && !loans.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] animate-pulse">
        <LoanIcon size={48} className="mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading loans...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            Loans ({loans.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <LoanIcon size={20} />
            Add Loan
          </Button>
        </div>
      </div>

      <AddLoanDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleSuccess} />
      <EditLoanDialog 
        open={openEditDialog} 
        onOpenChange={setOpenEditDialog} 
        loan={selectedLoan} 
        onSuccess={handleSuccess} 
      />

      {loans.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <LoanIcon size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No loans found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first loan
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <LoanIcon size={20} />
              Add Loan
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onEdit={() => handleEdit(loan)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 w-full">
            <LoanIcon size={20} />
            Add Loan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;