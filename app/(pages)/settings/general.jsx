"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import { 
  updateProfile, 
  getProfileDetail, 
  changePassword, 
  deleteAccount 
} from "@/lib/profile-api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GeneralSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    pan: "",
    adhaar: "",
    dob: "",
    profile_picture: "",
    password: "••••••••••",
  });
  const [initialProfile, setInitialProfile] = useState({});

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone_number: "",
    email: "",
    address: "",
    alternate_phone_number: "",
  });
  const [initialEmergencyContact, setInitialEmergencyContact] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfileDetail();

      if (response.data && response.data.status) {
        const profileData = {
          first_name: response.data.data.first_name || "",
          middle_name: response.data.data.middle_name || "",
          last_name: response.data.data.last_name || "",
          pan: response.data.data.pan || "",
          adhaar: response.data.data.adhaar || "",
          dob: response.data.data.dob || "",
          profile_picture: response.data.data.profile_picture || "",
        };
        setProfile((prev) => ({ ...prev, ...profileData }));
        setInitialProfile(profileData);

        if (response.data.data.emergency_contacts?.length > 0) {
          const contactData = {
            name: response.data.data.emergency_contacts[0].name || "",
            relationship: response.data.data.emergency_contacts[0].relationship || "",
            phone_number: response.data.data.emergency_contacts[0].phone_number || "",
            email: response.data.data.emergency_contacts[0].email || "",
            address: response.data.data.emergency_contacts[0].address || "",
            alternate_phone_number: response.data.data.emergency_contacts[0].alternate_phone_number || "",
          };
          setEmergencyContact(contactData);
          setInitialEmergencyContact(contactData);
        }
      } else {
        toast.warning("Warning", {
          description: response.data?.message || "Failed to fetch profile data",
        });
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error("Error", {
        description: "An error occurred while fetching profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const changedFields = {};
      Object.keys(profile).forEach((key) => {
        if (key !== "profile_picture" && key !== "password" && profile[key] !== initialProfile[key]) {
          changedFields[key] = profile[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast.info("Info", { description: "No changes detected" });
        return;
      }

      const response = await updateProfile(changedFields);
      if (response.status) {
        toast.success("Success", { description: "Profile updated successfully" });
        setInitialProfile((prev) => ({ ...prev, ...changedFields }));
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error", { description: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyContactUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const changedContactFields = {};
      Object.keys(emergencyContact).forEach((key) => {
        if (emergencyContact[key] !== initialEmergencyContact[key]) {
          changedContactFields[key] = emergencyContact[key];
        }
      });

      if (Object.keys(changedContactFields).length === 0) {
        toast.info("Info", { description: "No changes detected in emergency contact" });
        return;
      }

      const response = await updateProfile({ emergency_contacts: [{ ...emergencyContact }] });
      if (response.status) {
        toast.success("Success", { description: "Emergency contact updated successfully" });
        setInitialEmergencyContact(emergencyContact);
      } else {
        throw new Error(response.message || "Failed to update emergency contact");
      }
    } catch (error) {
      toast.error("Error", { description: error.message || "Failed to update emergency contact" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Error", { description: "Only JPG, JPEG, or PNG files are allowed" });
      return;
    }

    if (file.size > 1048576) {
      toast.error("Error", { description: "File size should not exceed 1MB" });
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await updateProfile(formData);
      if (response.status && response.data?.profile_picture) {
        setProfile((prev) => ({ ...prev, profile_picture: response.data.profile_picture }));
        setInitialProfile((prev) => ({ ...prev, profile_picture: response.data.profile_picture }));
        toast.success("Success", { description: "Profile picture updated successfully" });
      } else {
        throw new Error(response.message || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error("Error", { description: error.message || "Failed to upload image" });
      await fetchProfile();
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", selectedTheme);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    applyTheme(value);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Error", { description: "New passwords do not match" });
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });

      if (response.status) {
        toast.success("Success", { description: "Password changed successfully" });
        setPasswordModalOpen(false);
        setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
      } else {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Error", { description: error.message || "Failed to change password" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await deleteAccount();
      if (response.status) {
        toast.success("Success", { description: "Your account has been deleted" });
        handleLogout();
      } else {
        throw new Error(response.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("Error", { description: error.message || "Failed to delete account" });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => Cookies.remove(cookieName));
    localStorage.clear();
    router.push("/");
  };

  // Function to get initials from name
  const getInitials = () => {
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="container mx-auto lg:px-4 lg:py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-foreground">General Settings</h1>

      {/* Profile Picture Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-foreground">Profile Picture</h2>
            <p className="text-muted-foreground text-sm">
              Choose an image that best reflects your identity
              <br />
              (JPG, JPEG, or PNG only. 1MB Max)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/placeholder.svg?height=80&width=80")}
                />
              ) : (
                <span className="text-primary text-2xl font-semibold">
                  {getInitials()}
                </span>
              )}
            </div>
            <label className="inline-flex items-center justify-center rounded-md text-sm font-medium 
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
              focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
              border border-input bg-background hover:bg-accent hover:text-accent-foreground 
              h-10 px-4 py-2 cursor-pointer">
              {uploadLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploadLoading ? "Uploading..." : "Upload"}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                disabled={uploadLoading || loading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <form onSubmit={handleProfileUpdate} className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-foreground">Personal Information</h2>
            <p className="text-muted-foreground text-sm">Edit your personal information</p>
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input
              id="middle_name"
              name="middle_name"
              value={profile.middle_name}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">PAN</Label>
            <Input
              id="pan"
              name="pan"
              value={profile.pan}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adhaar">Aadhaar</Label>
            <Input
              id="adhaar"
              name="adhaar"
              value={profile.adhaar}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={profile.dob}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>
      </form>

      {/* Emergency Contact Section */}
      <form onSubmit={handleEmergencyContactUpdate} className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-foreground">Emergency Contact</h2>
            <p className="text-muted-foreground text-sm">Edit your emergency contact details</p>
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input
              id="contact-name"
              name="name"
              value={emergencyContact.name}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-relationship">Relationship</Label>
            <Input
              id="contact-relationship"
              name="relationship"
              value={emergencyContact.relationship}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone Number</Label>
            <Input
              id="contact-phone"
              name="phone_number"
              value={emergencyContact.phone_number}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              value={emergencyContact.email}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address">Address</Label>
            <Input
              id="contact-address"
              name="address"
              value={emergencyContact.address}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-alt-phone">Alternate Phone</Label>
            <Input
              id="contact-alt-phone"
              name="alternate_phone_number"
              value={emergencyContact.alternate_phone_number}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>
      </form>

      {/* Account Management Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <h2 className="text-xl font-semibold mb-1 text-foreground">Account Management</h2>
        <p className="text-muted-foreground text-sm mb-4">Edit Your Password</p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-grow">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={profile.password}
              className="w-full pr-10"
              disabled
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={togglePasswordVisibility}
              type="button"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            variant="outline"
            className="whitespace-nowrap w-full sm:w-auto"
            onClick={() => setPasswordModalOpen(true)}
          >
            Change Password
          </Button>
        </div>

        {/* Password Change Dialog */}
        <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Update your password to ensure account security
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old_password">Current Password</Label>
                <Input
                  id="old_password"
                  name="old_password"
                  type="password"
                  value={passwordForm.old_password}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Language Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <h2 className="text-xl font-semibold mb-1 text-foreground">Language</h2>
        <p className="text-muted-foreground text-sm mb-4">Customize your language</p>
        <div className="w-full md:w-60">
          <Select defaultValue="english" disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Theme Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <h2 className="text-xl font-semibold mb-1 text-foreground">Theme</h2>
        <p className="text-muted-foreground text-sm mb-4">Choose a preferred theme</p>
        <RadioGroup 
          value={theme} 
          onValueChange={handleThemeChange} 
          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6" 
          disabled={loading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Account Actions */}
      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          variant="destructive"
          disabled={loading}
          onClick={() => setDeleteDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          Delete Account
        </Button>
        <Button
          variant="default"
          disabled={loading}
          onClick={handleLogout}
          className="w-full sm:w-auto"
        >
          Log Out
        </Button>
      </div>
      
      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}