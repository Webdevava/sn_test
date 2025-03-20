"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMedicalInsurance, uploadMedicalInsuranceDocument } from "@/lib/medical-insurance-api";
import { toast } from "sonner";

const AddMedicalDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Insurance, 2: Document
  const [insuranceId, setInsuranceId] = useState(null);
  const [insuranceData, setInsuranceData] = useState({
    policy_name: "",
    policy_number: "",
    policy_type: "",
    insurer_name: "",
    sum_insured: "",
    premium_amount: "",
    policy_term: "",
    maturity_date: "",
    start_date: "",
    linked_mobile: "",
    coverage_details: [],
    installment_type: "Annually",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0]; // Current date for validation

  const policyTypes = ["Individual", "Family", "Group"];
  const installmentTypes = ["Monthly", "Quarterly", "Annually", "One Time"];

  const validateInsurance = () => {
    const newErrors = {};
    if (!insuranceData.policy_name || insuranceData.policy_name.trim().length < 1) newErrors.policy_name = "Policy name is required";
    if (!insuranceData.policy_number || insuranceData.policy_number.trim().length < 1) newErrors.policy_number = "Policy number is required";
    if (!insuranceData.policy_type) newErrors.policy_type = "Policy type is required";
    if (!insuranceData.insurer_name || insuranceData.insurer_name.trim().length < 1) newErrors.insurer_name = "Insurer name is required";
    if (!insuranceData.sum_insured || isNaN(insuranceData.sum_insured) || parseFloat(insuranceData.sum_insured) <= 0)
      newErrors.sum_insured = "Sum insured must be a positive number";
    if (!insuranceData.premium_amount || isNaN(insuranceData.premium_amount) || parseFloat(insuranceData.premium_amount) <= 0)
      newErrors.premium_amount = "Premium amount must be a positive number";
    if (!insuranceData.policy_term || isNaN(insuranceData.policy_term) || parseInt(insuranceData.policy_term) <= 0)
      newErrors.policy_term = "Policy term must be a positive integer";
    if (!insuranceData.start_date) newErrors.start_date = "Start date is required";
    else if (insuranceData.start_date > today) newErrors.start_date = "Start date cannot be in the future";
    if (!insuranceData.maturity_date) newErrors.maturity_date = "Maturity date is required";
    else if (insuranceData.maturity_date < insuranceData.start_date) newErrors.maturity_date = "Maturity date must be after start date";
    if (insuranceData.linked_mobile && !/^\d{10}$/.test(insuranceData.linked_mobile))
      newErrors.linked_mobile = "Mobile must be exactly 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = () => {
    const newErrors = {};
    if (file && file.type !== "application/pdf") newErrors.file = "Only PDF files are allowed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInsuranceChange = (e) => {
    const { id, value } = e.target;
    if (["sum_insured", "premium_amount"].includes(id)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (["policy_term"].includes(id)) {
      if (value === "" || /^\d*$/.test(value)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "linked_mobile") {
      if (value === "" || (/^\d*$/.test(value) && value.length <= 10)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
      }
    } else {
      setInsuranceData((prev) => ({ ...prev, [id]: value }));
    }
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
      const response = await createMedicalInsurance({
        ...insuranceData,
        sum_insured: parseFloat(insuranceData.sum_insured),
        premium_amount: parseFloat(insuranceData.premium_amount),
        policy_term: parseInt(insuranceData.policy_term),
        coverage_details: insuranceData.coverage_details.length ? insuranceData.coverage_details.split(",") : [],
      });
      if (response.status) {
        toast.success("Insurance created successfully");
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
      if (file) {
        const response = await uploadMedicalInsuranceDocument(insuranceId, file);
        if (!response.status) {
          throw new Error(response.message || "Failed to upload document");
        }
        toast.success("Document uploaded successfully");
      } else {
        toast.success("Insurance saved without document");
      }
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInsuranceData({
      policy_name: "",
      policy_number: "",
      policy_type: "",
      insurer_name: "",
      sum_insured: "",
      premium_amount: "",
      policy_term: "",
      maturity_date: "",
      start_date: "",
      linked_mobile: "",
      coverage_details: [],
      installment_type: "Annually",
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
          <DialogTitle>{step === 1 ? "Add Medical Insurance" : "Upload Document"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleInsuranceSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="policy_name">Policy Name</Label>
                  <Input
                    id="policy_name"
                    value={insuranceData.policy_name}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., Star Health"
                  />
                  {errors.policy_name && <p className="text-red-500 text-sm">{errors.policy_name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_number">Policy Number</Label>
                  <Input
                    id="policy_number"
                    value={insuranceData.policy_number}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., 12345678"
                  />
                  {errors.policy_number && <p className="text-red-500 text-sm">{errors.policy_number}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_type">Policy Type</Label>
                  <Select
                    value={insuranceData.policy_type}
                    onValueChange={(value) => handleInsuranceChange({ target: { id: "policy_type", value } })}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {policyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.policy_type && <p className="text-red-500 text-sm">{errors.policy_type}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="insurer_name">Insurer Name</Label>
                  <Input
                    id="insurer_name"
                    value={insuranceData.insurer_name}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., Star"
                  />
                  {errors.insurer_name && <p className="text-red-500 text-sm">{errors.insurer_name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sum_insured">Sum Insured (₹)</Label>
                  <Input
                    id="sum_insured"
                    type="text"
                    value={insuranceData.sum_insured}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., 500000"
                  />
                  {errors.sum_insured && <p className="text-red-500 text-sm">{errors.sum_insured}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="premium_amount">Premium Amount (₹)</Label>
                  <Input
                    id="premium_amount"
                    type="text"
                    value={insuranceData.premium_amount}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., 10000"
                  />
                  {errors.premium_amount && <p className="text-red-500 text-sm">{errors.premium_amount}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="policy_term">Policy Term (Years)</Label>
                  <Input
                    id="policy_term"
                    type="text"
                    value={insuranceData.policy_term}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., 1"
                  />
                  {errors.policy_term && <p className="text-red-500 text-sm">{errors.policy_term}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={insuranceData.start_date}
                    onChange={handleInsuranceChange}
                    max={today}
                    required
                  />
                  {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maturity_date">Maturity Date</Label>
                  <Input
                    id="maturity_date"
                    type="date"
                    value={insuranceData.maturity_date}
                    onChange={handleInsuranceChange}
                    min={insuranceData.start_date || today}
                    required
                  />
                  {errors.maturity_date && <p className="text-red-500 text-sm">{errors.maturity_date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linked_mobile">Linked Mobile</Label>
                  <Input
                    id="linked_mobile"
                    type="text"
                    value={insuranceData.linked_mobile}
                    onChange={handleInsuranceChange}
                    maxLength={10}
                    placeholder="e.g., 9876543210"
                  />
                  {errors.linked_mobile && <p className="text-red-500 text-sm">{errors.linked_mobile}</p>}
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="coverage_details">Coverage Details (comma-separated)</Label>
                  <Input
                    id="coverage_details"
                    value={insuranceData.coverage_details}
                    onChange={handleInsuranceChange}
                    placeholder="e.g., Hospitalization, OPD"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="installment_type">Installment Type</Label>
                  <Select
                    value={insuranceData.installment_type}
                    onValueChange={(value) => handleInsuranceChange({ target: { id: "installment_type", value } })}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {installmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="file">Upload PDF Document (Optional)</Label>
                  <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} />
                  {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                  <p className="text-sm text-gray-500">Upload a PDF document related to the insurance, if available.</p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalDialog;