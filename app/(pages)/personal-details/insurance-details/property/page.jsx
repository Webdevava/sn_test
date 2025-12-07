"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import AddPropertyDialog from "@/components/dialogs/property/add-property";
import PropertyCard from "@/components/cards/property-card";
import DocumentDownload from "@/components/document-download"; // ← NEW
import { House } from "@phosphor-icons/react";
import { listPropertyInsurances } from "@/lib/property-insurance-api";

const PropertyInsurancePage = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await listPropertyInsurances();

      // Always set data — even if empty
      if (response?.data) {
        setInsurances(response.data);
      } else {
        setInsurances([]);
      }
    } catch (err) {
      console.error("Error fetching property insurances:", err);
      setInsurances([]); // Silent fail — no toast
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setInsurances(prev => prev.filter(ins => ins.id !== id));
    toast.success("Property insurance deleted");
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] animate-pulse">
        <House size={48} className="mb-4 text-gray-400" />
        <p className="text-gray-500">Loading property insurances...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />

      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Property Insurances ({insurances.length})
        </h1>

        <div className="flex gap-3 items-center">
          {/* Download List Button */}
          {insurances.length > 0 && (
            <DocumentDownload 
              data={insurances} 
              title="Property Insurances" 
              buttonText="Download List"
            />
          )}

          {/* Add Button - Desktop */}
          <div className="hidden sm:block">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <House size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <AddPropertyDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={fetchInsurances}
      />

      {/* Empty State */}
      {insurances.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-6">
          <House size={80} className="mb-4 text-gray-400" />
          <p className="text-lg text-gray-500">No property insurances found</p>
          <p className="text-gray-400 mt-2">Click below to add your first policy</p>
          <Button onClick={() => setOpenAddDialog(true)} className="mt-6 gap-2">
            <House size={20} />
            Add Insurance
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {insurances.map((insurance) => (
            <PropertyCard
              key={insurance.id}
              propertyInsurance={insurance}
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
            <DocumentDownload data={insurances} title="Property Insurances" />
          )}
          <Button onClick={() => setOpenAddDialog(true)} className="flex-1 gap-2">
            <House size={20} />
            Add Insurance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyInsurancePage;