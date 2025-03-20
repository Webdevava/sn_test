import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDeposit, addDepositDocument } from "@/lib/deposit-api";
import { toast } from "sonner";

const AddDepositDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Deposit, 2: Document
  const [depositId, setDepositId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    deposit_type: "FD",
    installment: "",
    installment_type: "Monthly",
    interest_rate: "",
    tenure: "",
    maturity_date: "",
    maturity_amount: "",
    linked_mobile_number: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const depositTypes = ["FD", "RD"];
  const installmentTypes = ["Monthly", "Quarterly", "Annually", "One Time"];
  const today = new Date().toISOString().split("T")[0]; // Current date for validation

  const validateDeposit = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = "Deposit name must be at least 2 characters";
    if (!formData.deposit_type) newErrors.deposit_type = "Deposit type is required";
    if (!formData.installment || isNaN(formData.installment) || parseFloat(formData.installment) <= 0)
      newErrors.installment = "Installment must be a positive number";
    if (!formData.installment_type) newErrors.installment_type = "Installment type is required";
    if (!formData.interest_rate || isNaN(formData.interest_rate) || parseFloat(formData.interest_rate) <= 0 || parseFloat(formData.interest_rate) > 100)
      newErrors.interest_rate = "Interest rate must be a number between 0 and 100";
    if (!formData.tenure || isNaN(formData.tenure) || parseInt(formData.tenure) <= 0)
      newErrors.tenure = "Tenure must be a positive integer";
    if (!formData.maturity_date) newErrors.maturity_date = "Maturity date is required";
    else if (formData.maturity_date < today) newErrors.maturity_date = "Maturity date cannot be in the past";
    if (!formData.maturity_amount || isNaN(formData.maturity_amount) || parseFloat(formData.maturity_amount) <= 0)
      newErrors.maturity_amount = "Maturity amount must be a positive number";
    if (formData.linked_mobile_number && !/^\d{10}$/.test(formData.linked_mobile_number))
      newErrors.linked_mobile_number = "Mobile number must be exactly 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = () => {
    const newErrors = {};
    if (!file) newErrors.file = "Please select a PDF file";
    else if (file.type !== "application/pdf") newErrors.file = "Only PDF files are allowed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Restrict non-numeric input for specific fields
    if (["installment", "interest_rate", "tenure", "maturity_amount"].includes(id)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
    } else if (id === "linked_mobile_number") {
      if (value === "" || /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value.slice(0, 10) }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!validateDeposit()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        installment: parseFloat(formData.installment),
        interest_rate: parseFloat(formData.interest_rate),
        tenure: parseInt(formData.tenure),
        maturity_amount: parseFloat(formData.maturity_amount),
      };
      const response = await createDeposit(payload);
      if (response.status) {
        toast.success("Deposit created successfully");
        setDepositId(response.data.id); // Adjust based on your API response
        setStep(2);
      } else {
        throw new Error(response.message || "Failed to create deposit");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!validateFile()) return;

    setLoading(true);
    try {
      const response = await addDepositDocument(depositId, file);
      if (response.status) {
        toast.success("Document uploaded successfully");
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || "Failed to upload document");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      deposit_type: "FD",
      installment: "",
      installment_type: "Monthly",
      interest_rate: "",
      maturity_date: "",
      tenure: "",
      maturity_amount: "",
      linked_mobile_number: "",
    });
    setFile(null);
    setDepositId(null);
    setStep(1);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{step === 1 ? "Add Deposit" : "Upload Document"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleDepositSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Deposit Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} required />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deposit_type">Deposit Type</Label>
                  <Select value={formData.deposit_type} onValueChange={handleSelectChange("deposit_type")} required>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{depositTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                  </Select>
                  {errors.deposit_type && <p className="text-red-500 text-sm">{errors.deposit_type}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="installment">Installment Amount</Label>
                  <Input
                    id="installment"
                    type="text" // Use text to control input better
                    value={formData.installment}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5000"
                  />
                  {errors.installment && <p className="text-red-500 text-sm">{errors.installment}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="installment_type">Installment Type</Label>
                  <Select value={formData.installment_type} onValueChange={handleSelectChange("installment_type")} required>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{installmentTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                  </Select>
                  {errors.installment_type && <p className="text-red-500 text-sm">{errors.installment_type}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                  <Input
                    id="interest_rate"
                    type="text"
                    value={formData.interest_rate}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5.5"
                  />
                  {errors.interest_rate && <p className="text-red-500 text-sm">{errors.interest_rate}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tenure">Tenure (Months)</Label>
                  <Input
                    id="tenure"
                    type="text"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 12"
                  />
                  {errors.tenure && <p className="text-red-500 text-sm">{errors.tenure}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maturity_date">Maturity Date</Label>
                  <Input
                    id="maturity_date"
                    type="date"
                    value={formData.maturity_date}
                    onChange={handleInputChange}
                    min={today}
                    required
                  />
                  {errors.maturity_date && <p className="text-red-500 text-sm">{errors.maturity_date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maturity_amount">Maturity Amount</Label>
                  <Input
                    id="maturity_amount"
                    type="text"
                    value={formData.maturity_amount}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5500"
                  />
                  {errors.maturity_amount && <p className="text-red-500 text-sm">{errors.maturity_amount}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linked_mobile_number">Linked Mobile (Optional)</Label>
                  <Input
                    id="linked_mobile_number"
                    type="text"
                    value={formData.linked_mobile_number}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="e.g., 9876543210"
                  />
                  {errors.linked_mobile_number && <p className="text-red-500 text-sm">{errors.linked_mobile_number}</p>}
                </div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Next"}</Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleFileSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Upload PDF Document</Label>
                  <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} />
                  {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                  <p className="text-sm text-gray-500">Upload a PDF document related to the deposit.</p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddDepositDialog;