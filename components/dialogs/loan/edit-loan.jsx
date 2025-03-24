"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { updateSecuredLoan, updateUnsecuredLoan } from "@/lib/loan-api";
import { listBanks } from "@/lib/bank-api";
import { toast } from "sonner";

const EditLoanDialog = ({ open, onOpenChange, loan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [banks, setBanks] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (loan) {
      setFormData({
        loan_type: loan.loan_type || "",
        lender_name: loan.lender_name || "",
        loan_account_number: loan.loan_account_number || "",
        loan_amount: loan.loan_amount?.toString() || "",
        emi_amount: loan.emi_amount?.toString() || "",
        interest_rate: loan.interest_rate?.toString() || "",
        loan_start_date: loan.loan_start_date || "",
        loan_end_date: loan.loan_end_date || "",
        remaining_loan_balance: loan.remaining_loan_balance?.toString() || "",
        collateral_details: loan.collateral_details || "",
        nominee_awareness: loan.nominee_awareness || false,
        guarantor: loan.guarantor || "",
        notes: loan.notes || "",
        linked_bank_account: loan.linked_bank_account?.toString() || "",
        insurance: loan.insurance?.toString() || "",
        agreed_repayment_date: loan.agreed_repayment_date || "",
        payment_mode: loan.payment_mode || "",
        remaining_balance: loan.remaining_balance?.toString() || "",
        repayment_frequency: loan.repayment_frequency || "",
      });
    }
  }, [loan]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.lender_name || formData.lender_name.length < 2)
      newErrors.lender_name = "Lender name must be at least 2 characters";
    if (!formData.loan_amount || parseFloat(formData.loan_amount) <= 0)
      newErrors.loan_amount = "Loan amount must be positive";
    if (!formData.loan_start_date)
      newErrors.loan_start_date = "Start date is required";
    else if (formData.loan_start_date > today)
      newErrors.loan_start_date = "Start date cannot be in the future";
    if (!formData.interest_rate || parseFloat(formData.interest_rate) < 0)
      newErrors.interest_rate = "Interest rate must be non-negative";

    if (loan?.type === "Secured") {
      if (!formData.loan_type) newErrors.loan_type = "Loan type is required";
      if (
        !formData.loan_account_number ||
        !/^[0-9]+$/.test(formData.loan_account_number)
      )
        newErrors.loan_account_number = "Account number must be numeric";
      if (!formData.emi_amount || parseFloat(formData.emi_amount) <= 0)
        newErrors.emi_amount = "EMI amount must be positive";
      if (!formData.loan_end_date)
        newErrors.loan_end_date = "End date is required";
      else if (formData.loan_end_date <= formData.loan_start_date)
        newErrors.loan_end_date = "End date must be after start date";
      if (
        !formData.remaining_loan_balance ||
        parseFloat(formData.remaining_loan_balance) < 0
      )
        newErrors.remaining_loan_balance =
          "Remaining balance must be non-negative";
      if (!formData.collateral_details)
        newErrors.collateral_details = "Collateral details are required";
    } else {
      if (!formData.agreed_repayment_date)
        newErrors.agreed_repayment_date = "Repayment date is required";
      else if (formData.agreed_repayment_date <= formData.loan_start_date)
        newErrors.agreed_repayment_date =
          "Repayment date must be after start date";
      if (!formData.payment_mode)
        newErrors.payment_mode = "Payment mode is required";
      if (
        !formData.remaining_balance ||
        parseFloat(formData.remaining_balance) < 0
      )
        newErrors.remaining_balance = "Remaining balance must be non-negative";
      if (!formData.repayment_frequency)
        newErrors.repayment_frequency = "Repayment frequency is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (loan.type === "Secured") {
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
        response = await updateSecuredLoan(loan.id, payload);
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
        response = await updateUnsecuredLoan(loan.id, payload);
      }
      if (response.status) {
        toast.success("Loan updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response.message || "Failed to update loan");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update loan");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
    setErrors({});
    setBanks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Loan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[70vh]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lender_name">Lender Name</Label>
                <Input
                  id="lender_name"
                  value={formData.lender_name}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  placeholder="e.g., HDFC Bank"
                />
                {errors.lender_name && (
                  <p className="text-red-500 text-sm">{errors.lender_name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="loan_amount">Loan Amount (₹)</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  step="0.01"
                  value={formData.loan_amount}
                  onChange={handleInputChange}
                  required
                  min={1}
                  placeholder="e.g., 500000"
                />
                {errors.loan_amount && (
                  <p className="text-red-500 text-sm">{errors.loan_amount}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                <Input
                  id="interest_rate"
                  type="number"
                  step="0.01"
                  value={formData.interest_rate}
                  onChange={handleInputChange}
                  required
                  min={0}
                  placeholder="e.g., 8.5"
                />
                {errors.interest_rate && (
                  <p className="text-red-500 text-sm">{errors.interest_rate}</p>
                )}
              </div>
              <div>
                <Label htmlFor="loan_start_date">Start Date</Label>
                <Input
                  id="loan_start_date"
                  type="date"
                  value={formData.loan_start_date}
                  onChange={handleInputChange}
                  max={today}
                  required
                />
                {errors.loan_start_date && (
                  <p className="text-red-500 text-sm">
                    {errors.loan_start_date}
                  </p>
                )}
              </div>
            </div>

            {loan?.type === "Secured" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loan_type">Specific Loan Type</Label>
                    <Select
                      value={formData.loan_type}
                      onValueChange={handleSelectChange("loan_type")}
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
                    {errors.loan_type && (
                      <p className="text-red-500 text-sm">{errors.loan_type}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="loan_account_number">Account Number</Label>
                    <Input
                      id="loan_account_number"
                      value={formData.loan_account_number}
                      onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value)) {
                          handleInputChange(e);
                        }
                      }}
                      required
                      placeholder="e.g., 1234567890"
                    />
                    {errors.loan_account_number && (
                      <p className="text-red-500 text-sm">
                        {errors.loan_account_number}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emi_amount">EMI Amount (₹)</Label>
                    <Input
                      id="emi_amount"
                      type="number"
                      step="0.01"
                      value={formData.emi_amount}
                      onChange={handleInputChange}
                      required
                      min={1}
                      placeholder="e.g., 25000"
                    />
                    {errors.emi_amount && (
                      <p className="text-red-500 text-sm">
                        {errors.emi_amount}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="loan_end_date">End Date</Label>
                    <Input
                      id="loan_end_date"
                      type="date"
                      value={formData.loan_end_date}
                      onChange={handleInputChange}
                      min={formData.loan_start_date || today}
                      required
                    />
                    {errors.loan_end_date && (
                      <p className="text-red-500 text-sm">
                        {errors.loan_end_date}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remaining_loan_balance">
                      Remaining Balance (₹)
                    </Label>
                    <Input
                      id="remaining_loan_balance"
                      type="number"
                      step="0.01"
                      value={formData.remaining_loan_balance}
                      onChange={handleInputChange}
                      required
                      min={0}
                      placeholder="e.g., 300000"
                    />
                    {errors.remaining_loan_balance && (
                      <p className="text-red-500 text-sm">
                        {errors.remaining_loan_balance}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="guarantor">Guarantor (Optional)</Label>
                    <Input
                      id="guarantor"
                      value={formData.guarantor}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="collateral_details">Collateral Details</Label>
                  <Input
                    id="collateral_details"
                    value={formData.collateral_details}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Flat No. 101, Mumbai"
                  />
                  {errors.collateral_details && (
                    <p className="text-red-500 text-sm">
                      {errors.collateral_details}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linked_bank_account">
                      Linked Bank Account
                    </Label>
                    <Select
                      value={formData.linked_bank_account}
                      onValueChange={handleSelectChange("linked_bank_account")}
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
                    <Label htmlFor="insurance">Insurance ID (Optional)</Label>
                    <Input
                      id="insurance"
                      type="number"
                      value={formData.insurance}
                      onChange={handleInputChange}
                      min={1}
                      placeholder="e.g., 98765"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      maxLength={200}
                      placeholder="e.g., Loan for home renovation"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nominee_awareness"
                      checked={formData.nominee_awareness}
                      onCheckedChange={(checked) =>
                        handleInputChange({
                          target: {
                            id: "nominee_awareness",
                            type: "checkbox",
                            checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="nominee_awareness">Nominee Awareness</Label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agreed_repayment_date">
                      Repayment Date
                    </Label>
                    <Input
                      id="agreed_repayment_date"
                      type="date"
                      value={formData.agreed_repayment_date}
                      onChange={handleInputChange}
                      min={formData.loan_start_date || today}
                      required
                    />
                    {errors.agreed_repayment_date && (
                      <p className="text-red-500 text-sm">
                        {errors.agreed_repayment_date}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="payment_mode">Payment Mode</Label>
                    <Select
                      value={formData.payment_mode}
                      onValueChange={handleSelectChange("payment_mode")}
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
                    {errors.payment_mode && (
                      <p className="text-red-500 text-sm">
                        {errors.payment_mode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remaining_balance">
                      Remaining Balance (₹)
                    </Label>
                    <Input
                      id="remaining_balance"
                      type="number"
                      step="0.01"
                      value={formData.remaining_balance}
                      onChange={handleInputChange}
                      required
                      min={0}
                      placeholder="e.g., 150000"
                    />
                    {errors.remaining_balance && (
                      <p className="text-red-500 text-sm">
                        {errors.remaining_balance}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="repayment_frequency">
                      Repayment Frequency
                    </Label>
                    <Select
                      value={formData.repayment_frequency}
                      onValueChange={handleSelectChange("repayment_frequency")}
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
                    {errors.repayment_frequency && (
                      <p className="text-red-500 text-sm">
                        {errors.repayment_frequency}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      maxLength={200}
                      placeholder="e.g., Personal loan from friend"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nominee_awareness"
                      checked={formData.nominee_awareness}
                      onCheckedChange={(checked) =>
                        handleInputChange({
                          target: {
                            id: "nominee_awareness",
                            type: "checkbox",
                            checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="nominee_awareness">Nominee Awareness</Label>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLoanDialog;
