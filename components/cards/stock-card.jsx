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
import EditStockDialog from "@/components/dialogs/stocks/edit-stock";
import { getStockDetail } from "@/lib/stock-api"; // Assume this API exists to fetch stock details
import { deleteNominee } from "@/lib/nominee-api";
import { toast } from "sonner";

const StockCard = ({ stock, onEdit, onDelete }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteNomineeDialogOpen, setDeleteNomineeDialogOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailedStock, setDetailedStock] = useState(stock);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        setLoadingDetails(true);
        const response = await getStockDetail(stock.id); // Assume this API returns detailed stock info
        if (response.status) {
          setDetailedStock(response.data);
          setNominees(response.data.nominee || []);
          setDocumentUrl(response.data.document || null);
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
        toast.error("Failed to load stock details");
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchStockDetails();
  }, [stock.id]);

  const handleDownload = async () => {
    if (!documentUrl) return;
    try {
      const response = await fetch(documentUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        headers: { "Accept": "application/pdf,image/*" },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    if (documentUrl) setViewDialogOpen(true);
    else toast.error("No document available to view");
  };

  const handleConfirmDelete = () => {
    onDelete(stock.id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteNominee = (nominee) => {
    setSelectedNominee(nominee);
    setDeleteNomineeDialogOpen(true);
  };

  const handleConfirmDeleteNominee = async () => {
    if (!selectedNominee) return;
    try {
      const response = await deleteNominee("stock", selectedNominee.id);
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
    onEdit();
    setEditDialogOpen(false);
  };

  const isImage = documentUrl?.match(/\.(jpeg|jpg|png)$/i);

  return (
    <>
      <Card className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle className="flex justify-between items-center text-base sm:text-lg">
            {detailedStock.stock_name}
            <Badge variant="default">{detailedStock.stock_exchange}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Demat Account</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">{detailedStock.account_number || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">{detailedStock.quantity || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Purchase Price</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">₹{detailedStock.purchase_price || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Current Price</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">₹{detailedStock.current_price || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Investment</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">₹{detailedStock.total_investment || "0"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Purchase Date</p>
              <p className="font-semibold mt-1 sm:mt-2 truncate">
                {detailedStock.purchase_date ? new Date(detailedStock.purchase_date).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Nominee Table Section */}
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
                      <tr key={nominee.id || index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
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
              <Button variant="ghost" size="icon" onClick={handleView} disabled={!documentUrl}>
                <Eye className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!documentUrl}>
                <FileDown className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="icon" onClick={() => setEditDialogOpen(true)}>
              <PenLine className="h-4 w-4 text-foreground" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Document View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[90%] sm:max-h-[90%]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full overflow-auto">
            {documentUrl && (
              <>
                {isImage ? (
                  <img src={documentUrl} alt="Stock Document" className="w-full h-auto" />
                ) : (
                  <object data={documentUrl} type="application/pdf" width="100%" height="600px">
                    <p>Your browser cannot display the PDF. Please use the download button instead.</p>
                  </object>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the stock "{detailedStock.stock_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Stock Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <EditStockDialog stock={detailedStock} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>

      {/* Delete Nominee Dialog */}
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
            <Button variant="destructive" onClick={handleConfirmDeleteNominee}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StockCard;