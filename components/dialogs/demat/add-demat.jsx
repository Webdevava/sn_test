// @/components/demat-account/AddDematDialog.jsx
"use client";

import React, { useState, useEffect } from "react";
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
import { createDematAccount, uploadDematAccountDocument } from "@/lib/demat-account-api";
import { listBanks } from "@/lib/bank-api";
import { createNominee, deleteNominee } from "@/lib/nominee-api";
import { listFamilyMembers } from "@/lib/family-api";
import { toast } from "sonner";
import { Plus, Trash, Check } from "@phosphor-icons/react";

const StepIndicator = ({ number, isCompleted, isCurrent }) => {
  if (isCompleted) {
    return (
      <div className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-white">
        <Check className="h-4 w-4" />
      </div>
    );
  }
  if (isCurrent) {
    return (
      <div className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary bg-transparent relative">
        <div className="rounded-full w-2 h-2 bg-primary absolute" />
      </div>
    );
  }
  return (
    <div className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-muted-foreground" />
  );
};

export default function AddDematDialog({ openAddDialog, setOpenAddDialog, onDematAdded }) {
  const [step, setStep] = useState(1);
  const [dematId, setDematId] = useState(null);
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
  const [nominees, setNominees] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newNominee, setNewNominee] = useState({ nominee_id: "", percentage: "" });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { number: 1, title: "Demat Details" },
    { number: 2, title: "Add Nominee" },
    { number: 3, title: "Upload Document" },
  ];

  useEffect(() => {
    if (openAddDialog) {
      fetchBanks();
      if (step === 2) fetchFamilyMembers();
    }
  }, [openAddDialog, step]);

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

  const isDematFormValid = () =>
    formData.depository_name.trim().length >= 2 &&
    /^[0-9]+$/.test(formData.account_number) &&
    formData.account_number.length > 0 &&
    formData.unique_client_code.trim().length >= 2 &&
    formData.dp_id.trim().length >= 2 &&
    formData.account_type.length > 0 &&
    formData.bank_account.length > 0 &&
    /^\d{10}$/.test(formData.linked_mobile);

  const handleCreateDemat = async (e) => {
    e?.preventDefault();
    if (!isDematFormValid()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const response = await createDematAccount({
        ...formData,
        bank_account: parseInt(formData.bank_account),
      });
      if (response.status) {
        setDematId(response.data.id);
        toast.success("Demat account created successfully");
        setStep(2);
      } else {
        throw new Error(response.message || "Failed to create demat account");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create demat account");
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
      const response = await createNominee("demat", {
        nominee_id: newNominee.nominee_id,
        percentage: parseInt(newNominee.percentage),
        asset_id: dematId,
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
      const response = await deleteNominee("demat", nomineeId);
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

  const handleUploadDocument = async () => {
    if (!documentFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadDematAccountDocument(dematId, documentFile);
      if (response.status) {
        toast.success("Document uploaded successfully");
        setDocumentFile(null);
      }
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      depository_name: "",
      account_number: "",
      unique_client_code: "",
      dp_id: "",
      account_type: "Individual",
      bank_account: "",
      linked_mobile: "",
    });
    setDematId(null);
    setNominees([]);
    setNewNominee({ nominee_id: "", percentage: "" });
    setDocumentFile(null);
    setStep(1);
    setOpenAddDialog(false);
  };

  const handleNext = () => {
    if (step === 1) {
      handleCreateDemat();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog open={openAddDialog} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setOpenAddDialog(true)}>
          <Plus size={20} />
          Add Demat Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Add New Demat Account</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className={`flex items-center ${s.number > step ? "opacity-50" : ""}`}>
                  <StepIndicator
                    number={s.number}
                    isCompleted={step > s.number}
                    isCurrent={step === s.number}
                  />
                  <div className="ml-2">
                    <div className="text-xs text-gray-500">STEP {s.number}</div>
                    <div className="text-sm font-medium">{s.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 mx-4 h-px ${
                      step > index + 1 ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[70vh]">
          {step === 1 && (
            <form onSubmit={handleCreateDemat} className="space-y-6">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      setFormData({ ...formData, account_number: e.target.value });
                    }
                  }}
                  placeholder="e.g., 123456789012"
                  required
                />
              </div>
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label>DP ID</Label>
                <Input
                  value={formData.dp_id}
                  onChange={(e) => setFormData({ ...formData, dp_id: e.target.value })}
                  placeholder="e.g., IN300123"
                  required
                />
              </div>
              <div className="grid gap-2">
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
              <div className="grid gap-2">
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
                        {bank.bank_name} - {bank.account_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Linked Mobile</Label>
                <Input
                  value={formData.linked_mobile}
                  onChange={(e) => {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      setFormData({ ...formData, linked_mobile: e.target.value.slice(0, 10) });
                    }
                  }}
                  maxLength={10}
                  placeholder="e.g., 9876543210"
                  required
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
                <Label>Upload Demat Document</Label>
                <Input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <Button onClick={handleUploadDocument} disabled={loading || !documentFile}>
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
              className="w-32 bg-popover border-foreground"
            >
              Back
            </Button>
          )}
          {step < 3 && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={step === 1 ? !isDematFormValid() || loading : loading}
              className="w-32"
            >
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              type="button"
              onClick={() => {
                onDematAdded();
                handleClose();
              }}
              disabled={loading}
              className="w-32"
            >
              Finish
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="w-32 bg-popover border-foreground">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}