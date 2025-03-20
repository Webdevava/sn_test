"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPropertyInsurance, uploadPropertyInsuranceDocument } from "@/lib/property-insurance-api";
import { toast } from "sonner";

const AddPropertyDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Insurance, 2: Document
  const [insuranceId, setInsuranceId] = useState(null);
  const [insuranceData, setInsuranceData] = useState({
    policy_type: "",
    policy_number: "",
    insurer_name: "",
    premium_amount: "",
    sum_insured: "",
    property_address: "",
    policy_term: "",
    policy_start_date: "",
    policy_expiry_date: "",
    linked_mobile: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const policyTypes = ["Home", "Office", "Shop", "Showroom", "Warehouse", "Plot", "Land", "Other"];

  const validateInsurance = () => {
    const newErrors = {};
    if (!insuranceData.policy_type) newErrors.policy_type = "Policy type is required";
    if (!insuranceData.policy_number) newErrors.policy_number = "Policy number is required";
    if (!insuranceData.insurer_name) newErrors.insurer_name = "Insurer name is required";
    if (!insuranceData.premium_amount || insuranceData.premium_amount <= 0) newErrors.premium_amount = "Premium amount must be positive";
    if (!insuranceData.sum_insured || insuranceData.sum_insured <= 0) newErrors.sum_insured = "Sum insured must be positive";
    if (!insuranceData.property_address) newErrors.property_address = "Property address is required";
    if (!insuranceData.policy_term || insuranceData.policy_term <= 0) newErrors.policy_term = "Policy term must be positive";
    if (!insuranceData.policy_start_date) newErrors.policy_start_date = "Start date is required";
    if (!insuranceData.policy_expiry_date) newErrors.policy_expiry_date = "Expiry date is required";
    if (insuranceData.linked_mobile && !/^\d{10}$/.test(insuranceData.linked_mobile)) newErrors.linked_mobile = "Mobile must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = () => {
    const newErrors = {};
    if (!file) newErrors.file = "Please select a PDF file";
    else if (file.type !== "application/pdf") newErrors.file = "Only PDF files are allowed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInsuranceChange = (e) => {
    const { id, value } = e.target;
    setInsuranceData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleInsuranceSubmit = async (e) => {
    e.preventDefault();
    if (!validateInsurance()) return;

    setLoading(true);
    try {
      const response = await createPropertyInsurance(insuranceData);
      if (response.status) {
        toast.success("Property insurance created successfully");
        setInsuranceId(response.data.id); // Assuming ID is in response.data.id
        setStep(2);
      } else {
        throw new Error(response.message || "Failed to create insurance");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create insurance");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!validateFile()) return;

    setLoading(true);
    try {
      const response = await uploadPropertyInsuranceDocument(insuranceId, file);
      if (response.status) {
        toast.success("Document uploaded successfully");
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || "Failed to upload document");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInsuranceData({
      policy_type: "",
      policy_number: "",
      insurer_name: "",
      premium_amount: "",
      sum_insured: "",
      property_address: "",
      policy_term: "",
      policy_start_date: "",
      policy_expiry_date: "",
      linked_mobile: "",
    });
    setFile(null);
    setInsuranceId(null);
    setStep(1);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{step === 1 ? "Add Property Insurance" : "Upload Document"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleInsuranceSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="policy_type">Policy Type</Label>
                  <Select
                    value={insuranceData.policy_type}
                    onValueChange={(value) => handleInsuranceChange({ target: { id: "policy_type", value } })}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select policy type" /></SelectTrigger>
                    <SelectContent>
                      {policyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.policy_type && <p className="text-red-500 text-sm">{errors.policy_type}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_number">Policy Number</Label>
                  <Input id="policy_number" value={insuranceData.policy_number} onChange={handleInsuranceChange} required />
                  {errors.policy_number && <p className="text-red-500 text-sm">{errors.policy_number}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="insurer_name">Insurer Name</Label>
                  <Input id="insurer_name" value={insuranceData.insurer_name} onChange={handleInsuranceChange} required />
                  {errors.insurer_name && <p className="text-red-500 text-sm">{errors.insurer_name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="premium_amount">Premium Amount</Label>
                  <Input id="premium_amount" type="number" value={insuranceData.premium_amount} onChange={handleInsuranceChange} required />
                  {errors.premium_amount && <p className="text-red-500 text-sm">{errors.premium_amount}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sum_insured">Sum Insured</Label>
                  <Input id="sum_insured" type="number" value={insuranceData.sum_insured} onChange={handleInsuranceChange} required />
                  {errors.sum_insured && <p className="text-red-500 text-sm">{errors.sum_insured}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="property_address">Property Address</Label>
                  <Input id="property_address" value={insuranceData.property_address} onChange={handleInsuranceChange} required />
                  {errors.property_address && <p className="text-red-500 text-sm">{errors.property_address}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_term">Policy Term (Years)</Label>
                  <Input id="policy_term" type="number" value={insuranceData.policy_term} onChange={handleInsuranceChange} required />
                  {errors.policy_term && <p className="text-red-500 text-sm">{errors.policy_term}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_start_date">Start Date</Label>
                  <Input id="policy_start_date" type="date" value={insuranceData.policy_start_date} onChange={handleInsuranceChange} required />
                  {errors.policy_start_date && <p className="text-red-500 text-sm">{errors.policy_start_date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_expiry_date">Expiry Date</Label>
                  <Input id="policy_expiry_date" type="date" value={insuranceData.policy_expiry_date} onChange={handleInsuranceChange} required />
                  {errors.policy_expiry_date && <p className="text-red-500 text-sm">{errors.policy_expiry_date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linked_mobile">Linked Mobile</Label>
                  <Input id="linked_mobile" value={insuranceData.linked_mobile} onChange={handleInsuranceChange} maxLength={10} />
                  {errors.linked_mobile && <p className="text-red-500 text-sm">{errors.linked_mobile}</p>}
                </div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Next"}</Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleFileSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Upload PDF Document</Label>
                  <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} />
                  {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                  <p className="text-sm text-gray-500">Upload a PDF document related to the insurance.</p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;