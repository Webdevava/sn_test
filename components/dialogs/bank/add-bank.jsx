"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateIfsc, addBank } from "@/lib/bank-api";
import { toast } from "sonner";
import { Plus } from "@phosphor-icons/react";

export default function AddBankDialog({ onBankAdded }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
    account_type: "",
    linked_mobile_number: "",
    account_balance: "",
    account_opening_date: "",
    account_status: "Active",
    notes: "",
  });
  const [isValidIfsc, setIsValidIfsc] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const isBankFormValid = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const accountNumberRegex = /^[0-9]+$/;
    return (
      formData.account_holder_name.trim().length >= 2 &&
      accountNumberRegex.test(formData.account_number) &&
      formData.account_number.length > 0 &&
      formData.ifsc_code.length === 11 &&
      isValidIfsc &&
      formData.account_type.length > 0 &&
      formData.account_balance !== "" && // Ensure it's not empty
      !isNaN(parseFloat(formData.account_balance)) &&
      parseFloat(formData.account_balance) >= 0 &&
      formData.account_opening_date.length > 0 &&
      formData.account_opening_date <= today &&
      (!formData.linked_mobile_number || phoneRegex.test(formData.linked_mobile_number))
    );
  };

  const handleIfscChange = async (e) => {
    const ifsc = e.target.value.toUpperCase();
    setFormData({ ...formData, ifsc_code: ifsc });
    if (ifsc.length === 11) {
      try {
        const response = await validateIfsc(ifsc);
        if (response.status) {
          setFormData((prev) => ({
            ...prev,
            bank_name: response.data.bank,
            branch_name: response.data.branch,
          }));
          setIsValidIfsc(true);
        } else {
          setIsValidIfsc(false);
          setFormData((prev) => ({ ...prev, bank_name: "", branch_name: "" }));
          toast.error("Invalid IFSC code");
        }
      } catch (error) {
        setIsValidIfsc(false);
        toast.error("Error validating IFSC code");
      }
    } else {
      setIsValidIfsc(false);
      setFormData((prev) => ({ ...prev, bank_name: "", branch_name: "" }));
    }
  };

  const handleSave = async () => {
    if (!isBankFormValid()) return;

    try {
      setLoading(true);
      const response = await addBank({
        ...formData,
        account_balance: parseFloat(formData.account_balance),
      });
      if (response.status) {
        toast.success("Bank account created successfully");
        onBankAdded();
        setOpen(false);
        setFormData({
          account_holder_name: "",
          account_number: "",
          ifsc_code: "",
          bank_name: "",
          branch_name: "",
          account_type: "",
          linked_mobile_number: "",
          account_balance: "",
          account_opening_date: "",
          account_status: "Active",
          notes: "",
        });
        setIsValidIfsc(false);
      } else {
        throw new Error("Failed to create bank account");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create bank account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={20} />
          Add Bank
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Bank Account</DialogTitle>
        </DialogHeader>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Account Holder Name</Label>
              <Input
                value={formData.account_holder_name}
                onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                required
                minLength={2}
                placeholder="Min 2 characters"
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                value={formData.account_number}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value)) {
                    setFormData({ ...formData, account_number: e.target.value });
                  }
                }}
                required
                placeholder="Numbers only"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>IFSC Code</Label>
              <Input
                value={formData.ifsc_code}
                onChange={handleIfscChange}
                required
                maxLength={11}
                placeholder="11 characters"
              />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input value={formData.bank_name} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Branch Name</Label>
              <Input value={formData.branch_name} disabled />
            </div>
            <div>
              <Label>Account Type</Label>
              <Select
                value={formData.account_type}
                onValueChange={(value) => setFormData({ ...formData, account_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="NRE">NRE</SelectItem>
                  <SelectItem value="NRO">NRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mobile Number</Label>
              <Input
                value={formData.linked_mobile_number}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value)) {
                    setFormData({ ...formData, linked_mobile_number: e.target.value.slice(0, 10) });
                  }
                }}
                maxLength={10}
                placeholder="10 digits only"
              />
            </div>
            <div>
              <Label>Balance</Label>
              <Input
                type="number"
                value={formData.account_balance}
                onChange={(e) => setFormData({ ...formData, account_balance: e.target.value })}
                required
                min={0}
                step="0.01"
                placeholder="Amount"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Opening Date</Label>
              <Input
                type="date"
                value={formData.account_opening_date}
                onChange={(e) => setFormData({ ...formData, account_opening_date: e.target.value })}
                max={today}
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.account_status}
                onValueChange={(value) => setFormData({ ...formData, account_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Dormant">Dormant</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              maxLength={200}
              placeholder="Max 200 characters"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isBankFormValid() || loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}