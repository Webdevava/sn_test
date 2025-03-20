
// @/app/bank/page.jsx
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
      <div className="text-center py-20 animate-pulse">
        <BankIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Loading bank accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg">
        <BankIcon size={48} className="mx-auto mb-4 text-red-400" />
        <p className="text-red-500 text-lg">{error}</p>
        <p className="text-gray-400 mt-2">
          Something went wrong. Try adding a bank account or refresh the page.
        </p>
        <div className="mt-4">
          <AddBankDialog onBankAdded={fetchBanks} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Total Banks ({banks.length})</h1>
        </div>
        <AddBankDialog onBankAdded={fetchBanks} />
      </div>

      {banks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <BankIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No bank accounts found</p>
          <p className="text-gray-400 mt-2">
            Click below to create your first bank account
          </p>
          <div className="mt-4">
            <AddBankDialog onBankAdded={fetchBanks} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
}