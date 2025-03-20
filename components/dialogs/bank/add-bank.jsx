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
import { validateIfsc, addBank, addPassbook } from "@/lib/bank-api";
import { listFamilyMembers } from "@/lib/family-api";
import { createNominee } from "@/lib/nominee-api";
import { toast } from "sonner";
import { Plus, Upload, ArrowRight, ArrowLeft } from "@phosphor-icons/react";

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
  const [familyMembers, setFamilyMembers] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [newNominee, setNewNominee] = useState({ id: null, percentage: "" });
  const [passbook, setPassbook] = useState(null);

  const today = new Date().toISOString().split("T")[0];

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

  const handleNext = async () => {
    if (step === 1) {
      try {
        setLoading(true);
        const response = await addBank({
          ...formData,
          account_balance: parseFloat(formData.account_balance),
        });
        if (response.status) {
          setBankId(response.data.id || 1);
          await fetchFamilyMembers();
          setStep(2);
          toast.success("Bank account created successfully");
        }
      } catch (error) {
        toast.error("Failed to create bank account");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSkip = () => {
    if (step === 2) setStep(3);
    else if (step === 3) handleFinish();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddNominee = async () => {
    const totalPercentage = nominees.reduce((sum, n) => sum + n.percentage, 0);
    if (!newNominee.id || !newNominee.percentage) {
      toast.error("Please select a family member and specify a percentage");
      return;
    }
    if (nominees.some((n) => n.id === newNominee.id)) {
      toast.error("Nominee already added");
      return;
    }
    if (totalPercentage + parseInt(newNominee.percentage) > 100) {
      toast.error("Total percentage exceeds 100%");
      return;
    }
    try {
      setLoading(true);
      const response = await createNominee("bank", {
        nominee_id: parseInt(newNominee.id),
        percentage: parseInt(newNominee.percentage),
        asset_id: bankId,
      });
      if (response.status) {
        setNominees([...nominees, { ...newNominee, percentage: parseInt(newNominee.percentage) }]);
        setNewNominee({ id: null, percentage: "" });
        toast.success("Nominee added successfully");
      }
    } catch (error) {
      toast.error("Failed to add nominee");
    } finally {
      setLoading(false);
    }
  };

  const handlePassbookUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        setLoading(true);
        const response = await addPassbook(bankId, file);
        if (response.status) {
          setPassbook(file);
          toast.success("Passbook uploaded successfully");
        }
      } catch (error) {
        toast.error("Failed to upload passbook");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleFinish = () => {
    setOpen(false);
    onBankAdded();
    setStep(1);
    setBankId(null);
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
    setNominees([]);
    setPassbook(null);
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
          <DialogTitle>
            {step === 1 ? "Add New Bank Account" : step === 2 ? "Add Nominees" : "Upload Passbook"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm ${step === 1 ? "font-bold" : ""}`}>1. Bank Details</span>
          <span className={`text-sm ${step === 2 ? "font-bold" : ""}`}>2. Nominees</span>
          <span className={`text-sm ${step === 3 ? "font-bold" : ""}`}>3. Passbook</span>
        </div>

        {step === 1 && (
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
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isBankFormValid() || loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Next"}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {nominees.length > 0 && (
              <div>
                <Label>Added Nominees</Label>
                <ul>
                  {nominees.map((n) => (
                    <li key={n.id}>
                      {familyMembers.find((m) => m.id === n.id)?.first_name}{" "}
                      {familyMembers.find((m) => m.id === n.id)?.last_name} - {n.percentage}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Add Nominee</Label>
                <Select
                  value={newNominee.id}
                  onValueChange={(value) => setNewNominee({ ...newNominee, id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select family member" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers
                      .filter((m) => !nominees.some((n) => n.id === m.id))
                      .map((member) => (
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
                  min="1"
                  max="100"
                  value={newNominee.percentage}
                  onChange={(e) => setNewNominee({ ...newNominee, percentage: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddNominee} disabled={loading}>
              {loading ? "Adding..." : "Add Nominee"}
            </Button>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft size={20} />
                Back
              </Button>
              <Button onClick={handleSkip} className="gap-2">
                Skip
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Upload Passbook (PDF only)</Label>
              <Input type="file" accept="application/pdf" onChange={handlePassbookUpload} />
            </div>
            {passbook && <p>Uploaded: {passbook.name}</p>}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft size={20} />
                Back
              </Button>
              <Button onClick={handleSkip} className="gap-2">
                Skip
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}