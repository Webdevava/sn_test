'use client';

import { useState, useEffect, useCallback } from 'react';
import { listDocuments, deleteDocument } from '@/lib/document-api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  CirclePlus, 
  Pencil, 
  Trash2, 
  FileText, 
  Calendar, 
  Loader2, 
  BriefcaseBusiness
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AddDocumentDialog from "../dialogs/document/add-document";
import EditDocumentDialog from "../dialogs/document/edit-document";

export default function DocumentList({ maxHeight = "500px" }) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listDocuments();
      
      if (response.status === true) {
        setDocuments(response.data || []);
      } else {
        throw new Error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Fetch Documents Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch documents"
      });
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId) => {
    try {
      setIsDeleting(documentId);
      const response = await deleteDocument(documentId);
      
      if (response.status === true) {
        toast({
          title: "Success",
          description: "Document deleted successfully"
        });
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (error) {
      console.error("Delete Document Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete document"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = () => {
    fetchDocuments();
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = () => {
    fetchDocuments();
    setIsEditDialogOpen(false);
    setSelectedDocument(null);
  };

  if (isLoading && documents.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full shadow-sm max-h-96 flex flex-col">
      <div className="overflow-auto" style={{ maxHeight }}>
        <CardContent className="pt-4">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No documents yet</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                You have not added any documents yet.
                Please click on the button below to add details.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="overflow-hidden border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {doc.document_type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              Document Number: <span className="text-primary">{doc.document_number}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">
                              Issue Date: <span className="font-medium">{formatDate(doc.issue_date)}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">
                              Expiry Date: <span className="font-medium">{formatDate(doc.expiry_date)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(doc)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(doc.id)}
                          disabled={isDeleting === doc.id}
                        >
                          {isDeleting === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </div>
      
      {/* Fixed footer with add button */}
      <CardFooter className="border-t p-4 mt-auto">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Another Document
        </Button>
      </CardFooter>

      {/* Add Document Dialog */}
      <AddDocumentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Document Dialog */}
      <EditDocumentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        document={selectedDocument}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}