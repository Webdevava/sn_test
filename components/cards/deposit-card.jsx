// @/components/cards/deposit-card.jsx
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
import EditDepositDialog from "@/components/dialogs/deposit/edit-deposit";
import { getDepositDetail, deleteDeposit } from "@/lib/deposit-api";
import { deleteNominee } from "@/lib/nominee-api";
import { toast } from "sonner";

const DepositCard = ({ deposit, onEdit }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteNomineeDialogOpen, setDeleteNomineeDialogOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [loadingNominees, setLoadingNominees] = useState(true);

  useEffect(() => {
    const fetchNomineeDetails = async () => {
      try {
        setLoadingNominees(true);
        const response = await getDepositDetail(deposit.deposit_type, deposit.id);
        if (response.status) {
          setNominees(response.data.nominee || []);
        }
      } catch (error) {
        console.error("Error fetching nominee details:", error);
        toast.error("Failed to fetch nominee details");
      } finally {
        setLoadingNominees(false);
      }
    };
    fetchNomineeDetails();
  }, [deposit.id, deposit.deposit_type]);

  const handleDownload = async () => {
    try {
      const response = await fetch(deposit.document, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const filename = deposit.document.split("/").pop() || "document.pdf";
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document: " + error.message);
    }
  };

  const handleView = () => {
    setViewDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteDeposit(deposit.deposit_type, deposit.id);
      if (response.status) {
        toast.success("Deposit deleted successfully");
        onEdit(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete deposit");
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteNominee = (nominee) => {
    setSelectedNominee(nominee);
    setDeleteNomineeDialogOpen(true);
  };

  const handleConfirmDeleteNominee = async () => {
    if (!selectedNominee) return;
    
    try {
      const response = await deleteNominee("deposit", selectedNominee.id);
      if (response.status) {
        setNominees(nominees.filter(item => item.id !== selectedNominee.id));
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
    onEdit(); // Trigger the parent refresh
    setEditDialogOpen(false); // Close the dialog
  };

  return (
    <>
      <Card className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle className="text-base sm:text-lg">
            {deposit.name} ({deposit.deposit_type})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Installment</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">₹{deposit.installment || "0"} ({deposit.installment_type})</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">{deposit.interest_rate || "0"}%</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Tenure</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">{deposit.tenure || "N/A"} months</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Maturity Amount</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">₹{deposit.maturity_amount || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Maturity Date</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">
                {deposit.maturity_date ? new Date(deposit.maturity_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Mobile</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">{deposit.linked_mobile_number || "N/A"}</p>
            </div>
          </div>

          {loadingNominees ? (
            <div className="mt-4">
              <p className="text-sm">Loading nominees...</p>
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
                      <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="p-2">{nominee.first_name} {nominee.last_name}</td>
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
          ) : null}
        </CardContent>
        <CardFooter className="border-t p-2 sm:p-4 justify-between flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-2 sm:gap-3 items-center w-full sm:w-60 justify-between">
            <span className="truncate">{deposit.document?.split("/").pop() || "Document"}</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" onClick={handleView}>
                <Eye className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!deposit.document}>
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
            {deposit.document && (
              <object
                data={deposit.document}
                type="application/pdf"
                width="100%"
                height="600px"
              >
                <p>Your browser cannot display the PDF. Please use the download button instead.</p>
              </object>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the deposit "{deposit.name}"? This action cannot be undone.
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
        <EditDepositDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          deposit={deposit}
          onSuccess={handleEditSuccess}
        />
      </Dialog>

      <Dialog open={deleteNomineeDialogOpen} onOpenChange={setDeleteNomineeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Nominee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedNominee?.first_name} {selectedNominee?.last_name} as a nominee?
              This action cannot be undone.
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
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteNominee}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositCard;