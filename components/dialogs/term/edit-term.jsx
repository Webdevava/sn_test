"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTermInsurance } from "@/lib/term-insurance-api";
import { toast } from "sonner";

const EditTermDialog = ({ open, onOpenChange, insurance, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policy_name: "",
    policy_number: "",
    insurer_name: "",
    sum_assured: "",
    premium_amount: "",
    policy_term: "",
    maturity_date: "",
    start_date: "",
    linked_mobile: "",
    coverage_detail: "",
    installment_type: "Annually",
  });
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0]; // Current date for validation

  const installmentTypes = ["Monthly", "Quarterly", "Annually", "One Time"];

  useEffect(() => {
    if (insurance) {
      setFormData({
        policy_name: insurance.policy_name || "",
        policy_number: insurance.policy_number || "",
        insurer_name: insurance.insurer_name || "",
        sum_assured: insurance.sum_assured?.toString() || "",
        premium_amount: insurance.premium_amount?.toString() || "",
        policy_term: insurance.policy_term?.toString() || "",
        maturity_date: insurance.maturity_date || "",
        start_date: insurance.start_date || "",
        linked_mobile: insurance.linked_mobile || "",
        coverage_detail: insurance.coverage_detail?.join(",") || "",
        installment_type: insurance.installment_type || "Annually",
      });
    }
  }, [insurance]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.policy_name || formData.policy_name.trim().length < 1) newErrors.policy_name = "Policy name is required";
    if (!formData.policy_number || formData.policy_number.trim().length < 1) newErrors.policy_number = "Policy number is required";
    if (!formData.insurer_name || formData.insurer_name.trim().length < 1) newErrors.insurer_name = "Insurer name is required";
    if (!formData.sum_assured || isNaN(formData.sum_assured) || parseFloat(formData.sum_assured) <= 0)
      newErrors.sum_assured = "Sum assured must be a positive number";
    if (!formData.premium_amount || isNaN(formData.premium_amount) || parseFloat(formData.premium_amount) <= 0)
      newErrors.premium_amount = "Premium amount must be a positive number";
    if (!formData.policy_term || isNaN(formData.policy_term) || parseInt(formData.policy_term) <= 0)
      newErrors.policy_term = "Policy term must be a positive integer";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    else if (formData.start_date > today) newErrors.start_date = "Start date cannot be in the future";
    if (!formData.maturity_date) newErrors.maturity_date = "Maturity date is required";
    else if (formData.maturity_date < formData.start_date) newErrors.maturity_date = "Maturity date must be after start date";
    if (formData.linked_mobile && !/^\d{10}$/.test(formData.linked_mobile))
      newErrors.linked_mobile = "Mobile must be exactly 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["sum_assured", "premium_amount"].includes(id)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "policy_term") {
      if (value === "" || /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "linked_mobile") {
      if (value === "" || (/^\d*$/.test(value) && value.length <= 10)) {
        setFormData((prev) => ({ ...prev, [id]: value }));
 Bookmarks      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await updateTermInsurance(insurance.id, {
        ...formData,
        sum_assured: parseFloat(formData.sum_assured),
        premium_amount: parseFloat(formData.premium_amount),
        policy_term: parseInt(formData.policy_term),
        coverage_detail: formData.coverage_detail.length ? formData.coverage_detail.split(",") : [],
      });
      if (response.status) {
        toast.success("Insurance updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response.message || "Failed to update insurance");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update insurance");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      policy_name: "",
      policy_number: "",
      insurer_name: "",
      sum_assured: "",
      premium_amount: "",
      policy_term: "",
      maturity_date: "",
      start_date: "",
      linked_mobile: "",
      coverage_detail: "",
      installment_type: "Annually",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Term Insurance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="policy_name">Policy Name</Label>
                <Input
                  id="policy_name"
                  value={formData.policy_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., HDFC Life"
                />
                {errors.policy_name && <p className="text-red-500 text-sm">{errors.policy_name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy_number">Policy Number</Label>
                <Input
                  id="policy_number"
                  value={formData.policy_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 12345678"
                />
                {errors.policy_number && <p className="text-red-500 text-sm">{errors.policy_number}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="insurer_name">Insurer Name</Label>
                <Input
                  id="insurer_name"
                  value={formData.insurer_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., HDFC"
                />
                {errors.insurer_name && <p className="text-red-500 text-sm">{errors.insurer_name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sum_assured">Sum Assured (₹)</Label>
                <Input
                  id="sum_assured"
                  type="text"
                  value={formData.sum_assured}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1000000"
                />
                {errors.sum_assured && <p className="text-red-500 text-sm">{errors.sum_assured}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="premium_amount">Premium Amount (₹)</Label>
                <Input
                  id="premium_amount"
                  type="text"
                  value={formData.premium_amount}
                  onChange={handleChange}
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
                  value={formData.policy_term}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 20"
                />
                {errors.policy_term && <p className="text-red-500 text-sm">{errors.policy_term}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
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
                  value={formData.maturity_date}
                  onChange={handleChange}
                  min={formData.start_date || today}
                  required
                />
                {errors.maturity_date && <p className="text-red-500 text-sm">{errors.maturity_date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linked_mobile">Linked Mobile</Label>
                <Input
                  id="linked_mobile"
                  type="text"
                  value={formData.linked_mobile}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="e.g., 9876543210"
                />
                {errors.linked_mobile && <p className="text-red-500 text-sm">{errors.linked_mobile}</p>}
              </div>
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="coverage_detail">Coverage Details (comma-separated)</Label>
                <Input
                  id="coverage_detail"
                  value={formData.coverage_detail}
                  onChange={handleChange}
                  placeholder="e.g., Death Benefit, Critical Illness"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="installment_type">Installment Type</Label>
                <Select
                  value={formData.installment_type}
                  onValueChange={(value) => handleChange({ target: { id: "installment_type", value } })}
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
            <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTermDialog;