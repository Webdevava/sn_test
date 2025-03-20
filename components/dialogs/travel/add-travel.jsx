"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTravelInsurance } from "@/lib/travel-insurance-api";
import { toast } from "sonner";

const AddTravelDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    travel_type: "",
    policy_number: "",
    insurer_name: "",
    premium_amount: "",
    sum_insured: "",
    policy_start_date: "",
    policy_expiry_date: "",
    linked_mobile: "",
    coverage_details: "",
    // installment_type: "Annually",
  });
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0]; // Current date for validation

  const travelTypes = ["Domestic", "International", "Other"];
  const installmentTypes = ["Monthly", "Quarterly", "Annually", "One Time"];

  const validateInsurance = () => {
    const newErrors = {};
    if (!insuranceData.travel_type) newErrors.travel_type = "Travel type is required";
    if (!insuranceData.policy_number || insuranceData.policy_number.trim().length < 1) newErrors.policy_number = "Policy number is required";
    if (!insuranceData.insurer_name || insuranceData.insurer_name.trim().length < 1) newErrors.insurer_name = "Insurer name is required";
    if (!insuranceData.premium_amount || isNaN(insuranceData.premium_amount) || parseFloat(insuranceData.premium_amount) <= 0)
      newErrors.premium_amount = "Premium amount must be a positive number";
    if (!insuranceData.sum_insured || isNaN(insuranceData.sum_insured) || parseFloat(insuranceData.sum_insured) <= 0)
      newErrors.sum_insured = "Sum insured must be a positive number";
    if (!insuranceData.policy_start_date) newErrors.policy_start_date = "Start date is required";
    else if (insuranceData.policy_start_date > today) newErrors.policy_start_date = "Start date cannot be in the future";
    if (!insuranceData.policy_expiry_date) newErrors.policy_expiry_date = "Expiry date is required";
    else if (insuranceData.policy_expiry_date < insuranceData.policy_start_date) newErrors.policy_expiry_date = "Expiry date must be after start date";
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
    } else if (id === "linked_mobile") {
      if (value === "" || (/^\d*$/.test(value) && value.length <= 10)) {
        setInsuranceData((prev) => ({ ...prev, [id]: value }));
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
      const response = await createTravelInsurance({
        ...insuranceData,
        sum_insured: parseFloat(insuranceData.sum_insured),
        premium_amount: parseFloat(insuranceData.premium_amount),
        coverage_details: insuranceData.coverage_details.length ? insuranceData.coverage_details.split(",") : [],
      });
      if (response.status) {
        toast.success("Travel insurance created successfully");
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
      travel_type: "",
      policy_number: "",
      insurer_name: "",
      premium_amount: "",
      sum_insured: "",
      policy_start_date: "",
      policy_expiry_date: "",
      linked_mobile: "",
      coverage_details: "",
      // installment_type: "Annually",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Add Travel Insurance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleInsuranceSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="travel_type">Travel Type</Label>
                <Select
                  value={insuranceData.travel_type}
                  onValueChange={(value) => handleInsuranceChange({ target: { id: "travel_type", value } })}
                  required
                >
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {travelTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.travel_type && <p className="text-red-500 text-sm">{errors.travel_type}</p>}
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
                  placeholder="e.g., Reliance"
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
                  placeholder="e.g., 100000"
                />
                {errors.sum_insured && <p className="text-red-500 text-sm">{errors.sum_insured}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy_start_date">Start Date</Label>
                <Input
                  id="policy_start_date"
                  type="date"
                  value={insuranceData.policy_start_date}
                  onChange={handleInsuranceChange}
                  max={today}
                  required
                />
                {errors.policy_start_date && <p className="text-red-500 text-sm">{errors.policy_start_date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy_expiry_date">Expiry Date</Label>
                <Input
                  id="policy_expiry_date"
                  type="date"
                  value={insuranceData.policy_expiry_date}
                  onChange={handleInsuranceChange}
                  min={insuranceData.policy_start_date || today}
                  required
                />
                {errors.policy_expiry_date && <p className="text-red-500 text-sm">{errors.policy_expiry_date}</p>}
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
                  placeholder="e.g., Trip Cancellation, Medical Emergency"
                />
              </div>
              {/* <div className="grid gap-2">
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
              </div> */}
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

export default AddTravelDialog;