// @/components/cards/loan-card.jsx
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
import { Badge } from "@/components/ui/badge";
import EditLoanDialog from "@/components/dialogs/loan/edit-loan";
import { getLoanDetail } from "@/lib/loan-api";
import { deleteNominee } from "@/lib/nominee-api";
import { toast } from "sonner";

const LoanCard = ({ loan, onEdit, onDelete }) => {
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
        const response = await getLoanDetail(loan.id, loan.type.toLowerCase());
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
  }, [loan.id, loan.type]);

  const handleDownload = async () => {
    try {
      const response = await fetch(loan.document, {
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
      const filename = loan.document.split("/").pop() || "document.pdf";
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

  const handleConfirmDelete = () => {
    onDelete(loan.id, loan.type);
    setDeleteDialogOpen(false);
  };

  const handleDeleteNominee = (nominee) => {
    setSelectedNominee(nominee);
    setDeleteNomineeDialogOpen(true);
  };

  const handleConfirmDeleteNominee = async () => {
    if (!selectedNominee) return;
    
    try {
      const response = await deleteNominee("loan", selectedNominee.id);
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
          <CardTitle className="flex justify-between items-center text-base sm:text-lg">
            {loan.lender_name}
            <Badge className={loan.type === "Secured" ? "bg-blue-500" : "bg-green-500"}>{loan.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {loan.type === "Secured" ? (
              <>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Loan Type</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">{loan.loan_type || "N/A"}</p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Loan Amount</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">₹{loan.loan_amount || "0"}</p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">EMI Amount</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">₹{loan.emi_amount || "0"}</p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Remaining Balance</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">₹{loan.remaining_loan_balance || "0"}</p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">
                    {loan.loan_start_date ? new Date(loan.loan_start_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">
                    {loan.loan_end_date ? new Date(loan.loan_end_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Loan Amount</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">₹{loan.loan_amount || "0"}</p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Remaining Balance</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">₹{loan.remaining_balance || "0"}</p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">
                    {loan.loan_start_date ? new Date(loan.loan_start_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Repayment Date</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">
                    {loan.agreed_repayment_date ? new Date(loan.agreed_repayment_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="bg-popover p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Repayment Frequency</p>
                  <p className="font-semibold mt-1 sm:mt-2 truncate">{loan.repayment_frequency || "N/A"}</p>
                </div>
              </>
            )}
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
            <span className="truncate">{loan.document?.split("/").pop() || "Document"}</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" onClick={handleView}>
                <Eye className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!loan.document}>
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
            {loan.document && (
              <object
                data={loan.document}
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
              Are you sure you want to delete the loan from "{loan.lender_name}"? This action cannot be undone.
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
        <EditLoanDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          loan={loan}
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

export default LoanCard;