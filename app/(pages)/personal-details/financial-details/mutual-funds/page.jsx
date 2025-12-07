"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Toaster } from "sonner";
import AddMutualFundDialog from "@/components/dialogs/mutual-funds/add-mutual-funds";
import EditMutualFundDialog from "@/components/dialogs/mutual-funds/edit-mutual-funds";
import DocumentDownload from "@/components/document-download"; // ← NEW
import { CurrencyCircleDollar as FundIcon } from "@phosphor-icons/react";
import { listMutualFunds, deleteMutualFund } from "@/lib/mutual-fund-api";
import { Badge } from "@/components/ui/badge";

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
      setMutualFunds(response.status && response.data ? response.data : []);
    } catch (err) {
      console.error("Error fetching mutual funds:", err);
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
        setMutualFunds(prev => prev.filter(f => f.id !== id));
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

  const handleDownloadDoc = (url) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  if (loading && !mutualFunds.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <FundIcon size={48} className="mb-4 text-gray-400" />
        <p className="text-gray-500">Loading mutual funds...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />

      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Mutual Funds ({mutualFunds.length})
        </h1>

        <div className="flex gap-3 items-center">
          {/* Download List Button */}
          {mutualFunds.length > 0 && (
            <DocumentDownload 
              data={mutualFunds} 
              title="Mutual Funds" 
              buttonText="Download List"
            />
          )}

          {/* Add Button (Desktop) */}
          <div className="hidden sm:block">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <FundIcon size={20} />
              Add Mutual Fund
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddMutualFundDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={fetchMutualFunds} />
      <EditMutualFundDialog open={openEditDialog} onOpenChange={setOpenEditDialog} mutualFund={selectedFund} onSuccess={fetchMutualFunds} />

      {/* Empty State */}
      {mutualFunds.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-6">
          <FundIcon size={80} className="mb-4 text-gray-400" />
          <p className="text-lg text-gray-500">No mutual funds found</p>
          <p className="text-gray-400 mt-2">Click below to add your first mutual fund</p>
          <Button onClick={() => setOpenAddDialog(true)} className="mt-6 gap-2">
            <FundIcon size={20} />
            Add Mutual Fund
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {mutualFunds.map((fund) => (
            <Card key={fund.id} className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{fund.fund_name}</span>
                  {fund.mutual_fund_category && (
                    <Badge variant={fund.mutual_fund_category === "Recurring" ? "default" : "secondary"}>
                      {fund.mutual_fund_category}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Fund Type</p>
                    <p className="font-medium">{fund.fund_type || "N/A"}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Units</p>
                    <p className="font-medium">{fund.units || "0"}</p>
                  </div>
                  {fund.invested_amount && (
                    <div className="bg-muted/50 p-3 rounded">
                      <p className="text-muted-foreground text-xs">Invested Amount</p>
                      <p className="font-medium">₹{fund.invested_amount}</p>
                    </div>
                  )}
                  {fund.folio_number && (
                    <div className="bg-muted/50 p-3 rounded">
                      <p className="text-muted-foreground text-xs">Folio Number</p>
                      <p className="font-medium">{fund.folio_number}</p>
                    </div>
                  )}
                  {fund.mutual_fund_category === "Recurring" && (
                    <>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="text-muted-foreground text-xs">SIP Amount</p>
                        <p className="font-medium">₹{fund.sip_amount || "0"}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="text-muted-foreground text-xs">SIP Date</p>
                        <p className="font-medium">{fund.sip_date || "N/A"}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4 flex justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground truncate max-w-40">
                    {fund.document ? fund.document.split("/").pop() : "No document"}
                  </span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleView(fund)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDownloadDoc(fund.document)}
                      disabled={!fund.document}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(fund)}>
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedDeleteId(fund.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden z-10">
        <div className="flex gap-3 max-w-md mx-auto">
          {mutualFunds.length > 0 && (
            <DocumentDownload data={mutualFunds} title="Mutual Funds" />
          )}
          <Button onClick={() => setOpenAddDialog(true)} className="flex-1 gap-2">
            <FundIcon size={20} />
            Add Fund
          </Button>
        </div>
      </div>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-screen">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {selectedFund?.document ? (
            <iframe src={selectedFund.document} className="w-full h-[80vh]" title="Document" />
          ) : (
            <p className="text-center py-10 text-muted-foreground">No document attached</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mutual Fund?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
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