"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import { updateProfile, getProfileDetail, changePassword, deleteAccount } from "@/lib/profile-api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";

export default function GeneralSettings() {
  const { t, language, setLanguage } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    pan: "",
    aadhaar: "",
    dob: "",
    profilePicture: "",
    password: "••••••••••",
  });
  const [initialProfile, setInitialProfile] = useState({});

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    address: "",
    alternatePhoneNumber: "",
  });
  const [initialEmergencyContact, setInitialEmergencyContact] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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
          firstName: response.data.data.first_name || "",
          middleName: response.data.data.middle_name || "",
          lastName: response.data.data.last_name || "",
          pan: response.data.data.pan || "",
          aadhaar: response.data.data.adhaar || "",
          dob: response.data.data.dob || "",
          profilePicture: response.data.data.profile_picture || "",
        };
        setProfile((prev) => ({ ...prev, ...profileData }));
        setInitialProfile(profileData);

        if (response.data.data.emergency_contacts?.length > 0) {
          const contactData = {
            name: response.data.data.emergency_contacts[0].name || "",
            relationship: response.data.data.emergency_contacts[0].relationship || "",
            phoneNumber: response.data.data.emergency_contacts[0].phone_number || "",
            email: response.data.data.emergency_contacts[0].email || "",
            address: response.data.data.emergency_contacts[0].address || "",
            alternatePhoneNumber: response.data.data.emergency_contacts[0].alternate_phone_number || "",
          };
          setEmergencyContact(contactData);
          setInitialEmergencyContact(contactData);
        }
      } else {
        toast.warning(t("warning"), {
          description: response.data?.message || t("failedFetchProfile"),
        });
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error(t("error"), {
        description: t("errorFetchingProfile"),
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
        if (key !== "profilePicture" && key !== "password" && profile[key] !== initialProfile[key]) {
          changedFields[key] = profile[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast.info(t("info"), { description: t("noChangesDetected") });
        return;
      }

      const response = await updateProfile(changedFields);
      if (response.status) {
        toast.success(t("success"), { description: t("profileUpdatedSuccessfully") });
        setInitialProfile((prev) => ({ ...prev, ...changedFields }));
      } else {
        throw new Error(response.message || t("failedUpdateProfile"));
      }
    } catch (error) {
      toast.error(t("error"), { description: error.message || t("failedUpdateProfile") });
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
        toast.info(t("info"), { description: t("noChangesEmergencyContact") });
        return;
      }

      const response = await updateProfile({ emergency_contacts: [{ ...emergencyContact }] });
      if (response.status) {
        toast.success(t("success"), { description: t("emergencyContactUpdatedSuccessfully") });
        setInitialEmergencyContact(emergencyContact);
      } else {
        throw new Error(response.message || t("failedUpdateEmergencyContact"));
      }
    } catch (error) {
      toast.error(t("error"), { description: error.message || t("failedUpdateEmergencyContact") });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error(t("error"), { description: t("invalidFileType") });
      return;
    }

    if (file.size > 1048576) {
      toast.error(t("error"), { description: t("fileSizeExceedsLimit") });
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await updateProfile(formData);
      if (response.status && response.data?.profile_picture) {
        setProfile((prev) => ({ ...prev, profilePicture: response.data.profile_picture }));
        setInitialProfile((prev) => ({ ...prev, profilePicture: response.data.profile_picture }));
        toast.success(t("success"), { description: t("profilePictureUpdatedSuccessfully") });
      } else {
        throw new Error(response.message || t("failedUploadProfilePicture"));
      }
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error(t("error"), { description: error.message || t("failedUploadProfilePicture") });
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
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t("error"), { description: t("passwordsDoNotMatch") });
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.status) {
        toast.success(t("success"), { description: t("passwordChangedSuccessfully") });
        setPasswordModalOpen(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(response.message || t("failedChangePassword"));
      }
    } catch (error) {
      toast.error(t("error"), { description: error.message || t("failedChangePassword") });
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
        toast.success(t("success"), { description: t("accountDeletedSuccessfully") });
        handleLogout();
      } else {
        throw new Error(response.message || t("failedDeleteAccount"));
      }
    } catch (error) {
      toast.error(t("error"), { description: error.message || t("failedDeleteAccount") });
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

  const getInitials = () => {
    const first = profile.firstName?.[0] || '';
    const last = profile.lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  return (
    <div className="container mx-auto lg:px-4 lg:py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-foreground">{t("generalSettings")}</h1>

      {/* Profile Picture Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-foreground">{t("profilePicture")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("profilePictureDescription")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={t("profilePicture")}
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
              {uploadLoading ? t("uploading") : t("upload")}
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
            <h2 className="text-xl font-semibold mb-1 text-foreground">{t("personalInformation")}</h2>
            <p className="text-muted-foreground text-sm">{t("personalInformationDescription")}</p>
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("saveChanges")
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">{t("middleName")}</Label>
            <Input
              id="middleName"
              name="middleName"
              value={profile.middleName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pan">{t("pan")}</Label>
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
            <Label htmlFor="aadhaar">{t("aadhaar")}</Label>
            <Input
              id="aadhaar"
              name="aadhaar"
              value={profile.aadhaar}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">{t("dateOfBirth")}</Label>
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
            <h2 className="text-xl font-semibold mb-1 text-foreground">{t("emergencyContact")}</h2>
            <p className="text-muted-foreground text-sm">{t("emergencyContactDescription")}</p>
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("saveChanges")
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contact-name">{t("name")}</Label>
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
            <Label htmlFor="contact-relationship">{t("relationship")}</Label>
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
            <Label htmlFor="contact-phone">{t("phoneNumber")}</Label>
            <Input
              id="contact-phone"
              name="phoneNumber"
              value={emergencyContact.phoneNumber}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">{t("email")}</Label>
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
            <Label htmlFor="contact-address">{t("address")}</Label>
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
            <Label htmlFor="contact-alt-phone">{t("alternatePhoneNumber")}</Label>
            <Input
              id="contact-alt-phone"
              name="alternatePhoneNumber"
              value={emergencyContact.alternatePhoneNumber}
              onChange={handleEmergencyContactChange}
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>
      </form>

      {/* Language Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <h2 className="text-xl font-semibold mb-1 text-foreground">{t("language")}</h2>
        <p className="text-muted-foreground text-sm mb-4">{t("languageDescription")}</p>
        <div className="w-full md:w-60">
          <Select value={language} onValueChange={handleLanguageChange} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("english")}</SelectItem>
              <SelectItem value="hi">{t("hindi")}</SelectItem>
              <SelectItem value="mr">{t("marathi")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Account Management Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <h2 className="text-xl font-semibold mb-1 text-foreground">{t("accountManagement")}</h2>
        <p className="text-muted-foreground text-sm mb-4">{t("accountManagementDescription")}</p>
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
            {t("changePassword")}
          </Button>
        </div>

        {/* Password Change Dialog */}
        <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("changePassword")}</DialogTitle>
              <DialogDescription>{t("changePasswordDescription")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">{t("currentPassword")}</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("newPassword")}</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
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
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("changing")}
                    </>
                  ) : (
                    t("changePassword")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Theme Section */}
      <div className="mb-8 bg-card rounded-lg shadow-sm p-6 transition-all">
        <h2 className="text-xl font-semibold mb-1 text-foreground">{t("theme")}</h2>
        <p className="text-muted-foreground text-sm mb-4">{t("themeDescription")}</p>
        <RadioGroup 
          value={theme} 
          onValueChange={handleThemeChange} 
          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6" 
          disabled={loading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">{t("light")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">{t("dark")}</Label>
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
          {t("deleteAccount")}
        </Button>
        <Button
          variant="default"
          disabled={loading}
          onClick={handleLogout}
          className="w-full sm:w-auto"
        >
          {t("logOut")}
        </Button>
      </div>
      
      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteAccount")}</DialogTitle>
            <DialogDescription>{t("deleteAccountDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
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
                  {t("deleting")}
                </>
              ) : (
                t("deleteAccount")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}