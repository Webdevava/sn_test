import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDocument, uploadDocumentAttachments } from "@/lib/document-api";
import { File, X } from "lucide-react";

const AddDocumentDialog = ({ open, onOpenChange, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDocumentId, setCreatedDocumentId] = useState(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    document_type: "",
    document_number: "",
    issue_date: "",
    expiry_date: "",
    extra_data: {},
  });
  const [errors, setErrors] = useState({});

  const documentTypes = [
    { label: "Passport", value: "Passport" },
    { label: "Aadhaar", value: "Aadhaar" },
    { label: "PAN Card", value: "PAN Card" },
    { label: "Driving License", value: "Driving License" },
    { label: "Voter ID", value: "Voter ID" },
  ];

  const validateFirstStep = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.document_type) newErrors.document_type = "Document type is required";
    if (!formData.document_number) {
      newErrors.document_number = "Document number is required";
    } else {
      const docNum = formData.document_number;
      switch (formData.document_type) {
        case "Aadhaar":
          if (!/^\d{12}$/.test(docNum)) newErrors.document_number = "Aadhaar must be exactly 12 digits";
          break;
        case "PAN Card":
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(docNum)) newErrors.document_number = "PAN Card must be 10 characters (e.g., ABCDE1234F)";
          break;
        case "Passport":
          if (!/^[A-Z][0-9]{7}$/.test(docNum)) newErrors.document_number = "Passport must be 8 characters (e.g., A1234567)";
          break;
        case "Driving License":
          if (!/^[A-Z]{2}[0-9]{13}$/.test(docNum)) newErrors.document_number = "Driving License must be 15 characters (e.g., AB1234567890123)";
          break;
        case "Voter ID":
          if (!/^[A-Z]{3}[0-9]{7}$/.test(docNum)) newErrors.document_number = "Voter ID must be 10 characters (e.g., ABC1234567)";
          break;
        default:
          break;
      }
    }

    if (formData.document_type === "Passport" || formData.document_type === "Driving License") {
      if (!formData.issue_date) newErrors.issue_date = "Issue date is required";
      if (!formData.expiry_date) newErrors.expiry_date = "Expiry date is required";
    }

    if (formData.issue_date) {
      const issueDate = new Date(formData.issue_date);
      if (issueDate > today) newErrors.issue_date = "Issue date cannot be in the future";
    }

    if (formData.expiry_date && formData.issue_date) {
      const expiryDate = new Date(formData.expiry_date);
      const issueDate = new Date(formData.issue_date);
      if (expiryDate <= issueDate) newErrors.expiry_date = "Expiry date must be after issue date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const upperValue = value.toUpperCase().replace(/\s/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: upperValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDocumentTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      document_type: value,
      issue_date: ["Aadhaar", "PAN Card"].includes(value) ? "" : prev.issue_date,
      expiry_date: ["Aadhaar", "PAN Card", "Voter ID"].includes(value) ? "" : prev.expiry_date,
    }));
    if (errors.document_type) {
      setErrors((prev) => ({
        ...prev,
        document_type: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => 
      file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    const invalidFiles = Array.from(e.target.files).filter(file => 
      file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      toast.error("Only PDF files under 5MB are allowed");
    }

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleFirstStepSubmit = (e) => {
    // Prevent default form submission
    e.preventDefault();
    
    if (validateFirstStep()) {
      // Move to next step without page refresh
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      issue_date: ["Aadhaar", "PAN Card"].includes(formData.document_type) ? null : formData.issue_date,
      expiry_date: ["Aadhaar", "PAN Card", "Voter ID"].includes(formData.document_type) ? null : formData.expiry_date,
    };

    try {
      setIsSubmitting(true);
      const response = await createDocument(payload);
      console.log("Add Document Response:", response);

      if (response.status === true) {
        const documentId = response.data.id;
        setCreatedDocumentId(documentId);

        // Upload attachments if files exist
        if (files.length > 0) {
          await uploadDocumentAttachments(documentId, files);
        }

        toast.success(response.message || "Document added successfully");
        resetForm();
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error("Document addition failed");
      }
    } catch (error) {
      console.error("Add Document Error:", error);
      toast.error(error.detail?.[0]?.msg || error.message || "Failed to add document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      document_type: "",
      document_number: "",
      issue_date: "",
      expiry_date: "",
      extra_data: {},
    });
    setFiles([]);
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const renderFirstStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="document_type">Document Type</Label>
        <Select onValueChange={handleDocumentTypeChange} value={formData.document_type}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.document_type && (
          <p className="text-destructive text-sm">{errors.document_type}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="document_number">Document Number</Label>
        <Input
          id="document_number"
          name="document_number"
          value={formData.document_number}
          onChange={handleInputChange}
          placeholder="Enter document number"
        />
        {errors.document_number && (
          <p className="text-destructive text-sm">{errors.document_number}</p>
        )}
      </div>
      {formData.document_type && !["Aadhaar", "PAN Card"].includes(formData.document_type) && (
        <div className="grid gap-2">
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input
            id="issue_date"
            name="issue_date"
            type="date"
            value={formData.issue_date}
            onChange={handleInputChange}
          />
          {errors.issue_date && (
            <p className="text-destructive text-sm">{errors.issue_date}</p>
          )}
        </div>
      )}
      {formData.document_type && !["Aadhaar", "PAN Card", "Voter ID"].includes(formData.document_type) && (
        <div className="grid gap-2">
          <Label htmlFor="expiry_date">Expiry Date</Label>
          <Input
            id="expiry_date"
            name="expiry_date"
            type="date"
            value={formData.expiry_date}
            onChange={handleInputChange}
          />
          {errors.expiry_date && (
            <p className="text-destructive text-sm">{errors.expiry_date}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderSecondStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Upload Supporting Documents (PDF only)</Label>
        <div className="border-dashed border-2 border-gray-300 p-4 text-center">
          <input 
            type="file" 
            accept=".pdf" 
            multiple 
            onChange={handleFileChange} 
            className="hidden" 
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:underline">
            Click to select PDF files
          </label>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: 5MB</p>
        </div>
        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Selected Files:</p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[75vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            {step === 1 ? "Add Document Details" : "Upload Supporting Documents"}
          </DialogTitle>
        </DialogHeader>
        <form 
          onSubmit={step === 1 ? handleFirstStepSubmit : handleSubmit} 
          className="flex flex-col h-full"
        >
          <div className="flex-1 overflow-y-auto p-4">
            {step === 1 ? renderFirstStep() : renderSecondStep()}
          </div>
          <DialogFooter className="border-t p-4 flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-32"
              >
                Back
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-32"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-32"
              >
                {step === 1 
                  ? "Next" 
                  : (isSubmitting ? "Adding..." : "Add Document")
                }
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;