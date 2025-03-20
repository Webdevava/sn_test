// @/components/AddTravelDialog.jsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createTravelInsurance, uploadTravelInsuranceDocument } from "@/lib/travel-insurance-api";
import { toast } from "sonner";

const AddTravelDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Insurance, 2: Nominee, 3: Document
  const [insuranceId, setInsuranceId] = useState(null);
  const [insuranceData, setInsuranceData] = useState({
    travel_type: "",
    policy_number: "",
    insurer_name: "",
    premium_amount: "",
    sum_insured: "",
    policy_start_date: "",
    policy_expiry_date: "",
    linked_mobile: "",
    coverage_details: "",
  });
  const [nomineeData, setNomineeData] = useState({
    first_name: "",
    last_name: "",
    relationship: "",
    percentage: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const relationships = ["Spouse", "Parent", "Child", "Sibling", "Other"];

  const validateInsurance = () => {
    const newErrors = {};
    if (!insuranceData.travel_type) newErrors.travel_type = "Travel type is required";
    if (!insuranceData.policy_number) newErrors.policy_number = "Policy number is required";
    if (!insuranceData.insurer_name) newErrors.insurer_name = "Insurer name is required";
    if (!insuranceData.premium_amount || insuranceData.premium_amount <= 0) newErrors.premium_amount = "Premium amount must be positive";
    if (!insuranceData.sum_insured || insuranceData.sum_insured <= 0) newErrors.sum_insured = "Sum insured must be positive";
    if (!insuranceData.policy_start_date) newErrors.policy_start_date = "Start date is required";
    if (!insuranceData.policy_expiry_date) newErrors.policy_expiry_date = "Expiry date is required";
    if (insuranceData.linked_mobile && !/^\d{10}$/.test(insuranceData.linked_mobile)) newErrors.linked_mobile = "Mobile must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNominee = () => {
    const newErrors = {};
    if (!nomineeData.first_name) newErrors.first_name = "First name is required";
    if (!nomineeData.last_name) newErrors.last_name = "Last name is required";
    if (!nomineeData.relationship) newErrors.relationship = "Relationship is required";
    if (!nomineeData.percentage || nomineeData.percentage <= 0 || nomineeData.percentage > 100) newErrors.percentage = "Percentage must be between 1 and 100";
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

  const handleInsuranceChange = (e) => {
    const { id, value } = e.target;
    setInsuranceData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleNomineeChange = (e) => {
    const { id, value } = e.target;
    setNomineeData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleInsuranceSubmit = async (e) => {
    e.preventDefault();
    if (!validateInsurance()) return;

    setLoading(true);
    try {
      const response = await createTravelInsurance(insuranceData);
      if (response.status) {
        toast.success("Travel insurance created successfully");
        setInsuranceId(response.data.id); // Assuming ID is in response.data.id
        setStep(2);
      } else {
        throw new Error(response.message || "Failed to create insurance");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create insurance");
    } finally {
      setLoading(false);
    }
  };

  const handleNomineeSubmit = (e) => {
    e.preventDefault();
    if (!validateNominee()) return;
    setStep(3);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!validateFile()) return;

    setLoading(true);
    try {
      const response = await uploadTravelInsuranceDocument(insuranceId, file);
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
    setInsuranceData({
      travel_type: "",
      policy_number: "",
      insurer_name: "",
      premium_amount: "",
      sum_insured: "",
      policy_start_date: "",
      policy_expiry_date: "",
      linked_mobile: "",
      coverage_details: "",
    });
    setNomineeData({ first_name: "", last_name: "", relationship: "", percentage: "" });
    setFile(null);
    setInsuranceId(null);
    setStep(1);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{step === 1 ? "Add Travel Insurance" : step === 2 ? "Add Nominee" : "Upload Document"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleInsuranceSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2"><Label htmlFor="travel_type">Travel Type</Label><Input id="travel_type" value={insuranceData.travel_type} onChange={handleInsuranceChange} required />{errors.travel_type && <p className="text-red-500 text-sm">{errors.travel_type}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="policy_number">Policy Number</Label><Input id="policy_number" value={insuranceData.policy_number} onChange={handleInsuranceChange} required />{errors.policy_number && <p className="text-red-500 text-sm">{errors.policy_number}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="insurer_name">Insurer Name</Label><Input id="insurer_name" value={insuranceData.insurer_name} onChange={handleInsuranceChange} required />{errors.insurer_name && <p className="text-red-500 text-sm">{errors.insurer_name}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="premium_amount">Premium Amount</Label><Input id="premium_amount" type="number" value={insuranceData.premium_amount} onChange={handleInsuranceChange} required />{errors.premium_amount && <p className="text-red-500 text-sm">{errors.premium_amount}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="sum_insured">Sum Insured</Label><Input id="sum_insured" type="number" value={insuranceData.sum_insured} onChange={handleInsuranceChange} required />{errors.sum_insured && <p className="text-red-500 text-sm">{errors.sum_insured}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="policy_start_date">Start Date</Label><Input id="policy_start_date" type="date" value={insuranceData.policy_start_date} onChange={handleInsuranceChange} required />{errors.policy_start_date && <p className="text-red-500 text-sm">{errors.policy_start_date}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="policy_expiry_date">Expiry Date</Label><Input id="policy_expiry_date" type="date" value={insuranceData.policy_expiry_date} onChange={handleInsuranceChange} required />{errors.policy_expiry_date && <p className="text-red-500 text-sm">{errors.policy_expiry_date}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="linked_mobile">Linked Mobile</Label><Input id="linked_mobile" value={insuranceData.linked_mobile} onChange={handleInsuranceChange} maxLength={10} />{errors.linked_mobile && <p className="text-red-500 text-sm">{errors.linked_mobile}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="coverage_details">Coverage Details</Label><Input id="coverage_details" value={insuranceData.coverage_details} onChange={handleInsuranceChange} /></div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Next"}</Button>
            </DialogFooter>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleNomineeSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2"><Label htmlFor="first_name">First Name</Label><Input id="first_name" value={nomineeData.first_name} onChange={handleNomineeChange} required />{errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}</div>
                <div className="grid gap-2"><Label htmlFor="last_name">Last Name</Label><Input id="last_name" value={nomineeData.last_name} onChange={handleNomineeChange} required />{errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}</div>
                <div className="grid gap-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <select id="relationship" value={nomineeData.relationship} onChange={handleNomineeChange} required className="border rounded p-2">
                    <option value="">Select relationship</option>
                    {relationships.map((rel) => (<option key={rel} value={rel}>{rel}</option>))}
                  </select>
                  {errors.relationship && <p className="text-red-500 text-sm">{errors.relationship}</p>}
                </div>
                <div className="grid gap-2"><Label htmlFor="percentage">Percentage Share</Label><Input id="percentage" type="number" value={nomineeData.percentage} onChange={handleNomineeChange} required />{errors.percentage && <p className="text-red-500 text-sm">{errors.percentage}</p>}</div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading}>Next</Button>
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
                  <p className="text-sm text-gray-500">Upload a PDF document related to the insurance.</p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddTravelDialog;