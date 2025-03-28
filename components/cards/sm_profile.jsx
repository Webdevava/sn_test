"use client";
import React, { useState, useEffect } from "react";
import { getProfileDetail } from "@/lib/profile-api";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfileDetail();
      if (response) {
        setProfile(response);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getFullName = () => {
    if (!profile) return "";
    const parts = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean);
    return parts.join(" ");
  };

  const getInitials = () => {
    if (!profile) return "";
    const first = profile.first_name?.[0] || "";
    const last = profile.last_name?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col  p-6 bg-background border shadow-md rounded-lg">
      {error && <div className="text-red-600 p-4 mb-4 rounded w-full">{error}</div>}

      <div className="mb-6">
        <Avatar className="w-28 h-28">
          {profile?.profile_picture ? (
            <AvatarImage src={profile.profile_picture} alt={getFullName()} />
          ) : null}
          <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
      <h2 className="text-2xl font-bold text-left mb-2">
        {getFullName() || "Not available"}
      </h2>
      <p className="text-gray-600 text-lg text-left">{formatDate(profile?.dob)}</p>

      <Button variant={"outline"} className="mt-4">
        View More
      </Button>
    </div>
  );
};

export default ProfileCard;
