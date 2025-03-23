"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyOtp, resendOtp } from "@/lib/auth-api";
import { Loader2 } from "lucide-react";

export default function OtpVerificationForm({
  formData,
  setFormData,
  setError,
  setSuccessMessage,
  setIsLoading,
  isLoading,
  setOpen,
  resetForm,
  setIsVerifyingOtp,
  setCurrentStep,
  router,
  error,
  successMessage
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setFormData({ ...formData, [name]: numericValue });
    setError(null);
  };
  

  const validateOtp = () => {
    return formData.otp.length === 6;
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await verifyOtp(formData.otp);
      if (response.status) {
        setSuccessMessage("OTP verified! Account created successfully!");
        setTimeout(() => {
          setOpen(false);
          resetForm();
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(response.message || "Invalid OTP.");
      }
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
      if (error.message === "Signup token not found. Please sign up again.") {
        setIsVerifyingOtp(false);
        setCurrentStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await resendOtp();
      if (response.status) {
        setSuccessMessage("New OTP sent to your phone!");
      } else {
        setError(response.message || "Failed to resend OTP.");
      }
    } catch (error) {
      setError(error.message || "Failed to resend OTP. Try again.");
      if (error.message === "Signup token not found. Please sign up again.") {
        setIsVerifyingOtp(false);
        setCurrentStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (validateOtp()) {
      handleVerifyOtp();
    } else {
      setError("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-foreground">OTP</Label>
        <Input
          id="otp"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={formData.otp}
          onChange={handleChange}
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
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  );
}