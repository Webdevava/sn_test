"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import AddDepositDialog from "@/components/dialogs/deposit/add-deposit";
import DepositCard from "@/components/cards/deposit-card";
import { listDeposits } from "@/lib/deposit-api";
import { Bank } from "@phosphor-icons/react";

const FDRDPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await listDeposits();
      if (response.status && response.data) {
        setDeposits(response.data);
      }
    } catch (err) {
      setError("Failed to fetch deposits");
      toast.error("Failed to fetch deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleSuccess = () => {
    fetchDeposits();
  };

  if (loading && !deposits.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <Bank size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading deposits...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            Deposits (FD/RD) ({deposits.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <Bank size={20} />
            Add Deposit
          </Button>
        </div>
      </div>

      <AddDepositDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleSuccess} />

      {error ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <Bank size={36} className="mb-4 text-red-400 sm:size-48" />
          <p className="text-red-500 text-base sm:text-lg">{error}</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Something went wrong. Try adding a deposit or refresh the page.
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Bank size={20} />
              Add Deposit
            </Button>
          </div>
        </div>
      ) : deposits.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <Bank size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No deposits found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first deposit
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Bank size={20} />
              Add Deposit
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {deposits.map((deposit) => (
            <DepositCard
              key={deposit.id}
              deposit={deposit}
              onEdit={handleSuccess}
            />
          ))}
        </div>
      )}

      {/* Fixed Add Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 w-full">
            <Bank size={20} />
            Add Deposit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FDRDPage;