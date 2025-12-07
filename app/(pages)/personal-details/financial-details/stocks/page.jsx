"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "sonner";
import AddStockDialog from "@/components/dialogs/stocks/add-stock";
import EditStockDialog from "@/components/dialogs/stocks/edit-stock";
import DocumentDownload from "@/components/document-download"; // ← NEW
import { ChartLineUp as StockIcon } from "@phosphor-icons/react";
import { listStocks, deleteStock } from "@/lib/stock-api";

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await listStocks();
      setStocks(response.status && response.data ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
      toast.error("Failed to load stocks");
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteStock(id);
      if (response.status) {
        setStocks(prev => prev.filter(s => s.id !== id));
        toast.success("Stock deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete stock");
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setOpenEditDialog(true);
  };

  const handleView = (stock) => {
    setSelectedStock(stock);
    setViewDialogOpen(true);
  };

  const handleDownloadDoc = (url) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  if (loading && !stocks.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <StockIcon size={48} className="mb-4 text-gray-400" />
        <p className="text-gray-500">Loading stocks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />

      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Stocks ({stocks.length})
        </h1>

        <div className="flex gap-3 items-center">
          {/* Download List Button */}
          {stocks.length > 0 && (
            <DocumentDownload 
              data={stocks} 
              title="Stock Portfolio" 
              buttonText="Download List"
            />
          )}

          {/* Add Button (Desktop) */}
          <div className="hidden sm:block">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <StockIcon size={20} />
              Add Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddStockDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={fetchStocks} />
      <EditStockDialog open={openEditDialog} onOpenChange={setOpenEditDialog} stock={selectedStock} onSuccess={fetchStocks} />

      {/* Empty State */}
      {stocks.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-6">
          <StockIcon size={80} className="mb-4 text-gray-400" />
          <p className="text-lg text-gray-500">No stocks found</p>
          <p className="text-gray-400 mt-2">Click below to add your first stock</p>
          <Button onClick={() => setOpenAddDialog(true)} className="mt-6 gap-2">
            <StockIcon size={20} />
            Add Stock
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {stocks.map((stock) => (
            <Card key={stock.id} className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{stock.stock_name}</span>
                  <Badge variant="default">{stock.stock_exchange || "N/A"}</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Demat Account</p>
                    <p className="font-medium">{stock.account_number || "N/A"}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Quantity</p>
                    <p className="font-medium">{stock.quantity || "0"}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Purchase Price</p>
                    <p className="font-medium">₹{stock.purchase_price || "0"}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Current Price</p>
                    <p className="font-medium">₹{stock.current_price || "0"}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Total Investment</p>
                    <p className="font-medium">₹{stock.total_investment || "0"}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-muted-foreground text-xs">Purchase Date</p>
                    <p className="font-medium">
                      {stock.purchase_date ? new Date(stock.purchase_date).toLocaleDateString("en-IN") : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4 flex justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground truncate max-w-40">
                    {stock.document ? stock.document.split("/").pop() : "No document"}
                  </span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleView(stock)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDownloadDoc(stock.document)}
                      disabled={!stock.document}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(stock)}>
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedDeleteId(stock.id);
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
          {stocks.length > 0 && (
            <DocumentDownload data={stocks} title="Stock Portfolio" />
          )}
          <Button onClick={() => setOpenAddDialog(true)} className="flex-1 gap-2">
            <StockIcon size={20} />
            Add Stock
          </Button>
        </div>
      </div>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-screen">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {selectedStock?.document ? (
            <iframe src={selectedStock.document} className="w-full h-[80vh]" title="Stock Document" />
          ) : (
            <p className="text-center py-10 text-muted-foreground">No document attached</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Stock?</DialogTitle>
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

export default StocksPage;