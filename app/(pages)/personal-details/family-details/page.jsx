"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import MemberCard from "@/components/cards/member-card";
import AddFamilyDialog from "@/components/dialogs/family/add-family";
import EditFamilyDialog from "@/components/dialogs/family/edit-family";
import { Users as UsersIcon } from "@phosphor-icons/react";

import {
  createFamilyMember,
  listFamilyMembers,
  getFamilyMemberDetail,
  updateFamilyMember,
  deleteFamilyMember,
} from "@/lib/family-api";

export default function FamilyPage() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [customRelationship, setCustomRelationship] = useState("");

  const [addFormData, setAddFormData] = useState({
    first_name: "",
    last_name: "",
    relationship: "",
    dob: "",
    gender: "",
    email: "",
    phone_number: "",
    adhaar_number: "",
  });

  const [editFormData, setEditFormData] = useState({});

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await listFamilyMembers();
      if (response.status) {
        setFamilyMembers(response.data);
      }
    } catch (err) {
      setError("Failed to fetch family members");
      toast.error("Failed to fetch family members");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (formData) => {
    const today = new Date();
    const dob = new Date(formData.dob);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (dob > today) {
      toast.error("Date of birth cannot be in the future");
      return false;
    }
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }
    if (formData.adhaar_number && !/^\d{12}$/.test(formData.adhaar_number)) {
      toast.error("Aadhaar number must be exactly 12 digits");
      return false;
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleAddFamilyMember = async () => {
    const finalData = {
      ...addFormData,
      relationship:
        addFormData.relationship === "other"
          ? customRelationship
          : addFormData.relationship,
    };

    if (!validateForm(finalData)) return;

    try {
      const response = await createFamilyMember(finalData);
      if (response.status) {
        toast.success("Family member added successfully");
        setOpenAddDialog(false);
        setAddFormData({
          first_name: "",
          last_name: "",
          relationship: "",
          dob: "",
          gender: "",
          email: "",
          phone_number: "",
          adhaar_number: "",
        });
        setCustomRelationship("");
        await fetchFamilyMembers();
      }
    } catch (error) {
      toast.error("Failed to add family member");
    }
  };

  const handleEditFamilyMember = async () => {
    const finalData = {
      ...editFormData,
      relationship:
        editFormData.relationship === "other"
          ? customRelationship
          : editFormData.relationship,
    };

    if (!validateForm(finalData)) return;

    try {
      const response = await updateFamilyMember(selectedMember.id, finalData);
      if (response.status) {
        toast.success("Family member updated successfully");
        setOpenEditDialog(false);
        setSelectedMember(null);
        setCustomRelationship("");
        await fetchFamilyMembers();
      }
    } catch (error) {
      toast.error("Failed to update family member");
    }
  };

  const handleDeleteFamilyMember = async (memberId) => {
    try {
      const response = await deleteFamilyMember(memberId);
      if (response.status) {
        setFamilyMembers(familyMembers.filter((member) => member.id !== memberId));
        toast.success("Family member deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete family member");
    }
  };

  const openEditDialogWithMember = async (memberId) => {
    try {
      const response = await getFamilyMemberDetail(memberId);
      if (response.status) {
        setSelectedMember(response.data);
        setEditFormData(response.data);
        const commonRelationships = [
          "father",
          "mother",
          "sister",
          "brother",
          "spouse",
          "child",
        ];
        setCustomRelationship(
          commonRelationships.includes(response.data.relationship)
            ? ""
            : response.data.relationship
        );
        setOpenEditDialog(true);
      }
    } catch (error) {
      toast.error("Failed to fetch family member details");
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-pulse">
        <UsersIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Loading family members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
        <UsersIcon size={36} className="mb-4 text-red-400 sm:size-48" />
        <p className="text-red-500 text-base sm:text-lg">{error}</p>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Something went wrong. Try adding a family member or refresh the page.
        </p>
        <div className="mt-4">
          <AddFamilyDialog
            openAddDialog={openAddDialog}
            setOpenAddDialog={setOpenAddDialog}
            addFormData={addFormData}
            setAddFormData={setAddFormData}
            customRelationship={customRelationship}
            setCustomRelationship={setCustomRelationship}
            handleAddFamilyMember={handleAddFamilyMember}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative">
      <Toaster richColors />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          {/* <UsersIcon size={24} className="text-primary sm:size-32" /> */}
          <h1 className="text-xl sm:text-2xl font-bold">
            Total Members ({familyMembers.length})
          </h1>
        </div>
        <div className="hidden sm:block">
          <AddFamilyDialog
            openAddDialog={openAddDialog}
            setOpenAddDialog={setOpenAddDialog}
            addFormData={addFormData}
            setAddFormData={setAddFormData}
            customRelationship={customRelationship}
            setCustomRelationship={setCustomRelationship}
            handleAddFamilyMember={handleAddFamilyMember}
          />
        </div>
      </div>

      {familyMembers.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 rounded-lg text-center p-4 sm:p-6">
          <UsersIcon size={36} className="mb-4 text-gray-400 sm:size-48" />
          <p className="text-gray-500 text-base sm:text-lg">No family members found</p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Click below to add your first family member
          </p>
          <div className="mt-4">
            <AddFamilyDialog
              openAddDialog={openAddDialog}
              setOpenAddDialog={setOpenAddDialog}
              addFormData={addFormData}
              setAddFormData={setAddFormData}
              customRelationship={customRelationship}
              setCustomRelationship={setCustomRelationship}
              handleAddFamilyMember={handleAddFamilyMember}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 pb-16 sm:pb-0">
          {familyMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              openEditDialogWithMember={openEditDialogWithMember}
              setOpenEditDialog={setOpenEditDialog}
              openEditDialog={openEditDialog}
              selectedMember={selectedMember}
              setEditFormData={setEditFormData}
              editFormData={editFormData}
              handleEditFamilyMember={handleEditFamilyMember}
              handleDeleteFamilyMember={handleDeleteFamilyMember}
            />
          ))}
        </div>
      )}

      {/* Fixed Add Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden">
        <AddFamilyDialog
          openAddDialog={openAddDialog}
          setOpenAddDialog={setOpenAddDialog}
          addFormData={addFormData}
          setAddFormData={setAddFormData}
          customRelationship={customRelationship}
          setCustomRelationship={setCustomRelationship}
          handleAddFamilyMember={handleAddFamilyMember}
        />
      </div>

      <EditFamilyDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        selectedMember={selectedMember}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        customRelationship={customRelationship}
        setCustomRelationship={setCustomRelationship}
        handleEditFamilyMember={handleEditFamilyMember}
      />
    </div>
  );
}