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
  listTermInsurances,
  getTermInsuranceDetail,
  deleteTermInsurance,
} from "@/lib/term-insurance-api";
import { toast, Toaster } from "sonner";
import AddTermDialog from "@/components/dialogs/term/add-term";
import EditTermDialog from "@/components/dialogs/term/edit-term";
import { ShieldCheck } from "@phosphor-icons/react";

const TermInsurancePage = () => {
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

  useEffect(() => {
    fetchInsurances();
  }, []);

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
    setDeleteDialogOpen(false);
  };

  const handleEdit = async (id) => {
    try {
      const response = await getTermInsuranceDetail(id);
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
      <div className="text-center py-20 animate-pulse">
        <ShieldCheck size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Loading term insurances...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {/* <ShieldCheck size={32} className="text-primary" /> */}
          <h1 className="text-xl font-bold">Term Insurances ({insurances.length})</h1>
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
          <ShieldCheck size={20} />
          Add Insurance
        </Button>
      </div>

      {/* Always render dialogs regardless of state */}
      <AddTermDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSuccess={handleSuccess}
      />
      <EditTermDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        insurance={selectedInsurance}
        onSuccess={handleSuccess}
      />

      {error ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <ShieldCheck size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-500 text-lg">{error}</p>
          <p className="text-gray-400 mt-2">
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
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <ShieldCheck size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No term insurances found</p>
          <p className="text-gray-400 mt-2">
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
        <div className="grid grid-cols-1 gap-6">
          {insurances.map((insurance) => (
            <Card
              key={insurance.id}
              className="p-0 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="p-6 pb-0">
                <CardTitle>{insurance.policy_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Policy Number</p>
                    <p className="font-semibold mt-2 truncate">{insurance.policy_number || "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Insurer</p>
                    <p className="font-semibold mt-2 truncate">{insurance.insurer_name || "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Sum Assured</p>
                    <p className="font-semibold mt-2 truncate">₹{insurance.sum_assured || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Premium</p>
                    <p className="font-semibold mt-2 truncate">₹{insurance.premium_amount || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Term</p>
                    <p className="font-semibold mt-2 truncate">{insurance.policy_term || "N/A"} years</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Maturity Date</p>
                    <p className="font-semibold mt-2 truncate">
                      {insurance.maturity_date ? new Date(insurance.maturity_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-semibold mt-2 truncate">
                      {insurance.start_date ? new Date(insurance.start_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Linked Phone</p>
                    <p className="font-semibold mt-2 truncate">{insurance.linked_mobile || "N/A"}</p>
                  </div>
                </div>
                {insurance.nominee && insurance.nominee.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Nominees</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
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
                              <td className="p-2">{nominee.first_name} {nominee.last_name}</td>
                              <td className="p-2">{nominee.relationship}</td>
                              <td className="p-2">{nominee.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-2 justify-between">
                <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-3 items-center w-60 justify-between">
                  <span className="truncate">{insurance.document?.split("/").pop() || "Document"}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(insurance)}
                    >
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(insurance.id)}
                  >
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

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {selectedInsurance?.document && (
              <iframe
                src={selectedInsurance.document}
                width="100%"
                height="600px"
                title="Insurance Document"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this term insurance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedDeleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TermInsurancePage;