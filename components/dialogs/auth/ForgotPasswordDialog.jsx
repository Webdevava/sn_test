"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockIcon, Phone, Shield } from "lucide-react";
import { forgetPassword, validateForgetPasswordOtp, resetPassword, resendForgetPasswordOtp } from "@/lib/auth-api";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordDialog({
  setError,
  setSuccessMessage,
  setIsLoading,
  isLoading,
  setOpen,
  resetForm,
  router,
  error,
  successMessage,
}) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(""); // Store the token from forgetPassword
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(numericValue);
    setError(null);
  };

  const handleOtpChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
    setError(null);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const validatePhone = () => phoneNumber.length === 10;
  const validateOtp = () => otp.length === 6;
  const validatePasswords = () => newPassword.length >= 8 && newPassword === confirmPassword;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validatePhone()) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await forgetPassword(phoneNumber);
      if (response.status) {
        setToken(response.data.token); // Store the token from the response
        setSuccessMessage(response.message || "OTP sent to your phone!");
        setStep(2);
      } else {
        setError(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await validateForgetPasswordOtp(otp, token); // Use the stored token
      if (response.status) {
        setSuccessMessage(response.message || "OTP verified successfully!");
        setStep(3); // Token is already stored, move to reset password step
      } else {
        setError(response.message || "Invalid OTP.");
      }
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await resendForgetPasswordOtp(token); // Use the stored token
      if (response.status) {
        setSuccessMessage(response.message || "New OTP sent to your phone!");
      } else {
        setError(response.message || "Failed to resend OTP.");
      }
    } catch (error) {
      setError(error.message || "Failed to resend OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      setError("Passwords must be at least 8 characters and match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPassword(token, newPassword); // Use the stored token
      if (response.status) {
        setSuccessMessage(response.message || "Password reset successful! Redirecting to login...");
        setTimeout(() => {
          setOpen(false);
          resetForm();
          router.push("/"); // Or wherever you want to redirect after reset
        }, 1500);
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit number"
                className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                required
                maxLength={10}
              />
            </div>
          </div>
          <div>
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md animate-in fade-in">{error}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded-md animate-in fade-in">{successMessage}</div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!validatePhone() || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleValidateOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-foreground">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              required
              maxLength={6}
            />
          </div>
          <Button
            type="button"
            onClick={handleResendOtp}
            variant="link"
            className="w-full text-primary hover:text-primary/80"
            disabled={isLoading}
          >
            {isLoading ? "Resending..." : "Resend OTP"}
          </Button>
          <div>
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md animate-in fade-in">{error}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded-md animate-in fade-in">{successMessage}</div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!validateOtp() || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? "Validating..." : "Validate OTP"}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                className={`pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary ${
                  confirmPassword && newPassword !== confirmPassword ? "border-destructive" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <div className="text-xs text-destructive">Passwords do not match</div>
            )}
          </div>
          <div>
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md animate-in fade-in">{error}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded-md animate-in fade-in">{successMessage}</div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!validatePasswords() || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}