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
import EditTermDialog from "@/components/dialogs/term/edit-term";
import { getTermInsuranceDetail } from "@/lib/term-insurance-api";
import { deleteNominee } from "@/lib/nominee-api";
import { toast } from "sonner";

const TermCard = ({ termInsurance, onEdit, onDelete }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteNomineeDialogOpen, setDeleteNomineeDialogOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailedInsurance, setDetailedInsurance] = useState(termInsurance);

  const fetchTermDetails = async () => {
    try {
      setLoadingDetails(true);
      const response = await getTermInsuranceDetail(termInsurance.id);
      if (response.status) {
        setDetailedInsurance(response.data);
        setNominees(response.data.nominee || []);
        setDocumentUrl(response.data.document || null);
      }
    } catch (error) {
      console.error("Error fetching term insurance details:", error);
      toast.error("Failed to load term insurance details");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchTermDetails();
  }, [termInsurance.id]);

  const handleDownload = async () => {
    if (!documentUrl) return;
    try {
      const response = await fetch(documentUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        headers: {
          "Accept": "application/pdf,image/*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const filename = documentUrl.split("/").pop() || "document";
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
    }
  };

  const handleView = () => {
    if (documentUrl) {
      setViewDialogOpen(true);
    } else {
      toast.error("No document available to view");
    }
  };

  const handleConfirmDelete = () => {
    onDelete(termInsurance.id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteNominee = (nominee) => {
    setSelectedNominee(nominee);
    setDeleteNomineeDialogOpen(true);
  };

  const handleConfirmDeleteNominee = async () => {
    if (!selectedNominee) return;

    try {
      const response = await deleteNominee("term", selectedNominee.id);
      if (response.status) {
        setNominees(nominees.filter((item) => item.id !== selectedNominee.id));
        toast.success("Nominee deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete nominee");
      }
    } catch (error) {
      console.error("Error deleting nominee:", error);
      toast.error("An error occurred while deleting the nominee");
    } finally {
      setDeleteNomineeDialogOpen(false);
      setSelectedNominee(null);
    }
  };

  const handleEditSuccess = () => {
    fetchTermDetails(); // Refetch details to update the card
    onEdit(); // Refresh parent list
    setEditDialogOpen(false);
  };

  const isImage = documentUrl?.match(/\.(jpeg|jpg|png)$/i);

  return (
    <>
      <Card className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-6 pb-0">
          <CardTitle>{detailedInsurance.policy_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Policy Number</p>
              <p className="font-semibold mt-2 truncate">{detailedInsurance.policy_number || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Insurer</p>
              <p className="font-semibold mt-2 truncate">{detailedInsurance.insurer_name || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Sum Assured</p>
              <p className="font-semibold mt-2 truncate">₹{detailedInsurance.sum_assured || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Premium</p>
              <p className="font-semibold mt-2 truncate">₹{detailedInsurance.premium_amount || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Term</p>
              <p className="font-semibold mt-2 truncate">{detailedInsurance.policy_term || "N/A"} years</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Maturity Date</p>
              <p className="font-semibold mt-2 truncate">
                {detailedInsurance.maturity_date
                  ? new Date(detailedInsurance.maturity_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="font-semibold mt-2 truncate">
                {detailedInsurance.start_date
                  ? new Date(detailedInsurance.start_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Linked Phone</p>
              <p className="font-semibold mt-2 truncate">{detailedInsurance.linked_mobile || "N/A"}</p>
            </div>
          </div>

          {loadingDetails ? (
            <div className="mt-4">
              <p className="text-sm">Loading details...</p>
            </div>
          ) : nominees.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Nominees</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2 font-medium">Nominee Name</th>
                      <th className="text-left p-2 font-medium">Relationship</th>
                      <th className="text-left p-2 font-medium">Share (%)</th>
                      <th className="text-center p-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nominees.map((nominee, index) => (
                      <tr
                        key={nominee.id || index}
                        className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                      >
                        <td className="p-2">{`${nominee.first_name} ${nominee.last_name}`}</td>
                        <td className="p-2">{nominee.relationship}</td>
                        <td className="p-2">{nominee.percentage}%</td>
                        <td className="p-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteNominee(nominee)}
                            className="h-8 w-8"
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">No nominees assigned</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-2 sm:p-4 justify-between flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-2 sm:gap-3 items-center w-full sm:w-60 justify-between">
            {documentUrl ? (
              <span className="truncate">{documentUrl.split("/").pop()}</span>
            ) : (
              <span>No file attached</span>
            )}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleView}
                disabled={!documentUrl}
              >
                <Eye className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={!documentUrl}
              >
                <FileDown className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditDialogOpen(true)}
            >
              <PenLine className="h-4 w-4 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {documentUrl && (
              <>
                {isImage ? (
                  <img
                    src={documentUrl}
                    alt="Term Insurance Document"
                    className="w-full h-auto"
                  />
                ) : (
                  <object
                    data={documentUrl}
                    type="application/pdf"
                    width="100%"
                    height="600px"
                  >
                    <p>Your browser cannot display the PDF. Please use the download button instead.</p>
                  </object>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the term insurance "{detailedInsurance.policy_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <EditTermDialog
            insurance={detailedInsurance}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteNomineeDialogOpen} onOpenChange={setDeleteNomineeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Nominee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedNominee?.first_name} {selectedNominee?.last_name} as a nominee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteNomineeDialogOpen(false);
                setSelectedNominee(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteNominee}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TermCard;