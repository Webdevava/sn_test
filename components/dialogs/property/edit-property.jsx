"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updatePropertyInsurance } from "@/lib/property-insurance-api";
import { toast } from "sonner";

const EditPropertyDialog = ({ open, onOpenChange, insurance, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});

  const policyTypes = ["Home", "Office", "Shop", "Showroom", "Warehouse", "Plot", "Land", "Other"];

  useEffect(() => {
    if (insurance) {
      setFormData({
        policy_type: insurance.policy_type || "",
        policy_number: insurance.policy_number || "",
        insurer_name: insurance.insurer_name || "",
        premium_amount: insurance.premium_amount || "",
        sum_insured: insurance.sum_insured || "",
        property_address: insurance.property_address || "",
        policy_term: insurance.policy_term || "",
        policy_start_date: insurance.policy_start_date || "",
        policy_expiry_date: insurance.policy_expiry_date || "",
        linked_mobile: insurance.linked_mobile || "",
      });
    }
  }, [insurance]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.policy_type) newErrors.policy_type = "Policy type is required";
    if (!formData.policy_number) newErrors.policy_number = "Policy number is required";
    if (!formData.insurer_name) newErrors.insurer_name = "Insurer name is required";
    if (!formData.premium_amount || formData.premium_amount <= 0) newErrors.premium_amount = "Premium amount must be positive";
    if (!formData.sum_insured || formData.sum_insured <= 0) newErrors.sum_insured = "Sum insured must be positive";
    if (!formData.property_address) newErrors.property_address = "Property address is required";
    if (!formData.policy_term || formData.policy_term <= 0) newErrors.policy_term = "Policy term must be positive";
    if (!formData.policy_start_date) newErrors.policy_start_date = "Start date is required";
    if (!formData.policy_expiry_date) newErrors.policy_expiry_date = "Expiry date is required";
    if (formData.linked_mobile && !/^\d{10}$/.test(formData.linked_mobile)) newErrors.linked_mobile = "Mobile must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await updatePropertyInsurance(insurance.id, formData);
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
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Property Insurance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="policy_type">Policy Type</Label>
                <Select
                  value={formData.policy_type}
                  onValueChange={(value) => handleChange({ target: { id: "policy_type", value } })}
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
                <Input id="policy_number" value={formData.policy_number} onChange={handleChange} required />
                {errors.policy_number && <p className="text-red-500 text-sm">{errors.policy_number}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="insurer_name">Insurer Name</Label>
                <Input id="insurer_name" value={formData.insurer_name} onChange={handleChange} required />
                {errors.insurer_name && <p className="text-red-500 text-sm">{errors.insurer_name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="premium_amount">Premium Amount</Label>
                <Input id="premium_amount" type="number" value={formData.premium_amount} onChange={handleChange} required />
                {errors.premium_amount && <p className="text-red-500 text-sm">{errors.premium_amount}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sum_insured">Sum Insured</Label>
                <Input id="sum_insured" type="number" value={formData.sum_insured} onChange={handleChange} required />
                {errors.sum_insured && <p className="text-red-500 text-sm">{errors.sum_insured}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property_address">Property Address</Label>
                <Input id="property_address" value={formData.property_address} onChange={handleChange} required />
                {errors.property_address && <p className="text-red-500 text-sm">{errors.property_address}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy_term">Policy Term (Years)</Label>
                <Input id="policy_term" type="number" value={formData.policy_term} onChange={handleChange} required />
                {errors.policy_term && <p className="text-red-500 text-sm">{errors.policy_term}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy_start_date">Start Date</Label>
                <Input id="policy_start_date" type="date" value={formData.policy_start_date} onChange={handleChange} required />
                {errors.policy_start_date && <p className="text-red-500 text-sm">{errors.policy_start_date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy_expiry_date">Expiry Date</Label>
                <Input id="policy_expiry_date" type="date" value={formData.policy_expiry_date} onChange={handleChange} required />
                {errors.policy_expiry_date && <p className="text-red-500 text-sm">{errors.policy_expiry_date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linked_mobile">Linked Mobile</Label>
                <Input id="linked_mobile" value={formData.linked_mobile} onChange={handleChange} maxLength={10} />
                {errors.linked_mobile && <p className="text-red-500 text-sm">{errors.linked_mobile}</p>}
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

export default EditPropertyDialog;