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
import { createVehicleInsurance, uploadVehicleInsuranceDocument } from "@/lib/vehicle-insurance-api";
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

const AddVehicleDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Insurance, 2: Nominee, 3: Document
  const [insuranceId, setInsuranceId] = useState(null);
  const [insuranceData, setInsuranceData] = useState({
    vehicle_type: "",
    policy_number: "",
    insurer_name: "",
    premium_amount: "",
    sum_insured: "",
    policy_term: "",
    start_date: "",
    expiry_date: "",
    linked_mobile: "",
    vehicle_registration_number: "",
    coverage_details: "",
  });
  const [nominees, setNominees] = useState([]);
  const [newNominee, setNewNominee] = useState({ nominee_id: "", percentage: "" });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const vehicleTypes = ["car", "bike", "scooter", "truck", "bus", "auto", "other"];
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
    if (!insuranceData.vehicle_type) newErrors.vehicle_type = "Vehicle type is required";
    if (!insuranceData.policy_number || insuranceData.policy_number.trim().length < 1) newErrors.policy_number = "Policy number is required";
    if (!insuranceData.insurer_name || insuranceData.insurer_name.trim().length < 1) newErrors.insurer_name = "Insurer name is required";
    if (!insuranceData.premium_amount || isNaN(insuranceData.premium_amount) || parseFloat(insuranceData.premium_amount) <= 0)
      newErrors.premium_amount = "Premium amount must be a positive number";
    if (!insuranceData.sum_insured || isNaN(insuranceData.sum_insured) || parseFloat(insuranceData.sum_insured) <= 0)
      newErrors.sum_insured = "Sum insured must be a positive number";
    if (!insuranceData.policy_term || isNaN(insuranceData.policy_term) || parseInt(insuranceData.policy_term) <= 0)
      newErrors.policy_term = "Policy term must be a positive integer";
    if (!insuranceData.start_date) newErrors.start_date = "Start date is required";
    else if (insuranceData.start_date > today) newErrors.start_date = "Start date cannot be in the future";
    if (!insuranceData.expiry_date) newErrors.expiry_date = "Expiry date is required";
    else if (insuranceData.expiry_date < insuranceData.start_date) newErrors.expiry_date = "Expiry date must be after start date";
    if (insuranceData.linked_mobile && !/^\d{10}$/.test(insuranceData.linked_mobile))
      newErrors.linked_mobile = "Mobile must be exactly 10 digits";
    if (!insuranceData.vehicle_registration_number || !/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(insuranceData.vehicle_registration_number))
      newErrors.vehicle_registration_number = "Registration number must be in format XX12XX1234 (e.g., MH12GB5660)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInsuranceChange = (e) => {
    const { id, value } = e.target;
    if (["sum_insured", "premium_amount"].includes(id)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "policy_term") {
      if (value === "" || /^\d*$/.test(value)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "linked_mobile") {
      if (value === "" || (/^\d*$/.test(value) && value.length <= 10)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "vehicle_registration_number") {
      if (value.length <= 10 && /^[A-Z0-9]*$/.test(value)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value.toUpperCase() }));
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
      const response = await createVehicleInsurance({
        ...insuranceData,
        sum_insured: parseFloat(insuranceData.sum_insured),
        premium_amount: parseFloat(insuranceData.premium_amount),
        policy_term: parseInt(insuranceData.policy_term),
        coverage_details: insuranceData.coverage_details.length ? insuranceData.coverage_details.split(",") : [],
      });
      if (response.status) {
        toast.success("Vehicle insurance created successfully");
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
      const response = await createNominee("vehicle", {
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
        const response = await uploadVehicleInsuranceDocument(insuranceId, file);
        if (response.status) {
          toast.success("Document uploaded successfully");
        } else {
          throw new Error(response.message || "Failed to upload document");
        }
      } else {
        toast.success("Vehicle insurance saved without document");
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
      vehicle_type: "",
      policy_number: "",
      insurer_name: "",
      premium_amount: "",
      sum_insured: "",
      policy_term: "",
      start_date: "",
      expiry_date: "",
      linked_mobile: "",
      vehicle_registration_number: "",
      coverage_details: "",
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
            {step === 1 ? "Add Vehicle Insurance" : step === 2 ? "Add Nominees" : "Upload Document"}
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
                  <Label htmlFor="vehicle_type">Vehicle Type</Label>
                  <Select
                    value={insuranceData.vehicle_type}
                    onValueChange={(value) =>
                      handleInsuranceChange({ target: { id: "vehicle_type", value } })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicle_type && <p className="text-red-500 text-sm">{errors.vehicle_type}</p>}
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
                  <Label htmlFor="insurer_name">Insurer Name</Label>
                  <Input
                    id="insurer_name"
                    value={insuranceData.insurer_name}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., ICICI"
                  />
                  {errors.insurer_name && <p className="text-red-500 text-sm">{errors.insurer_name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="premium_amount">Premium Amount (₹)</Label>
                  <Input
                    id="premium_amount"
                    type="text"
                    value={insuranceData.premium_amount}
                    onChange={handleInsuranceChange}
                    required
                    placeholder="e.g., 5000"
                  />
                  {errors.premium_amount && <p className="text-red-500 text-sm">{errors.premium_amount}</p>}
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
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={insuranceData.expiry_date}
                    onChange={handleInsuranceChange}
                    min={insuranceData.start_date || today}
                    required
                  />
                  {errors.expiry_date && <p className="text-red-500 text-sm">{errors.expiry_date}</p>}
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
                <div className="grid gap-2">
                  <Label htmlFor="vehicle_registration_number">Registration Number</Label>
                  <Input
                    id="vehicle_registration_number"
                    value={insuranceData.vehicle_registration_number}
                    onChange={handleInsuranceChange}
                    required
                    maxLength={10}
                    placeholder="e.g., MH12GB5660"
                  />
                  {errors.vehicle_registration_number && <p className="text-red-500 text-sm">{errors.vehicle_registration_number}</p>}
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="coverage_details">Coverage Details (comma-separated)</Label>
                  <Input
                    id="coverage_details"
                    value={insuranceData.coverage_details}
                    onChange={handleInsuranceChange}
                    placeholder="e.g., Third Party, Comprehensive"
                  />
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

export default AddVehicleDialog;