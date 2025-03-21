"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileDown, PenLine, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { listStocks, deleteStock } from "@/lib/stock-api";
import { toast, Toaster } from "sonner";
import AddStockDialog from "@/components/dialogs/stocks/add-stock";
import EditStockDialog from "@/components/dialogs/stocks/edit-stock";
import { ChartLineUp as StockIcon } from "@phosphor-icons/react";

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      if (response.status && response.data) {
        setStocks(response.data);
      }
    } catch (err) {
      setError("Failed to fetch stocks");
      toast.error("Failed to fetch stocks");
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
        setStocks(stocks.filter((stock) => stock.id !== id));
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

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url || "#";
    link.download = url?.split("/").pop() || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSuccess = () => {
    fetchStocks();
  };

  if (loading && !stocks.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <StockIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading stocks...</p>
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
            Stocks ({stocks.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
            <StockIcon size={20} />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Always render dialogs */}
      <AddStockDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleSuccess} />
      <EditStockDialog open={openEditDialog} onOpenChange={setOpenEditDialog} stock={selectedStock} onSuccess={handleSuccess} />

      {error ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <StockIcon size={36} className="mb-4 text-red-400 sm:size-48" />
          <p className="text-red-500 text-base sm:text-lg">{error}</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Something went wrong. Try adding a stock or refresh the page.
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <StockIcon size={20} />
              Add Stock
            </Button>
          </div>
        </div>
      ) : stocks.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <StockIcon size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No stocks found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first stock
          </p>
          <div className="mt-4">
            <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
              <StockIcon size={20} />
              Add Stock
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {stocks.map((stock) => (
            <Card key={stock.id} className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6 pb-0">
                <CardTitle className="flex justify-between items-center text-base sm:text-lg">
                  {stock.stock_name}
                  <Badge variant="default">{stock.stock_exchange}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Demat Account</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{stock.account_number || "N/A"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">{stock.quantity || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Purchase Price</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">₹{stock.purchase_price || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">₹{stock.current_price || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Investment</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">₹{stock.total_investment || "0"}</p>
                  </div>
                  <div className="bg-popover p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Purchase Date</p>
                    <p className="font-semibold mt-1 sm:mt-2 truncate">
                      {stock.purchase_date ? new Date(stock.purchase_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-2 sm:p-4 justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="bg-background/85 text-xs p-2 rounded-lg flex gap-2 sm:gap-3 items-center w-full sm:w-60 justify-between">
                  <span className="truncate">{stock.document?.split("/").pop() || "Document"}</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(stock)}>
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(stock.document)} disabled={!stock.document}>
                      <FileDown className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(stock)}>
                    <PenLine className="h-4 w-4 text-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedDeleteId(stock.id);
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
            <StockIcon size={20} />
            Add Stock
          </Button>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {selectedStock?.document && (
              <iframe src={selectedStock.document} width="100%" height="600px" title="Stock Document" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this stock? This action cannot be undone.</DialogDescription>
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