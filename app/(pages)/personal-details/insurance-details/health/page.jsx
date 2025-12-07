"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import AddMedicalDialog from "@/components/dialogs/medical/add-medical";
import MedicalCard from "@/components/cards/medical-card";
import DocumentDownload from "@/components/document-download"; // ← NEW
import { Stethoscope } from "@phosphor-icons/react";
import { listMedicalInsurances, deleteMedicalInsurance } from "@/lib/medical-insurance-api";

const MedicalPage = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await listMedicalInsurances();

      // Always set data — even if empty
      if (response?.data) {
        setInsurances(response.data);
      } else {
        setInsurances([]); // No data? Just show empty state
      }
    } catch (err) {
      console.error("Error fetching medical insurances:", err);
      setInsurances([]); // Don't show error toast on empty/no data
      // Only show toast on real network/auth errors if needed
      // toast.error("Failed to load insurances");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMedicalInsurance(id);
      if (response?.status) {
        setInsurances(prev => prev.filter(ins => ins.id !== id));
        toast.success("Medical insurance deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete insurance");
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] animate-pulse">
        <Stethoscope size={48} className="mb-4 text-gray-400" />
        <p className="text-gray-500">Loading medical insurances...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />

      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Medical Insurances ({insurances.length})
        </h1>

        <div className="flex gap-3 items-center">
          {/* Download List Button */}
          {insurances.length > 0 && (
            <DocumentDownload 
              data={insurances} 
              title="Medical Insurances" 
              buttonText="Download List"
            />
          )}

          {/* Add Button - Desktop */}
          <div className="hidden sm:block">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Stethoscope size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <AddMedicalDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={fetchInsurances}
      />

      {/* Empty State */}
      {insurances.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-6">
          <Stethoscope size={80} className="mb-4 text-gray-400" />
          <p className="text-lg text-gray-500">No medical insurances found</p>
          <p className="text-gray-400 mt-2">Click below to add your first policy</p>
          <Button onClick={() => setOpenAddDialog(true)} className="mt-6 gap-2">
            <Stethoscope size={20} />
            Add Insurance
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {insurances.map((insurance) => (
            <MedicalCard
              key={insurance.id}
              medicalInsurance={insurance}
              onEdit={fetchInsurances}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden z-10">
        <div className="flex gap-3 max-w-md mx-auto">
          {insurances.length > 0 && (
            <DocumentDownload data={insurances} title="Medical Insurances" />
          )}
          <Button onClick={() => setOpenAddDialog(true)} className="flex-1 gap-2">
            <Stethoscope size={20} />
            Add Insurance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalPage;