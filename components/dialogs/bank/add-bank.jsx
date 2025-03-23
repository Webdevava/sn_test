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
import { validateIfsc, addBank } from "@/lib/bank-api";
import { createNominee, deleteNominee } from "@/lib/nominee-api";
import { listFamilyMembers } from "@/lib/family-api";
import { addPassbook } from "@/lib/bank-api";
import { toast } from "sonner";
import { Plus, Trash } from "@phosphor-icons/react";

export default function AddBankDialog({ onBankAdded }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bankId, setBankId] = useState(null);
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
  const [nominees, setNominees] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newNominee, setNewNominee] = useState({ nominee_id: "", percentage: "" });
  const [passbookFile, setPassbookFile] = useState(null);

  const today = new Date().toISOString().split("T")[0];

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
      formData.account_balance !== "" &&
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

  const handleCreateBank = async (e) => {
    e.preventDefault();
    if (!isBankFormValid()) return;

    try {
      setLoading(true);
      const response = await addBank({
        ...formData,
        account_balance: parseFloat(formData.account_balance),
      });
      if (response.status) {
        setBankId(response.data.id);
        toast.success("Bank account created successfully");
        setStep(2);
      } else {
        throw new Error("Failed to create bank account");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNominee = async () => {
    if (!newNominee.nominee_id || !newNominee.percentage) {
      toast.error("Please select a family member and enter a percentage");
      return;
    }

    try {
      setLoading(true);
      const response = await createNominee("bank", {
        nominee_id: newNominee.nominee_id,
        percentage: parseInt(newNominee.percentage),
        asset_id: bankId,
      });
      if (response.status) {
        setNominees([...nominees, { ...newNominee, id: response.data?.id }]);
        setNewNominee({ nominee_id: "", percentage: "" });
        toast.success("Nominee added successfully");
      }
    } catch (error) {
      toast.error("Failed to add nominee");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveNominee = async (nomineeId) => {
    try {
      setLoading(true);
      const response = await deleteNominee("bank", nomineeId);
      if (response.status) {
        setNominees(nominees.filter((n) => n.id !== nomineeId));
        toast.success("Nominee removed successfully");
      }
    } catch (error) {
      toast.error("Failed to remove nominee");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPassbook = async () => {
    if (!passbookFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      const response = await addPassbook(bankId, passbookFile);
      if (response.status) {
        toast.success("Passbook uploaded successfully");
        setPassbookFile(null);
      }
    } catch (error) {
      toast.error("Failed to upload passbook");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setBankId(null);
    setNominees([]);
    setNewNominee({ nominee_id: "", percentage: "" });
    setPassbookFile(null);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={20} />
          Add Bank
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            Add New Bank Account - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[70vh]">
          {step === 1 && (
            <form onSubmit={handleCreateBank} className="space-y-6">
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
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Nominees</Label>
                {nominees.map((nominee) => (
                  <div key={nominee.id} className="flex items-center gap-2">
                    <span>
                      {familyMembers.find((fm) => fm.id === nominee.nominee_id)?.first_name} - {nominee.percentage}%
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveNominee(nominee.id)}
                      disabled={loading}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Select Family Member</Label>
                  <Select
                    value={newNominee.nominee_id}
                    onValueChange={(value) => setNewNominee({ ...newNominee, nominee_id: value })}
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
                    type="number"
                    value={newNominee.percentage}
                    onChange={(e) => setNewNominee({ ...newNominee, percentage: e.target.value })}
                    min={1}
                    max={100}
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
            <div className="space-y-6">
              <div>
                <Label>Upload Passbook/Statement</Label>
                <Input
                  type="file"
                  onChange={(e) => setPassbookFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <Button onClick={handleUploadPassbook} disabled={loading || !passbookFile}>
                Upload Document
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="border-t p-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              Previous
            </Button>
          )}
          {step < 3 && (
            <Button
              type="button"
              onClick={() => step === 1 ? handleCreateBank({ preventDefault: () => {} }) : setStep(step + 1)}
              disabled={step === 1 ? !isBankFormValid() || loading : loading}
            >
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              type="button"
              onClick={() => {
                onBankAdded();
                setOpen(false);
              }}
              disabled={loading}
            >
              Finish
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}