"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { listDematAccounts, deleteDematAccount } from "@/lib/demat-account-api";
import { Toaster, toast } from "sonner";
import AddDematDialog from "@/components/dialogs/demat/add-demat";
import DematCard from "@/components/cards/demat-card";
import { Bank as BankIcon, Plus } from "@phosphor-icons/react";

export default function DematAccountPage() {
  const [dematAccounts, setDematAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDematAccounts = async () => {
    try {
      setLoading(true);
      const response = await listDematAccounts();
      if (response.status) {
        setDematAccounts(response.data);
      }
    } catch (err) {
      setError("Failed to fetch demat accounts");
      toast.error("Failed to fetch demat accounts");
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
      <div className="text-center py-20 animate-pulse">
        <BankIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Loading demat accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg">
        <BankIcon size={48} className="mx-auto mb-4 text-red-400" />
        <p className="text-red-500 text-lg">{error}</p>
        <p className="text-gray-400 mt-2">
          Something went wrong. Try adding a demat account or refresh the page.
        </p>
        <div className="mt-4">
          <AddDematDialog onDematAdded={fetchDematAccounts} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {/* <BankIcon size={32} className="text-primary" /> */}
          <h1 className="text-xl font-bold">Demat Accounts ({dematAccounts.length})</h1>
        </div>
        <AddDematDialog onDematAdded={fetchDematAccounts} />
      </div>

      {dematAccounts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <BankIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No demat accounts found</p>
          <p className="text-gray-400 mt-2">
            Click below to create your first demat account
          </p>
          <div className="mt-4">
            <AddDematDialog onDematAdded={fetchDematAccounts} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
}