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
import { validateIfsc, updateBank, addPassbook } from "@/lib/bank-api";
import { listFamilyMembers } from "@/lib/family-api";
import { createNominee } from "@/lib/nominee-api";
import { toast } from "sonner";
import { PencilSimple, Upload, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditBankDialog({ bank, onBankUpdated }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(bank);
  const [isValidIfsc, setIsValidIfsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedNominees, setSelectedNominees] = useState({});
  const [passbook, setPassbook] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setFormData(bank);
    setIsValidIfsc(true);
    setPassbook(bank.passbook_or_statement ? { name: "Existing Passbook" } : null);
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
        const response = await updateBank(bank.id, {
          ...formData,
          account_balance: parseFloat(formData.account_balance),
        });
        if (response.status) {
          await fetchFamilyMembers();
          setStep(2);
          toast.success("Bank account updated successfully");
        }
      } catch (error) {
        toast.error("Failed to update bank account");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      try {
        setLoading(true);
        const nomineePromises = Object.entries(selectedNominees)
          .filter(([, percentage]) => percentage > 0)
          .map(([nomineeId, percentage]) =>
            createNominee("bank", {
              nominee_id: parseInt(nomineeId),
              percentage: parseInt(percentage),
              asset_id: bank.id,
            })
          );
        await Promise.all(nomineePromises);
        toast.success("Nominees added successfully");
        setStep(3);
      } catch (error) {
        toast.error("Failed to add nominees");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNomineeChange = (memberId, checked, percentage) => {
    setSelectedNominees((prev) => ({
      ...prev,
      [memberId]: checked ? (percentage || 0) : undefined,
    }));
  };

  const handlePercentageChange = (memberId, value) => {
    const percentage = Math.min(100, Math.max(0, parseInt(value) || 0));
    setSelectedNominees((prev) => ({
      ...prev,
      [memberId]: percentage,
    }));
  };

  const handlePassbookUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        setLoading(true);
        const response = await addPassbook(bank.id, file);
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
    onBankUpdated();
    setStep(1);
    setSelectedNominees({});
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
          <DialogTitle>
            {step === 1 ? "Edit Bank Account" : step === 2 ? "Add Nominees" : "Upload Passbook"}
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Current">Current</SelectItem>
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
                    <SelectItem value="Inactive">Inactive</SelectItem>
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
              {loading ? "Updating..." : "Next"}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedNominees[member.id] !== undefined}
                        onCheckedChange={(checked) =>
                          handleNomineeChange(member.id, checked, selectedNominees[member.id])
                        }
                      />
                    </TableCell>
                    <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedNominees[member.id] || ""}
                        onChange={(e) => handlePercentageChange(member.id, e.target.value)}
                        disabled={selectedNominees[member.id] === undefined}
                        className="w-20"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft size={20} />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading || Object.keys(selectedNominees).length === 0}
                className="gap-2"
              >
                {loading ? "Adding..." : "Next"}
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
              <Button onClick={handleFinish} className="gap-2">
                Finish
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}