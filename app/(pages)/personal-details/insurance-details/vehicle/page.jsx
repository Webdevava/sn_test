"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import AddVehicleDialog from "@/components/dialogs/vehicle/add-vehicle";
import { Car } from "@phosphor-icons/react";
import { listVehicleInsurances } from "@/lib/vehicle-insurance-api";
import VehicleCard from "@/components/cards/vehicle-card";

const VehicleInsurancePage = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await listVehicleInsurances();
      if (response.status && response.data) {
        setInsurances(response.data);
      }
    } catch (err) {
      setError("Failed to fetch vehicle insurances");
      toast.error("Failed to fetch vehicle insurances");
    } finally {
      setLoading(false);
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
        <Car size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading vehicle insurances...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            Vehicle Insurances ({insurances.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <Car size={20} />
            Add Insurance
          </Button>
        </div>
      </div>

      <AddVehicleDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={handleSuccess}
      />

      {error ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <Car size={36} className="mb-4 text-red-400 sm:size-48" />
          <p className="text-red-500 text-base sm:text-lg">{error}</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Something went wrong. Try adding an insurance or refresh the page.
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Car size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      ) : insurances.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <Car size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No vehicle insurances found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first vehicle insurance
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Car size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {insurances.map((insurance) => (
            <VehicleCard
              key={insurance.id}
              vehicleInsurance={insurance}
              onEdit={fetchInsurances}
              onDelete={(id) => setInsurances(insurances.filter((ins) => ins.id !== id))}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 w-full">
            <Car size={20} />
            Add Insurance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleInsurancePage;