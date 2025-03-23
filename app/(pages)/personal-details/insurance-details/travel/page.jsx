"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  listTravelInsurances,
  getTravelInsuranceDetails,
  deleteTravelInsurance,
} from "@/lib/travel-insurance-api";
import { toast, Toaster } from "sonner";
import AddTravelDialog from "@/components/dialogs/travel/add-travel";
import EditTravelDialog from "@/components/dialogs/travel/edit-travel";
import { Airplane } from "@phosphor-icons/react";

const TravelInsurancePage = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await listTravelInsurances();
      if (response.status && response.data) {
        setInsurances(response.data);
      }
    } catch (err) {
      setError("Failed to fetch travel insurances");
      toast.error("Failed to fetch travel insurances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteTravelInsurance(id);
      if (response.status) {
        setInsurances(insurances.filter((ins) => ins.id !== id));
        toast.success("Travel insurance deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete travel insurance");
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = async (id) => {
    try {
      const response = await getTravelInsuranceDetails(id);
      if (response.data) {
        setSelectedInsurance(response.data);
        setOpenEditDialog(true);
      }
    } catch (error) {
      toast.error("Failed to fetch insurance details");
    }
  };

  const handleView = (insurance) => {
    setSelectedInsurance(insurance);
    setViewDialogOpen(true);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url || "#";
    link.download = url?.split("/").pop() || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSuccess = () => {
    fetchInsurances();
  };

  if (loading && !insurances.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <Airplane size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading travel insurances...</p>
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
            Travel Insurances ({insurances.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <Airplane size={20} />
            Add Insurance
          </Button>
        </div>
      </div>

      {/* Always render dialogs */}
      <AddTravelDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={handleSuccess}
      />
      <EditTravelDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        insurance={selectedInsurance}
        onSuccess={handleSuccess}
      />

      {error ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <Airplane size={36} className="mb-4 text-red-400 sm:size-48" />
          <p className="text-red-500 text-base sm:text-lg">{error}</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Something went wrong. Try adding an insurance or refresh the page.
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Airplane size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      ) : insurances.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <Airplane size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No travel insurances found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first travel insurance
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Airplane size={20} />
              Add Insurance
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {insurances.map((insurance) => (
            <Card
              key={insurance.id}
              className="p-0 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="p-4 sm:p-6 pb-0">
                <CardTitle className="text-base sm:text-lg">{insurance.travel_type}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Policy Number</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{insurance.policy_number || "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Insurer</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{insurance.insurer_name || "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Premium</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">₹{insurance.premium_amount || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Sum Insured</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">₹{insurance.sum_insured || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">
                      {insurance.policy_start_date ? new Date(insurance.policy_start_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Expiry Date</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">
                      {insurance.policy_expiry_date ? new Date(insurance.policy_expiry_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Linked Phone</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{insurance.linked_mobile || "N/A"}</p>
                  </div>
                </div>
                {insurance.nominee && insurance.nominee.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Nominees</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-muted">
                            <th className="text-left p-2 font-medium">Nominee Name</th>
                            <th className="text-left p-2 font-medium">Relationship</th>
                            <th className="text-left p-2 font-medium">Share (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insurance.nominee.map((nominee, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                              <td className="p-2 truncate">{nominee.first_name} {nominee.last_name}</td>
                              <td className="p-2 truncate">{nominee.relationship}</td>
                              <td className="p-2">{nominee.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-2 sm:p-4 justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-2 sm:gap-3 items-center w-full sm:w-60 justify-between">
                  <span className="truncate">{insurance.document?.split("/").pop() || "Document"}</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(insurance)}>
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(insurance.document)}
                      disabled={!insurance.document}
                    >
                      <FileDown className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(insurance.id)}>
                    <PenLine className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedDeleteId(insurance.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Fixed Add Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden w-full">
        <div className="flex items-center justify-center">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2 w-full">
            <Airplane size={20} />
            Add Insurance
          </Button>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {selectedInsurance?.document && (
              <iframe src={selectedInsurance.document} width="100%" height="600px" title="Insurance Document" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this travel insurance? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedDeleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelInsurancePage;