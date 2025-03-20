// @/components/demat-account/AddDematDialog.jsx
"use client";

import { useState, useEffect } from "react";
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
import { createDematAccount } from "@/lib/demat-account-api";
import { listBanks } from "@/lib/bank-api";
import { toast } from "sonner";
import { Plus } from "@phosphor-icons/react";

export default function AddDematDialog({ onDematAdded }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    depository_name: "",
    account_number: "",
    unique_client_code: "",
    dp_id: "",
    account_type: "Individual",
    bank_account: "",
    linked_mobile: "",
  });
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBanks = async () => {
    try {
      const response = await listBanks();
      if (response.status) {
        setBanks(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bank accounts");
    }
  };

  useEffect(() => {
    if (open) fetchBanks();
  }, [open]);

  const isDematFormValid = () =>
    formData.depository_name &&
    formData.account_number &&
    formData.unique_client_code &&
    formData.dp_id &&
    formData.account_type &&
    formData.bank_account &&
    formData.linked_mobile;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await createDematAccount({
        ...formData,
        bank_account: parseInt(formData.bank_account),
      });
      if (response.status) {
        toast.success("Demat account created successfully");
        setOpen(false);
        onDematAdded();
        setFormData({
          depository_name: "",
          account_number: "",
          unique_client_code: "",
          dp_id: "",
          account_type: "Individual",
          bank_account: "",
          linked_mobile: "",
        });
      }
    } catch (error) {
      toast.error("Failed to create demat account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={20} />
          Add Demat Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Demat Account</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label>Depository Name</Label>
            <Input
              value={formData.depository_name}
              onChange={(e) =>
                setFormData({ ...formData, depository_name: e.target.value })
              }
              placeholder="e.g., NSDL"
              required
            />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              value={formData.account_number}
              onChange={(e) =>
                setFormData({ ...formData, account_number: e.target.value })
              }
              placeholder="e.g., 123456789012"
              required
            />
          </div>
          <div>
            <Label>Unique Client Code</Label>
            <Input
              value={formData.unique_client_code}
              onChange={(e) =>
                setFormData({ ...formData, unique_client_code: e.target.value })
              }
              placeholder="e.g., ABC12345"
              required
            />
          </div>
          <div>
            <Label>DP ID</Label>
            <Input
              value={formData.dp_id}
              onChange={(e) => setFormData({ ...formData, dp_id: e.target.value })}
              placeholder="e.g., IN300123"
              required
            />
          </div>
          <div>
            <Label>Account Type</Label>
            <Select
              value={formData.account_type}
              onValueChange={(value) =>
                setFormData({ ...formData, account_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Joint">Joint</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bank Account</Label>
            <Select
              value={formData.bank_account}
              onValueChange={(value) =>
                setFormData({ ...formData, bank_account: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id.toString()}>
                    {bank.account_holder_name} - {bank.account_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Linked Mobile</Label>
            <Input
              value={formData.linked_mobile}
              onChange={(e) =>
                setFormData({ ...formData, linked_mobile: e.target.value })
              }
              placeholder="e.g., 9876543210"
              required
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isDematFormValid() || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}