"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { validateIfsc, updateBank } from "@/lib/bank-api";
import { toast } from "sonner";
import { PencilSimple } from "@phosphor-icons/react";

export default function EditBankDialog({ bank, onBankUpdated }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(bank);
  const [isValidIfsc, setIsValidIfsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setFormData(bank);
    setIsValidIfsc(true);
  }, [bank]);

  const isBankFormValid = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const accountNumberRegex = /^[0-9]+$/;
    return (
      formData.account_holder_name &&
      formData.account_holder_name.length >= 2 &&
      formData.account_number &&
      accountNumberRegex.test(formData.account_number) &&
      formData.ifsc_code &&
      isValidIfsc &&
      formData.account_type &&
      formData.account_balance &&
      parseFloat(formData.account_balance) >= 0 &&
      formData.account_opening_date &&
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isBankFormValid()) return;

    try {
      setLoading(true);
      const response = await updateBank(bank.id, {
        ...formData,
        account_balance: parseFloat(formData.account_balance),
      });
      if (response.status) {
        toast.success("Bank account updated successfully");
        setOpen(false);
        onBankUpdated();
      }
    } catch (error) {
      toast.error("Failed to update bank account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PencilSimple size={16} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Bank Account</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[75vh]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  value={formData.account_holder_name}
                  onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                  required
                  minLength={2}
                  placeholder="e.g., John Doe"
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
                  placeholder="e.g., 123456789012"
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
                  placeholder="e.g., HDFC0000123"
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input value={formData.bank_name} disabled placeholder="e.g., HDFC Bank" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Branch Name</Label>
                <Input value={formData.branch_name} disabled placeholder="e.g., Mumbai Main" />
              </div>
              <div>
                <Label>Account Type</Label>
                <Select
                  value={formData.account_type}
                  onValueChange={(value) => setFormData({ ...formData, account_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
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
                  placeholder="e.g., 9876543210"
                />
              </div>
              <div>
                <Label>Balance (₹)</Label>
                <Input
                  type="number"
                  value={formData.account_balance}
                  onChange={(e) => setFormData({ ...formData, account_balance: e.target.value })}
                  required
                  min={0}
                  step="0.01"
                  placeholder="e.g., 50000"
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
                placeholder="e.g., Primary savings account"
              />
            </div>
          </form>

          <DialogFooter className="border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={!isBankFormValid() || loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}