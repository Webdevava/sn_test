// @/components/DocumentList.jsx (assuming this is the file path)
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from "sonner"; // Import sonner
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { listDocuments, deleteDocument } from "@/lib/document-api";
import { cn } from "@/lib/utils";
import AddDocumentDialog from "../dialogs/document/add-document";
import EditDocumentDialog from "../dialogs/document/edit-document";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listDocuments();
      console.log("Fetch Documents Response:", response);

      // Check if the response indicates success
      if (response.status === true) {
        setDocuments(response.data || []); // Set documents, even if empty
      } else {
        throw new Error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Fetch Documents Error:", error);
      toast.error(error.message || "Failed to fetch documents"); // Use sonner toast
      setDocuments([]); // Reset to empty on error to avoid stale data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshTrigger]);

  const handleDelete = async (documentId) => {
    try {
      setIsDeleting(documentId);
      const response = await deleteDocument(documentId);
      console.log("Delete Document Response:", response);

      if (response.status === true) {
        toast.success("Document deleted successfully"); // Use sonner toast
        setRefreshTrigger((prev) => prev + 1); // Trigger fetchDocuments
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (error) {
      console.error("Delete Document Error:", error);
      toast.error(error.message || "Failed to delete document"); // Use sonner toast
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = () => {
    console.log("handleAddSuccess triggered");
    setRefreshTrigger((prev) => prev + 1);
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = () => {
    console.log("handleEditSuccess triggered");
    setRefreshTrigger((prev) => prev + 1);
    setIsEditDialogOpen(false);
    setSelectedDocument(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-muted rounded-lg w-80 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-3">
        <p className="text-center text-sm">
          <span>
            You have not added <span className="font-semibold">"Document"</span> yet.{" "}
          </span>
          <br />
          <span>
            Please Click on <span className="font-semibold">"Add document"</span> button to
            add details.
          </span>
        </p>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Document
        </Button>
        <AddDocumentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleAddSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <Toaster richColors /> {/* Add Toaster component for sonner */}
      {documents.map((doc) => (
        <Card key={doc.id} className="relative group">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700"
                    )}
                  >
                    {doc.document_type}
                  </span>
                </div>
                <p className="text-sm">Number: {doc.document_number}</p>
                <p className="text-sm">Issue Date: {doc.issue_date}</p>
                <p className="text-sm">Expiry Date: {doc.expiry_date}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEdit(doc)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(doc.id)}
                  disabled={isDeleting === doc.id}
                >
                  {isDeleting === doc.id ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center pt-4">
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Another Document
        </Button>
        <AddDocumentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleAddSuccess}
        />
        <EditDocumentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          document={selectedDocument}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
};

export default DocumentList;