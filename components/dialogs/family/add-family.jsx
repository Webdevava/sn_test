import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "@phosphor-icons/react";

export default function AddFamilyDialog({
  openAddDialog,
  setOpenAddDialog,
  addFormData,
  setAddFormData,
  customRelationship,
  setCustomRelationship,
  handleAddFamilyMember,
}) {
  return (
    <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={20} />
          Add Family Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Family Member</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label className={'mb-2'}>First Name</Label>
            <Input
              placeholder="Enter first name"
              value={addFormData.first_name}
              onChange={(e) =>
                setAddFormData({ ...addFormData, first_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label className={'mb-2'}>Last Name</Label>
            <Input
              placeholder="Enter last name"
              value={addFormData.last_name}
              onChange={(e) =>
                setAddFormData({ ...addFormData, last_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label className={'mb-2'}>Relationship</Label>
            <Select
              value={addFormData.relationship}
              onValueChange={(value) =>
                setAddFormData({ ...addFormData, relationship: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="sister">Sister</SelectItem>
                <SelectItem value="brother">Brother</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {addFormData.relationship === "other" && (
              <Input
                placeholder="Enter custom relationship"
                value={customRelationship}
                onChange={(e) => setCustomRelationship(e.target.value)}
                className="mt-2"
                required
              />
            )}
          </div>
          <div>
            <Label className={'mb-2'}>Date of Birth</Label>
            <Input
              type="date"
              value={addFormData.dob}
              onChange={(e) =>
                setAddFormData({ ...addFormData, dob: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label className={'mb-2'}>Gender</Label>
            <Select
              value={addFormData.gender}
              onValueChange={(value) =>
                setAddFormData({ ...addFormData, gender: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={'mb-2'}>Email</Label>
            <Input
              type="email"
              placeholder="example@domain.com"
              value={addFormData.email}
              onChange={(e) =>
                setAddFormData({ ...addFormData, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label className={'mb-2'}>Phone Number</Label>
            <Input
              placeholder="Enter 10-digit phone number"
              value={addFormData.phone_number}
              onChange={(e) =>
                setAddFormData({ ...addFormData, phone_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label className={'mb-2'}>Aadhaar Number</Label>
            <Input
              placeholder="Enter 12-digit Aadhaar number"
              value={addFormData.adhaar_number}
              onChange={(e) =>
                setAddFormData({ ...addFormData, adhaar_number: e.target.value })
              }
            />
          </div>
          <Button
            type="button"
            onClick={handleAddFamilyMember}
            className="w-full"
            disabled={
              !addFormData.first_name ||
              !addFormData.last_name ||
              !addFormData.relationship ||
              !addFormData.dob ||
              !addFormData.gender ||
              (addFormData.relationship === "other" && !customRelationship)
            }
          >
            Add Family Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}