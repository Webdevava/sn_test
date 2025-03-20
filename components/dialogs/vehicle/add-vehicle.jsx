"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createVehicleInsurance } from "@/lib/vehicle-insurance-api";
import { toast } from "sonner";

const AddVehicleDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
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
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0]; // Current date for validation

  const vehicleTypes = ["car", "bike", "scooter", "truck", "bus", "auto", "other"];

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
      // Allow only uppercase letters and numbers, enforce max length
      if (value.length <= 10 && /^[A-Z0-9]*$/.test(value)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value.toUpperCase() }));
      }
    } else {
      setInsuranceData((prev) => ({ ...prev, [id]: value }));
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));
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
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || "Failed to create insurance");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create insurance");
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
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Add Vehicle Insurance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleInsuranceSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select
                  value={insuranceData.vehicle_type}
                  onValueChange={(value) => handleInsuranceChange({ target: { id: "vehicle_type", value } })}
                  required
                >
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
          </div>
          <DialogFooter className="border-t p-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;