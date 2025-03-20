"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { listDeposits, getDepositDetail, deleteDeposit } from "@/lib/deposit-api";
import { toast, Toaster } from "sonner";
import AddDepositDialog from "@/components/dialogs/deposit/add-deposit";
import EditDepositDialog from "@/components/dialogs/deposit/edit-deposit";
import { Bank } from "@phosphor-icons/react";

const FDRDPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedDeleteType, setSelectedDeleteType] = useState(null);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await listDeposits();
      if (response.status && response.data) {
        setDeposits(response.data);
      }
    } catch (err) {
      setError("Failed to fetch deposits");
      toast.error("Failed to fetch deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleDelete = async (depositType, id) => {
    try {
      const response = await deleteDeposit(depositType, id);
      if (response.status) {
        setDeposits(deposits.filter((dep) => dep.id !== id));
        toast.success("Deposit deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete deposit");
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = async (depositType, id) => {
    try {
      const response = await getDepositDetail(depositType, id);
      if (response.data) {
        setSelectedDeposit(response.data);
        setOpenEditDialog(true);
      }
    } catch (error) {
      toast.error("Failed to fetch deposit details");
    }
  };

  const handleView = (deposit) => {
    setSelectedDeposit(deposit);
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
    fetchDeposits();
  };

  if (loading && !deposits.length) {
    return (
      <div className="text-center py-20 animate-pulse">
        <Bank size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Loading deposits...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {/* <Bank size={32} className="text-primary" /> */}
          <h1 className="text-xl font-bold">Deposits (FD/RD) ({deposits.length})</h1>
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
          <Bank size={20} />
          Add Deposit
        </Button>
      </div>

      {/* Always render dialogs regardless of state */}
      <AddDepositDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleSuccess} />
      <EditDepositDialog open={openEditDialog} onOpenChange={setOpenEditDialog} deposit={selectedDeposit} onSuccess={handleSuccess} />

      {error ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <Bank size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-500 text-lg">{error}</p>
          <p className="text-gray-400 mt-2">Something went wrong. Try adding a deposit or refresh the page.</p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Bank size={20} />
              Add Deposit
            </Button>
          </div>
        </div>
      ) : deposits.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <Bank size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No deposits found</p>
          <p className="text-gray-400 mt-2">Click below to add your first deposit</p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <Bank size={20} />
              Add Deposit
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {deposits.map((deposit) => (
            <Card key={deposit.id} className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-6 pb-0">
                <CardTitle>{deposit.name} ({deposit.deposit_type})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Installment</p>
                    <p className="font-semibold mt-2 truncate">₹{deposit.installment || "0"} ({deposit.installment_type})</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                    <p className="font-semibold mt-2 truncate">{deposit.interest_rate || "0"}%</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Tenure</p>
                    <p className="font-semibold mt-2 truncate">{deposit.tenure || "N/A"} months</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Maturity Amount</p>
                    <p className="font-semibold mt-2 truncate">₹{deposit.maturity_amount || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Maturity Date</p>
                    <p className="font-semibold mt-2 truncate">{deposit.maturity_date ? new Date(deposit.maturity_date).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Mobile</p>
                    <p className="font-semibold mt-2 truncate">{deposit.linked_mobile_number || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-2 justify-between">
                <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-3 items-center w-60 justify-between">
                  <span className="truncate">{deposit.document?.split("/").pop() || "Document"}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(deposit)}>
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(deposit.document)} disabled={!deposit.document}>
                      <FileDown className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(deposit.deposit_type, deposit.id)}>
                    <PenLine className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => { setSelectedDeleteId(deposit.id); setSelectedDeleteType(deposit.deposit_type); setDeleteDialogOpen(true); }}>
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
            {selectedDeposit?.document && (
              <iframe src={selectedDeposit.document} width="100%" height="600px" title="Deposit Document" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this deposit? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedDeleteType, selectedDeleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FDRDPage;