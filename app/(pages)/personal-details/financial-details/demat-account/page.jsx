"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import AddDematDialog from "@/components/dialogs/demat/add-demat";
import DematCard from "@/components/cards/demat-card";
import { Bank as BankIcon } from "@phosphor-icons/react";
import { listDematAccounts, deleteDematAccount } from "@/lib/demat-account-api";

export default function DematAccountPage() {
  const [dematAccounts, setDematAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchDematAccounts = async () => {
    try {
      setLoading(true);
      const response = await listDematAccounts();
      
      // If status is true, set the demat accounts
      if (response.status) {
        setDematAccounts(response.data);
      } else {
        // If status is false (including cases like "No demat accounts available"),
        // just set an empty array - don't treat as an error
        setDematAccounts([]);
      }
    } catch (err) {
      console.error("Error fetching demat accounts:", err);
      // For unexpected errors (like network issues),
      // we'll still set empty array but not show an error toast
      setDematAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await deleteDematAccount(accountId);
      if (response.status) {
        setDematAccounts(dematAccounts.filter((account) => account.id !== accountId));
        toast.success("Demat account deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete demat account");
    }
  };

  useEffect(() => {
    fetchDematAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <BankIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading demat accounts...</p>
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
            Demat Accounts ({dematAccounts.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <BankIcon size={20} />
            Add Demat Account
          </Button>
        </div>
      </div>

      <AddDematDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onDematAdded={fetchDematAccounts}
      />

      {dematAccounts.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <BankIcon size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No demat accounts found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to create your first demat account
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <BankIcon size={20} />
              Add Demat Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {dematAccounts.map((account) => (
            <DematCard
              key={account.id}
              dematAccount={account}
              onEdit={fetchDematAccounts}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Fixed Add Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 w-full">
            <BankIcon size={20} />
            Add Demat Account
          </Button>
        </div>
      </div>
    </div>
  );
}