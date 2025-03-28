"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import AddTermDialog from "@/components/dialogs/term/add-term";
import { ShieldCheck } from "@phosphor-icons/react";
import { listTermInsurances, deleteTermInsurance } from "@/lib/term-insurance-api";
import TermCard from "@/components/cards/term-card";

const TermInsurancePage = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await listTermInsurances();
      if (response.status && response.data) {
        setInsurances(response.data);
      }
    } catch (err) {
      setError("Failed to fetch term insurances");
      toast.error("Failed to fetch term insurances");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteTermInsurance(id);
      if (response.status) {
        setInsurances(insurances.filter((ins) => ins.id !== id));
        toast.success("Term insurance deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete term insurance");
    }
  };

  const handleSuccess = () => {
    fetchInsurances();
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  if (loading && !insurances.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <ShieldCheck size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading term insurances...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            Term Insurances ({insurances.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <ShieldCheck size={20} />
            Add Insurance
          </Button>
        </div>
      </div>

      <AddTermDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={handleSuccess}
      />

      {error ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <ShieldCheck size={36} className="mb-4 text-red-400 sm:size-48" />
          <p className="text-red-500 text-base sm:text-lg">{error}</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Something went wrong. Try adding an insurance or refresh the page.
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <ShieldCheck size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      ) : insurances.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <ShieldCheck size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No term insurances found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first term insurance
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <ShieldCheck size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {insurances.map((insurance) => (
            <TermCard
              key={insurance.id}
              termInsurance={insurance}
              onEdit={fetchInsurances}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 w-full">
            <ShieldCheck size={20} />
            Add Insurance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermInsurancePage;