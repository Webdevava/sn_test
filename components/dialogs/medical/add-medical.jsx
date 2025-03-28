"use client";

import React, { useState, useEffect } from "react";
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
import { createMedicalInsurance, uploadMedicalInsuranceDocument } from "@/lib/medical-insurance-api";
import { createNominee } from "@/lib/nominee-api";
import { listFamilyMembers } from "@/lib/family-api";
import { toast } from "sonner";
import { Check, Plus, Trash } from "@phosphor-icons/react";

const StepIndicator = ({ number, isCompleted, isCurrent }) => {
  if (isCompleted) {
    return (
      <div className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-white">
        <Check className="h-4 w-4" />
      </div>
    );
  }
  if (isCurrent) {
    return (
      <div className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary bg-transparent relative">
        <div className="rounded-full w-2 h-2 bg-primary absolute" />
      </div>
    );
  }
  return (
    <div className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-muted-foreground" />
  );
};

const AddMedicalDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Insurance, 2: Nominee, 3: Document
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
  const [nominees, setNominees] = useState([]);
  const [newNominee, setNewNominee] = useState({ nominee_id: "", percentage: "" });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const policyTypes = ["Individual", "Family", "Group"];
  const installmentTypes = ["Monthly", "Quarterly", "Annually", "One Time"];
  const steps = [
    { number: 1, title: "Insurance Details" },
    { number: 2, title: "Add Nominee" },
    { number: 3, title: "Upload Document" },
  ];

  useEffect(() => {
    if (open && step === 2) {
      fetchFamilyMembers();
    }
  }, [open, step]);

  const fetchFamilyMembers = async () => {
    try {
      const response = await listFamilyMembers();
      if (response.status) {
        setFamilyMembers(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch family members");
    }
  };

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

  const handleNomineeChange = (e) => {
    const { id, value } = e.target;
    if (id === "percentage") {
      if (value === "" || (/^\d*$/.test(value) && parseInt(value) <= 100)) {
        setNewNominee((prev) => ({ ...prev, [id]: value }));
      }
    } else {
      setNewNominee((prev) => ({ ...prev, [id]: value }));
    }
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
        setInsuranceId(response.data.id);
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

  const handleAddNominee = async () => {
    if (!newNominee.nominee_id || !newNominee.percentage) {
      toast.error("Please select a family member and enter a percentage");
      return;
    }

    setLoading(true);
    try {
      const response = await createNominee("medical_insurance", {
        nominee_id: newNominee.nominee_id,
        percentage: parseInt(newNominee.percentage),
        asset_id: insuranceId,
      });
      if (response.status) {
        const selectedMember = familyMembers.find((m) => m.id === newNominee.nominee_id);
        setNominees([
          ...nominees,
          {
            id: response.data?.id,
            nominee_id: newNominee.nominee_id,
            first_name: selectedMember?.first_name,
            last_name: selectedMember?.last_name,
            relationship: selectedMember?.relationship,
            percentage: newNominee.percentage,
          },
        ]);
        setNewNominee({ nominee_id: "", percentage: "" });
        toast.success("Nominee added successfully");
      }
    } catch (error) {
      toast.error("Failed to add nominee");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveNominee = (nomineeId) => {
    setNominees(nominees.filter((n) => n.id !== nomineeId));
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (file) {
        if (file.type !== "application/pdf") {
          toast.error("Only PDF files are allowed");
          setLoading(false);
          return;
        }
        const response = await uploadMedicalInsuranceDocument(insuranceId, file);
        if (response.status) {
          toast.success("Document uploaded successfully");
        } else {
          throw new Error(response.message || "Failed to upload document");
        }
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
    setNominees([]);
    setNewNominee({ nominee_id: "", percentage: "" });
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
          <DialogTitle>
            {step === 1 ? "Add Medical Insurance" : step === 2 ? "Add Nominees" : "Upload Document"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className={`flex items-center ${s.number > step ? "opacity-50" : ""}`}>
                  <StepIndicator
                    number={s.number}
                    isCompleted={step > s.number}
                    isCurrent={step === s.number}
                  />
                  <div className="ml-2">
                    <div className="text-xs text-gray-500">STEP {s.number}</div>
                    <div className="text-sm font-medium">{s.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 mx-4 h-px ${step > index + 1 ? "bg-primary" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {step === 1 && (
            <form onSubmit={handleInsuranceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Nominees</Label>
                {nominees.length > 0 ? (
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
                                onClick={() => handleRemoveNominee(nominee.id)}
                                disabled={loading}
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
                ) : (
                  <p className="text-sm text-gray-500">No nominees added yet</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Select Family Member</Label>
                  <Select
                    value={newNominee.nominee_id}
                    onValueChange={(value) =>
                      setNewNominee((prev) => ({ ...prev, nominee_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select family member" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name} ({member.relationship})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Percentage</Label>
                  <Input
                    id="percentage"
                    type="text"
                    value={newNominee.percentage}
                    onChange={handleNomineeChange}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
              <Button onClick={handleAddNominee} disabled={loading}>
                Add Nominee
              </Button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleFileSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="file">Upload PDF Document (Optional)</Label>
                <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} />
                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                <p className="text-sm text-gray-500">Upload a PDF document related to the insurance, if available.</p>
              </div>
            </form>
          )}
        </div>

        <DialogFooter className="border-t p-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="w-32 bg-popover border-foreground"
            >
              Back
            </Button>
          )}
          {step < 3 && (
            <Button
              type="button"
              onClick={step === 1 ? handleInsuranceSubmit : () => setStep(step + 1)}
              disabled={loading}
              className="w-32"
            >
              {loading ? "Processing..." : "Next"}
            </Button>
          )}
          {step === 3 && (
            <Button
              type="button"
              onClick={handleFileSubmit}
              disabled={loading}
              className="w-32"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-32 bg-popover border-foreground"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalDialog;