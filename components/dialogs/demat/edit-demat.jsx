// @/components/demat-account/EditDematDialog.jsx
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
import { updateDematAccount } from "@/lib/demat-account-api";
import { listBanks } from "@/lib/bank-api";
import { toast } from "sonner";
import { PencilSimple } from "@phosphor-icons/react";

export default function EditDematDialog({ dematAccount, onDematUpdated }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(dematAccount || {});
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(dematAccount || {});
    if (open) fetchBanks();
  }, [dematAccount, open]);

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

  const isDematFormValid = () =>
    formData?.depository_name &&
    formData?.account_number &&
    formData?.unique_client_code &&
    formData?.dp_id &&
    formData?.account_type &&
    formData?.bank_account &&
    formData?.linked_mobile;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await updateDematAccount(dematAccount.id, {
        ...formData,
        bank_account: parseInt(formData.bank_account),
      });
      if (response.status) {
        toast.success("Demat account updated successfully");
        setOpen(false);
        onDematUpdated();
      }
    } catch (error) {
      toast.error("Failed to update demat account");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Demat Account</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label>Depository Name</Label>
            <Input
              value={formData.depository_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, depository_name: e.target.value })
              }
              placeholder="e.g., CDSL"
              required
            />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              value={formData.account_number || ""}
              onChange={(e) =>
                setFormData({ ...formData, account_number: e.target.value })
              }
              placeholder="e.g., 987654321098"
              required
            />
          </div>
          <div>
            <Label>Unique Client Code</Label>
            <Input
              value={formData.unique_client_code || ""}
              onChange={(e) =>
                setFormData({ ...formData, unique_client_code: e.target.value })
              }
              placeholder="e.g., XYZ98765"
              required
            />
          </div>
          <div>
            <Label>DP ID</Label>
            <Input
              value={formData.dp_id || ""}
              onChange={(e) => setFormData({ ...formData, dp_id: e.target.value })}
              placeholder="e.g., IN301234"
              required
            />
          </div>
          <div>
            <Label>Account Type</Label>
            <Select
              value={formData.account_type || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, account_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
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
              value={formData.bank_account || ""}
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
              value={formData.linked_mobile || ""}
              onChange={(e) =>
                setFormData({ ...formData, linked_mobile: e.target.value })
              }
              placeholder="e.g., 9123456789"
              required
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isDematFormValid() || loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}