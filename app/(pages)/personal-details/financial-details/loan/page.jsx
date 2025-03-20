"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { listSecuredLoans, listUnsecuredLoans, deleteSecuredLoan, deleteUnsecuredLoan } from "@/lib/loan-api";
import { toast, Toaster } from "sonner";
import AddLoanDialog from "@/components/dialogs/loan/add-loan";
import EditLoanDialog from "@/components/dialogs/loan/edit-loan";
import { Bank as LoanIcon } from "@phosphor-icons/react";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedDeleteType, setSelectedDeleteType] = useState(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const securedResponse = await listSecuredLoans();
      const unsecuredResponse = await listUnsecuredLoans();
      const securedLoans = securedResponse.status && securedResponse.data ? securedResponse.data.map(loan => ({ ...loan, type: "Secured" })) : [];
      const unsecuredLoans = unsecuredResponse.status && unsecuredResponse.data ? unsecuredResponse.data.map(loan => ({ ...loan, type: "Unsecured" })) : [];
      setLoans([...securedLoans, ...unsecuredLoans]);
    } catch (err) {
      setError("Failed to fetch loans");
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDelete = async () => {
    try {
      const response = selectedDeleteType === "Secured" ? await deleteSecuredLoan(selectedDeleteId) : await deleteUnsecuredLoan(selectedDeleteId);
      if (response.status) {
        setLoans(loans.filter((loan) => loan.id !== selectedDeleteId));
        toast.success("Loan deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete loan");
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
    setOpenEditDialog(true);
  };

  const handleView = (loan) => {
    setSelectedLoan(loan);
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
    fetchLoans();
  };

  if (loading && !loans.length) {
    return (
      <div className="text-center py-20 animate-pulse">
        <LoanIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Loading loans...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {/* <LoanIcon size={32} className="text-primary" /> */}
          <h1 className="text-xl font-bold">Loans ({loans.length})</h1>
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
          <LoanIcon size={20} />
          Add Loan
        </Button>
      </div>

      {/* Always render dialogs regardless of error state */}
      <AddLoanDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleSuccess} />
      <EditLoanDialog open={openEditDialog} onOpenChange={setOpenEditDialog} loan={selectedLoan} onSuccess={handleSuccess} />

      {error ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <LoanIcon size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-500 text-lg">{error}</p>
          <p className="text-gray-400 mt-2">Something went wrong. Try adding a loan or refresh the page.</p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <LoanIcon size={20} />
              Add Loan
            </Button>
          </div>
        </div>
      ) : loans.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <LoanIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No loans found</p>
          <p className="text-gray-400 mt-2">Click below to add your first loan</p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <LoanIcon size={20} />
              Add Loan
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1  gap-6">
          {loans.map((loan) => (
            <Card key={loan.id} className={`p-0 transition-all hover:shadow-lg hover:-translate-y-1 `}>
              <CardHeader className="p-6 pb-0">
                <CardTitle className="flex justify-between items-center">
                  {loan.lender_name}
                  <Badge className={loan.type === "Secured" ? "bg-blue-500" : "bg-green-500"}>{loan.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loan.type === "Secured" ? (
                    <>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Loan Type</p>
                        <p className="font-semibold mt-2 truncate">{loan.loan_type || "N/A"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold mt-2 truncate">₹{loan.loan_amount || "0"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">EMI Amount</p>
                        <p className="font-semibold mt-2 truncate">₹{loan.emi_amount || "0"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Remaining Balance</p>
                        <p className="font-semibold mt-2 truncate">₹{loan.remaining_loan_balance || "0"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="font-semibold mt-2 truncate">{loan.loan_start_date ? new Date(loan.loan_start_date).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <p className="font-semibold mt-2 truncate">{loan.loan_end_date ? new Date(loan.loan_end_date).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold mt-2 truncate">₹{loan.loan_amount || "0"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Remaining Balance</p>
                        <p className="font-semibold mt-2 truncate">₹{loan.remaining_balance || "0"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="font-semibold mt-2 truncate">{loan.loan_start_date ? new Date(loan.loan_start_date).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Repayment Date</p>
                        <p className="font-semibold mt-2 truncate">{loan.agreed_repayment_date ? new Date(loan.agreed_repayment_date).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Repayment Frequency</p>
                        <p className="font-semibold mt-2 truncate">{loan.repayment_frequency || "N/A"}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-2 justify-between">
                <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-3 items-center w-60 justify-between">
                  <span className="truncate">{loan.document?.split("/").pop() || "Document"}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(loan)}>
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(loan.document)} disabled={!loan.document}>
                      <FileDown className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(loan)}>
                    <PenLine className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => { setSelectedDeleteId(loan.id); setSelectedDeleteType(loan.type); setDeleteDialogOpen(true); }}>
                    <Trash className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {selectedLoan?.document && (
              <iframe src={selectedLoan.document} width="100%" height="600px" title="Loan Document" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this loan? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoansPage;