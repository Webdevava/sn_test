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
import EditDematDialog from "@/components/dialogs/demat/edit-demat";
import { getDematAccountDetail } from "@/lib/demat-account-api";
import { toast } from "sonner";

const DematCard = ({ dematAccount, onEdit, onDelete }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nominees, setNominees] = useState([]);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Fetch nominee and document details
  useEffect(() => {
    const fetchDematDetails = async () => {
      try {
        setLoadingDetails(true);
        const response = await getDematAccountDetail(dematAccount.id);
        if (response.status) {
          setNominees(response.data.nominee || []);
          setDocumentUrl(response.data.document || null);
        }
      } catch (error) {
        console.error("Error fetching demat details:", error);
        toast.error("Failed to load demat account details");
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDematDetails();
  }, [dematAccount.id]);

  const handleDownload = () => {
    if (!documentUrl) return;
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = documentUrl.split("/").pop() || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (documentUrl) {
      setViewDialogOpen(true);
    } else {
      toast.error("No document available to view");
    }
  };

  const handleConfirmDelete = () => {
    onDelete(dematAccount.id);
    setDeleteDialogOpen(false);
  };

  const isImage = documentUrl?.match(/\.(jpeg|jpg|png)$/i);

  return (
    <>
      <Card className="p-0 transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-6 pb-0">
          <CardTitle>{dematAccount.depository_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-semibold mt-2 truncate">{dematAccount.account_number || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Unique Client Code</p>
              <p className="font-semibold mt-2 truncate">{dematAccount.unique_client_code || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">DP ID</p>
              <p className="font-semibold mt-2 truncate">{dematAccount.dp_id || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Account Type</p>
              <p className="font-semibold mt-2 truncate">{dematAccount.account_type || "N/A"}</p>
            </div>
            <div className="bg-popover p-2 rounded-lg">
              <p className="text-xs text-muted-foreground">Linked Phone</p>
              <p className="font-semibold mt-2 truncate">{dematAccount.linked_mobile || "N/A"}</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {nominees.map((nominee, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="p-2">{`${nominee.first_name} ${nominee.last_name}`}</td>
                        <td className="p-2">{nominee.relationship}</td>
                        <td className="p-2">{nominee.percentage}%</td>
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
            {documentUrl ? (
              <span className="truncate">{documentUrl.split("/").pop()}</span>
            ) : (
              <span>No file attached</span>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleView}
                disabled={!documentUrl}
              >
                <Eye className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={!documentUrl}
              >
                <FileDown className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditDematDialog dematAccount={dematAccount} onDematUpdated={onEdit} />
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
                  <img
                    src={documentUrl}
                    alt="Demat Document"
                    className="w-full h-auto"
                  />
                ) : (
                  <iframe
                    src={documentUrl}
                    width="100%"
                    height="600px"
                    title="Demat Document"
                  />
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Demat Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the demat account "{dematAccount.depository_name}"? This action cannot be undone.
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
    </>
  );
};

export default DematCard;