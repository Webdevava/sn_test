import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export default function EditFamilyDialog({
  openEditDialog,
  setOpenEditDialog,
  selectedMember,
  editFormData,
  setEditFormData,
  customRelationship,
  setCustomRelationship,
  handleEditFamilyMember,
}) {
  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Family Member</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label>First Name</Label>
            <Input
              placeholder="Enter first name"
              value={editFormData.first_name || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, first_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              placeholder="Enter last name"
              value={editFormData.last_name || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, last_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Relationship</Label>
            <Select
              value={editFormData.relationship || ""}
              onValueChange={(value) =>
                setEditFormData({ ...editFormData, relationship: value })
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
            {editFormData.relationship === "other" && (
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
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={editFormData.dob || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, dob: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Gender</Label>
            <Select
              value={editFormData.gender || ""}
              onValueChange={(value) =>
                setEditFormData({ ...editFormData, gender: value })
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
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@domain.com"
              value={editFormData.email || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="Enter 10-digit phone number"
              value={editFormData.phone_number || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, phone_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Aadhaar Number</Label>
            <Input
              placeholder="Enter 12-digit Aadhaar number"
              value={editFormData.adhaar_number || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, adhaar_number: e.target.value })
              }
            />
          </div>
          <Button
            type="button"
            onClick={handleEditFamilyMember}
            className="w-full"
            disabled={
              !editFormData.first_name ||
              !editFormData.last_name ||
              !editFormData.relationship ||
              !editFormData.dob ||
              !editFormData.gender ||
              (editFormData.relationship === "other" && !customRelationship)
            }
          >
            Update Family Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}