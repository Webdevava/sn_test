"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAlreadyHeldMutualFund, createRecurringMutualFund } from "@/lib/mutual-fund-api";
import { toast } from "sonner";

const AddMutualFundDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Already Invested");
  const [formData, setFormData] = useState({
    fund_name: "",
    invested_amount: "",
    units: "",
    fund_type: "",
    folio_number: "",
    frequency: "Other",
    sip_amount: "",
    sip_frequency: "",
    sip_date: "",
  });
  const [errors, setErrors] = useState({});

  const validateFund = () => {
    const newErrors = {};
    if (!formData.fund_name) newErrors.fund_name = "Fund name is required";
    if (!formData.units || formData.units <= 0) newErrors.units = "Units must be positive";
    if (!formData.fund_type) newErrors.fund_type = "Fund type is required";
    if (!formData.frequency) newErrors.frequency = "Frequency is required";
    if (category === "Already Invested") {
      if (!formData.invested_amount || formData.invested_amount <= 0) newErrors.invested_amount = "Invested amount must be positive";
      if (!formData.folio_number) newErrors.folio_number = "Folio number is required";
    } else {
      if (!formData.sip_amount || formData.sip_amount <= 0) newErrors.sip_amount = "SIP amount must be positive";
      if (!formData.sip_frequency) newErrors.sip_frequency = "SIP frequency is required";
      if (!formData.sip_date || formData.sip_date < 1 || formData.sip_date > 31) newErrors.sip_date = "SIP day must be between 1 and 31";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSelectChange = (field) => (value) => {
    if (field === "category") {
      setCategory(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFundSubmit = async (e) => {
    e.preventDefault();
    if (!validateFund()) return;

    setLoading(true);
    try {
      let response;
      if (category === "Already Invested") {
        const payload = {
          fund_name: formData.fund_name,
          invested_amount: parseFloat(formData.invested_amount),
          units: parseFloat(formData.units),
          fund_type: formData.fund_type,
          folio_number: formData.folio_number,
          categroy: "Already Invested",
          frequency: formData.frequency,
        };
        response = await createAlreadyHeldMutualFund(payload);
      } else {
        const payload = {
          fund_name: formData.fund_name,
          invested_amount: null,
          units: parseFloat(formData.units),
          fund_type: formData.fund_type,
          folio_number: null,
          categroy: "Recurring",
          frequency: formData.frequency,
          sip_amount: parseFloat(formData.sip_amount),
          sip_frequency: formData.sip_frequency,
          sip_date: formData.sip_date,
        };
        response = await createRecurringMutualFund(payload);
      }
      if (response.status) {
        toast.success("Mutual fund created successfully");
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || "Failed to create mutual fund");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create mutual fund");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fund_name: "",
      invested_amount: "",
      units: "",
      fund_type: "",
      folio_number: "",
      frequency: "Other",
      sip_amount: "",
      sip_frequency: "",
      sip_date: "",
    });
    setCategory("Already Invested");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Add Mutual Fund</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFundSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={handleSelectChange("category")} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Already Invested">Already Invested</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label htmlFor="fund_name">Fund Name</Label><Input id="fund_name" value={formData.fund_name} onChange={handleInputChange} required />{errors.fund_name && <p className="text-red-500 text-sm">{errors.fund_name}</p>}</div>
              <div className="grid gap-2"><Label htmlFor="units">Units</Label><Input id="units" type="number" step="0.01" value={formData.units} onChange={handleInputChange} required />{errors.units && <p className="text-red-500 text-sm">{errors.units}</p>}</div>
              <div className="grid gap-2">
                <Label htmlFor="fund_type">Fund Type</Label>
                <Select value={formData.fund_type} onValueChange={handleSelectChange("fund_type")} required>
                  <SelectTrigger><SelectValue placeholder="Select fund type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Debt">Debt</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Solution">Solution</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fund_type && <p className="text-red-500 text-sm">{errors.fund_type}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={handleSelectChange("frequency")} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIP">SIP</SelectItem>
                    <SelectItem value="Lumpsum">Lumpsum</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}
              </div>
              {category === "Already Invested" ? (
                <>
                  <div className="grid gap-2"><Label htmlFor="invested_amount">Invested Amount (₹)</Label><Input id="invested_amount" type="number" step="0.01" value={formData.invested_amount} onChange={handleInputChange} required />{errors.invested_amount && <p className="text-red-500 text-sm">{errors.invested_amount}</p>}</div>
                  <div className="grid gap-2"><Label htmlFor="folio_number">Folio Number</Label><Input id="folio_number" value={formData.folio_number} onChange={handleInputChange} required />{errors.folio_number && <p className="text-red-500 text-sm">{errors.folio_number}</p>}</div>
                </>
              ) : (
                <>
                  <div className="grid gap-2"><Label htmlFor="sip_amount">SIP Amount (₹)</Label><Input id="sip_amount" type="number" step="0.01" value={formData.sip_amount} onChange={handleInputChange} required />{errors.sip_amount && <p className="text-red-500 text-sm">{errors.sip_amount}</p>}</div>
                  <div className="grid gap-2">
                    <Label htmlFor="sip_frequency">SIP Frequency</Label>
                    <Select value={formData.sip_frequency} onValueChange={handleSelectChange("sip_frequency")} required>
                      <SelectTrigger><SelectValue placeholder="Select SIP frequency" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                        <SelectItem value="One Time">One Time</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sip_frequency && <p className="text-red-500 text-sm">{errors.sip_frequency}</p>}
                  </div>
                  <div className="grid gap-2"><Label htmlFor="sip_date">SIP Day (1–31)</Label><Input id="sip_date" type="number" min="1" max="31" value={formData.sip_date} onChange={handleInputChange} required />{errors.sip_date && <p className="text-red-500 text-sm">{errors.sip_date}</p>}</div>
                </>
              )}
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

export default AddMutualFundDialog;