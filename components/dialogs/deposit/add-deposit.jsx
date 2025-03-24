"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDeposit, addDepositDocument } from "@/lib/deposit-api"
import { createNominee, deleteNominee } from "@/lib/nominee-api"
import { listFamilyMembers } from "@/lib/family-api"
import { toast } from "sonner"
import { Trash, Check } from "@phosphor-icons/react"

const StepIndicator = ({ number, isCompleted, isCurrent }) => {
  if (isCompleted) {
    return (
      <div className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-white">
        <Check className="h-4 w-4" />
      </div>
    )
  }
  if (isCurrent) {
    return (
      <div className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary bg-transparent relative">
        <div className="rounded-full w-2 h-2 bg-primary absolute" />
      </div>
    )
  }
  return <div className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-muted-foreground" />
}

const AddDepositDialog = ({ open, onOpenChange, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [depositId, setDepositId] = useState(null)
  const [loading, setLoading] = useState(false)
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
  })
  const [errors, setErrors] = useState({})
  const [nominees, setNominees] = useState([])
  const [familyMembers, setFamilyMembers] = useState([])
  const [newNominee, setNewNominee] = useState({ nominee_id: "", percentage: "" })
  const [documentFile, setDocumentFile] = useState(null)

  const depositTypes = ["FD", "RD"]
  const installmentTypes = ["Monthly", "Quarterly", "Annually", "One Time"]
  const today = new Date().toISOString().split("T")[0]

  const steps = [
    { number: 1, title: "Deposit Details" },
    { number: 2, title: "Add Nominee" },
    { number: 3, title: "Upload Document" },
  ]

  useEffect(() => {
    if (open && step === 2) {
      fetchFamilyMembers()
    }
  }, [open, step])

  const fetchFamilyMembers = async () => {
    try {
      const response = await listFamilyMembers()
      if (response.status) {
        setFamilyMembers(response.data)
      }
    } catch (error) {
      toast.error("Failed to fetch family members")
    }
  }

  const validateDeposit = () => {
    const newErrors = {}
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = "Deposit name must be at least 2 characters"
    if (!formData.deposit_type) newErrors.deposit_type = "Deposit type is required"
    if (!formData.installment || isNaN(formData.installment) || Number.parseFloat(formData.installment) <= 0)
      newErrors.installment = "Installment must be a positive number"
    if (!formData.installment_type) newErrors.installment_type = "Installment type is required"
    if (
      !formData.interest_rate ||
      isNaN(formData.interest_rate) ||
      Number.parseFloat(formData.interest_rate) <= 0 ||
      Number.parseFloat(formData.interest_rate) > 100
    )
      newErrors.interest_rate = "Interest rate must be a number between 0 and 100"
    if (!formData.tenure || isNaN(formData.tenure) || Number.parseInt(formData.tenure) <= 0)
      newErrors.tenure = "Tenure must be a positive integer"
    if (!formData.maturity_date) newErrors.maturity_date = "Maturity date is required"
    else if (formData.maturity_date < today) newErrors.maturity_date = "Maturity date cannot be in the past"
    if (
      !formData.maturity_amount ||
      isNaN(formData.maturity_amount) ||
      Number.parseFloat(formData.maturity_amount) <= 0
    )
      newErrors.maturity_amount = "Maturity amount must be a positive number"
    if (formData.linked_mobile_number && !/^\d{10}$/.test(formData.linked_mobile_number))
      newErrors.linked_mobile_number = "Mobile number must be exactly 10 digits"
    // Don't set errors here, we'll set them after validation
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    if (["installment", "interest_rate", "tenure", "maturity_amount"].includes(id)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value }))
      }
    } else if (id === "linked_mobile_number") {
      if (value === "" || /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value.slice(0, 10) }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleCreateDeposit = async (e) => {
    e?.preventDefault() // Optional chaining to handle cases where e is undefined

    const newErrors = {}
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = "Deposit name must be at least 2 characters"
    if (!formData.deposit_type) newErrors.deposit_type = "Deposit type is required"
    if (!formData.installment || isNaN(formData.installment) || Number.parseFloat(formData.installment) <= 0)
      newErrors.installment = "Installment must be a positive number"
    if (!formData.installment_type) newErrors.installment_type = "Installment type is required"
    if (
      !formData.interest_rate ||
      isNaN(formData.interest_rate) ||
      Number.parseFloat(formData.interest_rate) <= 0 ||
      Number.parseFloat(formData.interest_rate) > 100
    )
      newErrors.interest_rate = "Interest rate must be a number between 0 and 100"
    if (!formData.tenure || isNaN(formData.tenure) || Number.parseInt(formData.tenure) <= 0)
      newErrors.tenure = "Tenure must be a positive integer"
    if (!formData.maturity_date) newErrors.maturity_date = "Maturity date is required"
    else if (formData.maturity_date < today) newErrors.maturity_date = "Maturity date cannot be in the past"
    if (
      !formData.maturity_amount ||
      isNaN(formData.maturity_amount) ||
      Number.parseFloat(formData.maturity_amount) <= 0
    )
      newErrors.maturity_amount = "Maturity amount must be a positive number"
    if (formData.linked_mobile_number && !/^\d{10}$/.test(formData.linked_mobile_number))
      newErrors.linked_mobile_number = "Mobile number must be exactly 10 digits"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      const payload = {
        ...formData,
        installment: Number.parseFloat(formData.installment),
        interest_rate: Number.parseFloat(formData.interest_rate),
        tenure: Number.parseInt(formData.tenure),
        maturity_amount: Number.parseFloat(formData.maturity_amount),
      }
      const response = await createDeposit(payload)
      if (response.status) {
        setDepositId(response.data.id)
        toast.success("Deposit created successfully")
        setStep(2)
      } else {
        throw new Error(response.message || "Failed to create deposit")
      }
    } catch (error) {
      toast.error(error.message || "Failed to create deposit")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNominee = async () => {
    if (!newNominee.nominee_id || !newNominee.percentage) {
      toast.error("Please select a family member and enter a percentage")
      return
    }

    try {
      setLoading(true)
      const response = await createNominee("deposit", {
        nominee_id: newNominee.nominee_id,
        percentage: Number.parseInt(newNominee.percentage),
        asset_id: depositId,
      })
      if (response.status) {
        setNominees([...nominees, { ...newNominee, id: response.data?.id }])
        setNewNominee({ nominee_id: "", percentage: "" })
        toast.success("Nominee added successfully")
      }
    } catch (error) {
      toast.error("Failed to add nominee")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveNominee = async (nomineeId) => {
    try {
      setLoading(true)
      const response = await deleteNominee("deposit", nomineeId)
      if (response.status) {
        setNominees(nominees.filter((n) => n.id !== nomineeId))
        toast.success("Nominee removed successfully")
      }
    } catch (error) {
      toast.error("Failed to remove nominee")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadDocument = async () => {
    if (!documentFile) {
      toast.error("Please select a file to upload")
      return
    }

    try {
      setLoading(true)
      const response = await addDepositDocument(depositId, documentFile)
      if (response.status) {
        toast.success("Document uploaded successfully")
        setDocumentFile(null)
      }
    } catch (error) {
      toast.error("Failed to upload document")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      deposit_type: "FD",
      installment: "",
      installment_type: "Monthly",
      interest_rate: "",
      tenure: "",
      maturity_date: "",
      maturity_amount: "",
      linked_mobile_number: "",
    })
    setErrors({})
    setDepositId(null)
    setNominees([])
    setNewNominee({ nominee_id: "", percentage: "" })
    setDocumentFile(null)
    setStep(1)
    onOpenChange(false)
  }

  const handleNext = () => {
    if (step === 1) {
      handleCreateDeposit() // Call without event, since it's not form submission
    } else {
      setStep(step + 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Add New Deposit</DialogTitle>
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
            <form onSubmit={handleCreateDeposit} className="space-y-6">
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
                  type="text"
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
                <Label>Upload Deposit Document</Label>
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
              disabled={step === 1 ? !validateDeposit() || loading : loading}
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

export default AddDepositDialog

