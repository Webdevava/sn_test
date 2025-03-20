"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import EditFamilyDialog from "@/components/dialogs/family/edit-family"; // Using existing EditFamilyDialog

const getRelationBgColor = (relation) => {
  const colors = {
    father: "bg-green-200 text-green-800 font-bold",
    mother: "bg-yellow-200 text-yellow-800 font-bold",
    sister: "bg-blue-200 text-blue-800 font-bold",
    brother: "bg-red-200 text-red-800 font-bold",
    spouse: "bg-purple-200 text-purple-800 font-bold",
    child: "bg-pink-200 text-pink-800 font-bold",
    other: "bg-gray-200 text-gray-800 font-bold",
  };
  return colors[relation.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const getInitials = (firstName, lastName) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function MemberCard({
  member,
  openEditDialogWithMember,
  setOpenEditDialog,
  openEditDialog,
  selectedMember,
  setEditFormData,
  editFormData,
  handleEditFamilyMember,
  handleDeleteFamilyMember,
}) {
  const handleEdit = () => {
    openEditDialogWithMember(member.id);
  };

  return (
    <Card className="p-0 shadow-none hover:shadow-lg hover:-translate-y-1 transition-all">
      <CardHeader className="p-3 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3 w-full">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarFallback className={getRelationBgColor(member.relationship)}>
                {getInitials(member.first_name, member.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex justify-between w-full gap-2 sm:items-center">
              <h3 className="font-semibold text-sm sm:text-base">
                {`${member.first_name} ${member.last_name}`}
              </h3>
              <Badge
                variant="secondary"
                className={`${getRelationBgColor(member.relationship)} text-xs sm:text-sm w-fit`}
              >
                {member.relationship.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-popover p-2 rounded-lg">
            <p className="text-xs text-gray-500">Phone Number</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground break-all">
              {member.phone_number || "N/A"}
            </p>
          </div>
          <div className="bg-popover p-2 rounded-lg">
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground break-all">
              {member.email || "N/A"}
            </p>
          </div>
          <div className="bg-popover p-2 rounded-lg">
            <p className="text-xs text-gray-500">Age</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {calculateAge(member.dob)}
            </p>
          </div>
          <div className="bg-popover p-2 rounded-lg">
            <p className="text-xs text-gray-500">Aadhaar Number</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {member.adhaar_number || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-2 flex justify-end">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
            onClick={handleEdit}
          >
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => handleDeleteFamilyMember(member.id)}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardFooter>

      {/* Edit Dialog */}
      {selectedMember && selectedMember.id === member.id && (
        <EditFamilyDialog
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          selectedMember={selectedMember}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          customRelationship={
            !["father", "mother", "sister", "brother", "spouse", "child"].includes(
              editFormData.relationship
            )
              ? editFormData.relationship
              : ""
          }
          setCustomRelationship={(value) =>
            setEditFormData({ ...editFormData, relationship: value })
          }
          handleEditFamilyMember={handleEditFamilyMember}
        />
      )}
    </Card>
  );
}