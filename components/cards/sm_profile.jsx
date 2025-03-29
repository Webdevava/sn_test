"use client";
import React, { useState, useEffect } from "react";
import { getProfileDetail } from "@/lib/profile-api";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AddressList from "../sections/address-section";
import ContactList from "../sections/contact-section";
import DocumentList from "../sections/document-section";

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTabs, setShowTabs] = useState(false);

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

  const toggleTabs = () => {
    setShowTabs(!showTabs);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 bg-background border shadow-md rounded-lg">
      {error && <div className="text-red-600 p-4 mb-4 rounded w-full">{error}</div>}
      
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
        <Avatar className="w-28 h-28">
          {profile?.profile_picture ? (
            <AvatarImage src={profile.profile_picture} alt={getFullName()} />
          ) : null}
          <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-2xl font-bold mb-2">
            {getFullName() || "Not available"}
          </h2>
          <p className="text-gray-600 text-lg">{formatDate(profile?.dob)}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={toggleTabs}
          >
            {showTabs ? "Hide Details" : "View More"}
          </Button>
        </div>
      </div>

      {showTabs && (
        <Card className="mt-6">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="p-2">
              <ContactList profile={profile} />
            </TabsContent>
            
            <TabsContent value="address" className="p-2">
              <AddressList profile={profile} />
            </TabsContent>
            
            <TabsContent value="documents" className="p-2">
              <DocumentList profile={profile} />
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default ProfileCard;