// @/components/cards/bank-card.jsx
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
import EditBankDialog from "@/components/dialogs/bank/edit-bank";
import { getBankDetail } from "@/lib/bank-api";
import { deleteNominee } from "@/lib/nominee-api";
import { toast } from "sonner";

const BankCard = ({ bank, onEdit, onDelete }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteNomineeDialogOpen, setDeleteNomineeDialogOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [loadingNominees, setLoadingNominees] = useState(true);

  useEffect(() => {
    const fetchNomineeDetails = async () => {
      try {
        setLoadingNominees(true);
        const response = await getBankDetail(bank.id);
        if (response.status) {
          setNominees(response.data.nominee || []);
        }
      } catch (error) {
        console.error("Error fetching nominee details:", error);
      } finally {
        setLoadingNominees(false);
      }
    };
    fetchNomineeDetails();
  }, [bank.id]);

  const handleDownload = async () => {
    try {
      // Fetch the file with proper response handling
      const response = await fetch(bank.passbook_or_statement, {
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

      // Get the blob
      const blob = await response.blob();
      const filename = bank.passbook_or_statement.split("/").pop() || "document.pdf";

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
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
    onDelete(bank.id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteNominee = (nominee) => {
    setSelectedNominee(nominee);
    setDeleteNomineeDialogOpen(true);
  };

  const handleConfirmDeleteNominee = async () => {
    if (!selectedNominee) return;
    
    try {
      const response = await deleteNominee("bank", selectedNominee.id);
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

  return (
    <>
      <Card className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className={'p-6 pb-0'}>
          <CardTitle>{bank.bank_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-semibold mt-2 truncate">{bank.account_number || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">IFSC Code</p>
              <p className="font-semibold mt-2 truncate">{bank.ifsc_code || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Account Holder</p>
              <p className="font-semibold mt-2 truncate">{bank.account_holder_name || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Account Type</p>
              <p className="font-semibold mt-2 truncate">{bank.account_type || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Branch Name</p>
              <p className="font-semibold mt-2 truncate">{bank.branch_name || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Linked Phone</p>
              <p className="font-semibold mt-2 truncate">{bank.linked_mobile_number || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="font-semibold mt-2 truncate">₹{bank.account_balance || "0"}</p>
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
        <CardFooter className="border-t p-2 justify-between">
          <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-3 items-center w-60 justify-between">
            {bank.passbook_or_statement ? (
              <span className="truncate">{bank.passbook_or_statement.split("/").pop()}</span>
            ) : (
              <span>No file attached</span>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleView}
                disabled={!bank.passbook_or_statement}
              >
                <Eye className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={!bank.passbook_or_statement}
              >
                <FileDown className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditBankDialog bank={bank} onBankUpdated={onEdit} />
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
            <DialogTitle>View Passbook/Statement</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {bank.passbook_or_statement && (
              <object
                data={bank.passbook_or_statement}
                type="application/pdf"
                width="100%"
                height="600px"
              >
                <p>
                  Your browser cannot display the PDF. Please use the download button instead.
                </p>
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
              Are you sure you want to delete the bank account "{bank.bank_name}"? This action cannot be undone.
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
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
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

export default BankCard;