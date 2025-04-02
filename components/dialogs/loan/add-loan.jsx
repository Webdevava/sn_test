"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  createSecuredLoan,
  createUnsecuredLoan,
  uploadSecuredLoanDocument,
  uploadUnsecuredLoanDocument,
} from "@/lib/loan-api";
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

export default function AddLoanDialog({ open, onOpenChange, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loanType, setLoanType] = useState("Secured");
  const [loanId, setLoanId] = useState(null);
  const [formData, setFormData] = useState({
    loan_type: "",
    lender_name: "",
    loan_account_number: "",
    loan_amount: "",
    emi_amount: "",
    interest_rate: "",
    loan_start_date: "",
    loan_end_date: "",
    remaining_loan_balance: "",
    collateral_details: "",
    nominee_awareness: false,
    guarantor: "",
    notes: "",
    linked_bank_account: "",
    insurance: "",
    agreed_repayment_date: "",
    payment_mode: "",
    remaining_balance: "",
    repayment_frequency: "",
  });
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [newNominee, setNewNominee] = useState({
    nominee_id: "",
    percentage: "",
  });
  const [documentFile, setDocumentFile] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const steps = [
    { number: 1, title: "Loan Details" },
    { number: 2, title: "Add Nominee" },
    { number: 3, title: "Upload Document" },
  ];

  useEffect(() => {
    if (open && step === 1) {
      fetchBanks();
    }
    if (open && step === 2) {
      fetchFamilyMembers();
    }
  }, [open, step]);

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

  const isLoanFormValid = () => {
    const numberRegex = /^[0-9]+$/;
    const commonFieldsValid =
      formData.lender_name.trim().length >= 2 &&
      formData.loan_amount !== "" &&
      !isNaN(parseFloat(formData.loan_amount)) &&
      parseFloat(formData.loan_amount) > 0 &&
      formData.interest_rate !== "" &&
      !isNaN(parseFloat(formData.interest_rate)) &&
      parseFloat(formData.interest_rate) >= 0 &&
      formData.loan_start_date.length > 0 &&
      formData.loan_start_date <= today;

    if (loanType === "Secured") {
      return (
        commonFieldsValid &&
        formData.loan_type.length > 0 &&
        numberRegex.test(formData.loan_account_number) &&
        formData.loan_account_number.length > 0 &&
        formData.emi_amount !== "" &&
        !isNaN(parseFloat(formData.emi_amount)) &&
        parseFloat(formData.emi_amount) > 0 &&
        formData.loan_end_date.length > 0 &&
        formData.loan_end_date > formData.loan_start_date &&
        formData.remaining_loan_balance !== "" &&
        !isNaN(parseFloat(formData.remaining_loan_balance)) &&
        parseFloat(formData.remaining_loan_balance) >= 0 &&
        formData.collateral_details.trim().length > 0
      );
    } else {
      return (
        commonFieldsValid &&
        formData.agreed_repayment_date.length > 0 &&
        formData.agreed_repayment_date > formData.loan_start_date &&
        formData.payment_mode.length > 0 &&
        formData.remaining_balance !== "" &&
        !isNaN(parseFloat(formData.remaining_balance)) &&
        parseFloat(formData.remaining_balance) >= 0 &&
        formData.repayment_frequency.length > 0
      );
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    if (!isLoanFormValid()) return;

    try {
      setLoading(true);
      let response;
      if (loanType === "Secured") {
        const payload = {
          loan_type: formData.loan_type,
          lender_name: formData.lender_name,
          loan_account_number: formData.loan_account_number,
          loan_amount: parseFloat(formData.loan_amount),
          emi_amount: parseFloat(formData.emi_amount),
          interest_rate: parseFloat(formData.interest_rate),
          loan_start_date: formData.loan_start_date,
          loan_end_date: formData.loan_end_date,
          remaining_loan_balance: parseFloat(formData.remaining_loan_balance),
          collateral_details: formData.collateral_details,
          nominee_awareness: formData.nominee_awareness,
          guarantor: formData.guarantor || null,
          notes: formData.notes || null,
          linked_bank_account: formData.linked_bank_account
            ? parseInt(formData.linked_bank_account)
            : null,
          insurance: formData.insurance ? parseInt(formData.insurance) : null,
        };
        response = await createSecuredLoan(payload);
      } else {
        const payload = {
          lender_name: formData.lender_name,
          loan_amount: parseFloat(formData.loan_amount),
          loan_start_date: formData.loan_start_date,
          agreed_repayment_date: formData.agreed_repayment_date,
          interest_rate: parseFloat(formData.interest_rate),
          payment_mode: formData.payment_mode,
          remaining_balance: parseFloat(formData.remaining_balance),
          repayment_frequency: formData.repayment_frequency,
          nominee_awareness: formData.nominee_awareness,
          notes: formData.notes || null,
        };
        response = await createUnsecuredLoan(payload);
      }
      if (response.status) {
        setLoanId(response.data.id);
        toast.success("Loan created successfully");
        setStep(2);
      } else {
        throw new Error("Failed to create loan");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create loan");
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
      const response = await createNominee("loan", {
        nominee_id: parseInt(newNominee.nominee_id),
        percentage: parseInt(newNominee.percentage),
        asset_id: loanId,
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
      const response = await deleteNominee(loanType.toLowerCase(), nomineeId);
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
      const uploadFunction =
        loanType === "Secured"
          ? uploadSecuredLoanDocument
          : uploadUnsecuredLoanDocument;
      const response = await uploadFunction(loanId, documentFile);
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

  const resetForm = () => {
    setFormData({
      loan_type: "",
      lender_name: "",
      loan_account_number: "",
      loan_amount: "",
      emi_amount: "",
      interest_rate: "",
      loan_start_date: "",
      loan_end_date: "",
      remaining_loan_balance: "",
      collateral_details: "",
      nominee_awareness: false,
      guarantor: "",
      notes: "",
      linked_bank_account: "",
      insurance: "",
      agreed_repayment_date: "",
      payment_mode: "",
      remaining_balance: "",
      repayment_frequency: "",
    });
    setLoanType("Secured");
    setLoanId(null);
    setNominees([]);
    setNewNominee({ nominee_id: "", percentage: "" });
    setDocumentFile(null);
    setStep(1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Add New Loan</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div
                  className={`flex items-center ${
                    s.number > step ? "opacity-50" : ""
                  }`}
                >
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
            <form onSubmit={handleCreateLoan} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Secured">Secured</SelectItem>
                      <SelectItem value="Unsecured">Unsecured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lender Name</Label>
                  <Input
                    value={formData.lender_name}
                    onChange={(e) =>
                      setFormData({ ...formData, lender_name: e.target.value })
                    }
                    required
                    minLength={2}
                    placeholder="e.g., HDFC Bank"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loan Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.loan_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, loan_amount: e.target.value })
                    }
                    required
                    min={1}
                    placeholder="e.g., 500000"
                  />
                </div>
                <div>
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.interest_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interest_rate: e.target.value,
                      })
                    }
                    required
                    min={0}
                    placeholder="e.g., 8.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.loan_start_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loan_start_date: e.target.value,
                      })
                    }
                    max={today}
                    required
                  />
                </div>
                {loanType === "Secured" ? (
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.loan_end_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          loan_end_date: e.target.value,
                        })
                      }
                      min={formData.loan_start_date || today}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Repayment Date</Label>
                    <Input
                      type="date"
                      value={formData.agreed_repayment_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agreed_repayment_date: e.target.value,
                        })
                      }
                      min={formData.loan_start_date || today}
                      required
                    />
                  </div>
                )}
              </div>

              {loanType === "Secured" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Specific Loan Type</Label>
                      <Select
                        value={formData.loan_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, loan_type: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home Loan">Home Loan</SelectItem>
                          <SelectItem value="Personal Loan">
                            Personal Loan
                          </SelectItem>
                          <SelectItem value="Vehicle Loan">
                            Vehicle Loan
                          </SelectItem>
                          <SelectItem value="Education Loan">
                            Education Loan
                          </SelectItem>
                          <SelectItem value="Business Loan">
                            Business Loan
                          </SelectItem>
                          <SelectItem value="Gold Loan">Gold Loan</SelectItem>
                          <SelectItem value="Loan Against Property">
                            Loan Against Property
                          </SelectItem>
                          <SelectItem value="Loan Against Fixed Deposit">
                            Loan Against Fixed Deposit
                          </SelectItem>
                          <SelectItem value="Mortgage Loan">
                            Mortgage Loan
                          </SelectItem>
                          <SelectItem value="Any Other Secured Loan">
                            Any Other Secured Loan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Loan Account Number</Label>
                      <Input
                        value={formData.loan_account_number}
                        onChange={(e) => {
                          if (/^[0-9]*$/.test(e.target.value)) {
                            setFormData({
                              ...formData,
                              loan_account_number: e.target.value,
                            });
                          }
                        }}
                        required
                        placeholder="e.g., 1234567890"
                      />
                    </div>

                    <div>
                      <Label>Linked Bank Account</Label>
                      <Select
                        value={formData.linked_bank_account}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            linked_bank_account: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem
                              key={bank.id}
                              value={bank.id.toString()}
                            >
                              {bank.account_holder_name} - {bank.account_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.nominee_awareness}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            nominee_awareness: checked,
                          })
                        }
                      />
                      <Label>Nominee Awareness</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>EMI Amount (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.emi_amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emi_amount: e.target.value,
                          })
                        }
                        required
                        min={1}
                        placeholder="e.g., 25000"
                      />
                    </div>
                    <div>
                      <Label>Remaining Balance (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.remaining_loan_balance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            remaining_loan_balance: e.target.value,
                          })
                        }
                        required
                        min={0}
                        placeholder="e.g., 300000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Collateral Details</Label>
                    <Input
                      value={formData.collateral_details}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collateral_details: e.target.value,
                        })
                      }
                      required
                      placeholder="e.g., Flat No. 101, Mumbai"
                    />
                  </div>
                  
                 
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Payment Mode</Label>
                      <Select
                        value={formData.payment_mode}
                        onValueChange={(value) =>
                          setFormData({ ...formData, payment_mode: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Repayment Frequency</Label>
                      <Select
                        value={formData.repayment_frequency}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            repayment_frequency: value,
                          })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Lump sum">Lump sum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Remaining Balance (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.remaining_balance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            remaining_balance: e.target.value,
                          })
                        }
                        required
                        min={0}
                        placeholder="e.g., 150000"
                      />
                    </div>
                    <div>
                      <Label>Notes (Optional)</Label>
                      <Input
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        maxLength={200}
                        placeholder="e.g., Personal loan from friend"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.nominee_awareness}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, nominee_awareness: checked })
                      }
                    />
                    <Label>Nominee Awareness</Label>
                  </div>
                </>
              )}
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Nominees</Label>
                {nominees.map((nominee) => (
                  <div key={nominee.id} className="flex items-center gap-2">
                    <span>
                      {
                        familyMembers.find(
                          (fm) => fm.id === parseInt(nominee.nominee_id)
                        )?.first_name
                      }{" "}
                      - {nominee.percentage}%
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
                    onValueChange={(value) =>
                      setNewNominee({ ...newNominee, nominee_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select family member" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id.toString()}
                        >
                          {member.first_name} {member.last_name} (
                          {member.relationship})
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
                    onChange={(e) =>
                      setNewNominee({
                        ...newNominee,
                        percentage: e.target.value,
                      })
                    }
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
                <Label>Upload Document</Label>
                <Input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  accept=".pdf"
                />
              </div>
              <Button
                onClick={handleUploadDocument}
                disabled={loading || !documentFile}
              >
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
              onClick={() =>
                step === 1
                  ? handleCreateLoan({ preventDefault: () => {} })
                  : setStep(step + 1)
              }
              disabled={step === 1 ? !isLoanFormValid() || loading : loading}
              className="w-32"
            >
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              type="button"
              onClick={() => {
                onSuccess();
                onOpenChange(false);
              }}
              disabled={loading}
              className="w-32"
            >
              Finish
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-32 bg-popover border-foreground"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}