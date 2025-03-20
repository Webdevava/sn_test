// @/components/dialogs/edit-document.jsx
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner"; // Import sonner
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
import { updateDocument } from "@/lib/document-api";

const EditDocumentDialog = ({ open, onOpenChange, document, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    document_type: "",
    document_number: "",
    issue_date: "",
    expiry_date: "",
    extra_data: {},
  });
  const [extraDataInput, setExtraDataInput] = useState("");
  const [errors, setErrors] = useState({});

  const documentTypes = [
    { label: "Passport", value: "Passport" },
    { label: "Aadhaar", value: "Aadhaar" },
    { label: "PAN Card", value: "PAN Card" },
    { label: "Driving License", value: "Driving License" },
    { label: "Voter ID", value: "Voter ID" },
  ];

  useEffect(() => {
    if (document) {
      setFormData({
        document_type: document.document_type || "",
        document_number: document.document_number || "",
        issue_date: document.issue_date || "",
        expiry_date: document.expiry_date || "",
        extra_data: document.extra_data || {},
      });
      setExtraDataInput(JSON.stringify(document.extra_data || {}));
    }
  }, [document]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison

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
    const upperValue = value.toUpperCase().replace(/\s/g, ""); // Convert to uppercase, remove spaces
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

  const handleExtraDataChange = (e) => {
    const value = e.target.value;
    setExtraDataInput(value);
    try {
      const parsed = value ? JSON.parse(value) : {};
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Invalid JSON object");
      }
      setFormData((prev) => ({
        ...prev,
        extra_data: parsed,
      }));
      setErrors((prev) => ({ ...prev, extra_data: "" }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        extra_data: "Please enter a valid JSON object (e.g., {\"key\": \"value\"})",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || errors.extra_data) return;

    const payload = {
      ...formData,
      issue_date:
        ["Aadhaar", "PAN Card"].includes(formData.document_type) ? null : formData.issue_date,
      expiry_date:
        ["Aadhaar", "PAN Card", "Voter ID"].includes(formData.document_type)
          ? null
          : formData.expiry_date,
    };

    try {
      setIsSubmitting(true);
      const response = await updateDocument(document.id, payload);
      console.log("Edit Document Response:", response);

      if (response.status === true && response.data?.id) {
        toast.success("Document updated successfully"); // Use sonner
        resetForm();
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Edit Document Error:", error);
      toast.error(error.detail?.[0]?.msg || error.message || "Failed to update document"); // Use sonner
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
    setExtraDataInput("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[75vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-4 p-4">
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
              {formData.document_type &&
                !["Aadhaar", "PAN Card", "Voter ID"].includes(formData.document_type) && (
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
              <div className="grid gap-2">
                <Label htmlFor="extra_data">Additional Information (JSON)</Label>
                <Input
                  id="extra_data"
                  name="extra_data"
                  value={extraDataInput}
                  onChange={handleExtraDataChange}
                  placeholder='e.g., {"key": "value"} (optional)'
                />
                {errors.extra_data && (
                  <p className="text-destructive text-sm">{errors.extra_data}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-32 bg-popover border-foreground"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || errors.extra_data}
              className="w-32"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;