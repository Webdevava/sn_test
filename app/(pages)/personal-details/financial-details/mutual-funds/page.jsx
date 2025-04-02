"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { listMutualFunds, deleteMutualFund } from "@/lib/mutual-fund-api";
import { toast, Toaster } from "sonner";
import AddMutualFundDialog from "@/components/dialogs/mutual-funds/add-mutual-funds";
import EditMutualFundDialog from "@/components/dialogs/mutual-funds/edit-mutual-funds";
import { CurrencyCircleDollar as FundIcon } from "@phosphor-icons/react";

const MutualFundsPage = () => {
  const [mutualFunds, setMutualFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchMutualFunds = async () => {
    try {
      setLoading(true);
      const response = await listMutualFunds();
      
      // If status is true and data exists, set the mutual funds
      if (response.status && response.data) {
        setMutualFunds(response.data);
      } else {
        // If status is false or no data (including "No mutual funds available"),
        // set an empty array - don't treat as an error
        setMutualFunds([]);
      }
    } catch (err) {
      console.error("Error fetching mutual funds:", err);
      // For unexpected errors (like network issues),
      // set empty array instead of showing error
      setMutualFunds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMutualFunds();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteMutualFund(id);
      if (response.status) {
        setMutualFunds(mutualFunds.filter((fund) => fund.id !== id));
        toast.success("Mutual fund deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete mutual fund");
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = (fund) => {
    setSelectedFund(fund);
    setOpenEditDialog(true);
  };

  const handleView = (fund) => {
    setSelectedFund(fund);
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
    fetchMutualFunds();
  };

  if (loading && !mutualFunds.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <FundIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading mutual funds...</p>
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
            Mutual Funds ({mutualFunds.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <FundIcon size={20} />
            Add Mutual Fund
          </Button>
        </div>
      </div>

      {/* Always render dialogs */}
      <AddMutualFundDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleSuccess} />
      <EditMutualFundDialog open={openEditDialog} onOpenChange={setOpenEditDialog} mutualFund={selectedFund} onSuccess={handleSuccess} />

      {mutualFunds.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <FundIcon size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No mutual funds found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first mutual fund
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <FundIcon size={20} />
              Add Mutual Fund
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {mutualFunds.map((fund) => (
            <Card key={fund.id} className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6 pb-0">
                <CardTitle className="flex justify-between items-center text-base sm:text-lg">
                  {fund.fund_name}
                </CardTitle>
                  {/* <Badge className={fund.mutual_fund_category "bg-blue-500" : "bg-green-500"}>{fund.mutual_fund_category}</Badge> */}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Fund Type</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{fund.fund_type || "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Units</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{fund.units || "0"}</p>
                  </div>
                  {fund.invested_amount && fund.invested_amount !== "None" && (
                    <div className="bg-popover p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Invested Amount</p>
                      <p className="font-semibold mt-1 sm:mt-2 truncate">₹{fund.invested_amount || "0"}</p>
                    </div>
                  )}
                  {fund.folio_number && (
                    <div className="bg-popover p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">Folio Number</p>
                      <p className="font-semibold mt-1 sm:mt-2 truncate">{fund.folio_number || "N/A"}</p>
                    </div>
                  )}
                  {fund.mutual_fund_category === "Recurring" && (
                    <>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">SIP Amount</p>
                        <p className="font-semibold mt-1 sm:mt-2 truncate">₹{fund.sip_amount || "0"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">SIP Frequency</p>
                        <p className="font-semibold mt-1 sm:mt-2 truncate">{fund.sip_frequency || "N/A"}</p>
                      </div>
                      <div className="bg-popover p-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">SIP Day</p>
                        <p className="font-semibold mt-1 sm:mt-2 truncate">{fund.sip_date || "N/A"}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-2 sm:p-4 justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-2 sm:gap-3 items-center w-full sm:w-60 justify-between">
                  <span className="truncate">{fund.document?.split("/").pop() || "Document"}</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(fund)}>
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(fund.document)} disabled={!fund.document}>
                      <FileDown className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(fund)}>
                    <PenLine className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedDeleteId(fund.id);
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
            <FundIcon size={20} />
            Add Mutual Fund
          </Button>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {selectedFund?.document && (
              <iframe src={selectedFund.document} width="100%" height="600px" title="Mutual Fund Document" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this mutual fund? This action cannot be undone.</DialogDescription>
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

export default MutualFundsPage;