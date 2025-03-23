"use client";

import { useState, useEffect } from "react";
import BankCard from "@/components/cards/bank-card";
import { Toaster, toast } from "sonner";
import AddBankDialog from "@/components/dialogs/bank/add-bank";
import { Bank as BankIcon } from "@phosphor-icons/react";
import { listBanks, deleteBank } from "@/lib/bank-api";

export default function BankPage() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await listBanks();
      if (response.status) {
        setBanks(response.data);
      }
    } catch (err) {
      setError("Failed to fetch bank accounts");
      toast.error("Failed to fetch bank accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bankId) => {
    try {
      const response = await deleteBank(bankId);
      if (response.status) {
        setBanks(banks.filter((bank) => bank.id !== bankId));
        toast.success("Bank account deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete bank account");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <BankIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading bank accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
        <BankIcon size={36} className="mb-4 text-red-400 sm:size-48" />
        <p className="text-red-500 text-base sm:text-lg">{error}</p>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Something went wrong. Try adding a bank account or refresh the page.
        </p>
        <div className="mt-4">
          <AddBankDialog 
            openAddDialog={openAddDialog}
            setOpenAddDialog={setOpenAddDialog}
            onBankAdded={fetchBanks} 
          />
        </div>
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
            Total Banks ({banks.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <AddBankDialog 
            openAddDialog={openAddDialog}
            setOpenAddDialog={setOpenAddDialog}
            onBankAdded={fetchBanks} 
          />
        </div>
      </div>

      {banks.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <BankIcon size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No bank accounts found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to create your first bank account
          </p>
          <div className="mt-4">
            <AddBankDialog 
              openAddDialog={openAddDialog}
              setOpenAddDialog={setOpenAddDialog}
              onBankAdded={fetchBanks} 
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {banks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onEdit={fetchBanks}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Fixed Add Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <AddBankDialog 
            openAddDialog={openAddDialog}
            setOpenAddDialog={setOpenAddDialog}
            onBankAdded={fetchBanks} 
          />
        </div>
      </div>
    </div>
  );
}