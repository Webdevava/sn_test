"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpVerificationForm from "./OtpVerificationForm";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

export default function AuthDialog({ children, type: initialType = "login" }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    dob: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [authType, setAuthType] = useState(initialType);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      dob: "",
    });
    setAcceptTerms(false);
    setCurrentStep(1);
    setIsVerifyingOtp(false);
    setError(null);
    setSuccessMessage(null);
    setIsLoading(false);
    setShowForgotPassword(false);
    // Only remove signup_token if authType is no longer "signup" or after verification
    if (authType !== "signup") {
      Cookies.remove("signup_token", { path: "/" });
    }
  };

  const switchAuthType = (newType) => {
    setAuthType(newType);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg border border-primary/20 bg-popover text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary/80 text-center">
            {authType === "login" && !showForgotPassword
              ? "Welcome Back"
              : showForgotPassword
              ? "Reset Your Password"
              : "Create Your Account"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            {authType === "login" && !showForgotPassword ? (
              <div className="text-center">
                <p>Glad to see you again</p>
                <p>Login to your account below</p>
              </div>
            ) : showForgotPassword ? (
              "Follow the steps to reset your password."
            ) : isVerifyingOtp ? (
              "Enter the 6-digit OTP sent to your phone."
            ) : (
              "Fill in your details to get started."
            )}
          </DialogDescription>
        </DialogHeader>

        {showForgotPassword ? (
          <ForgotPasswordDialog
            setError={setError}
            setSuccessMessage={setSuccessMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setOpen={setOpen}
            resetForm={resetForm}
            router={router}
            error={error}
            successMessage={successMessage}
          />
        ) : authType === "login" ? (
          <LoginForm
            formData={formData}
            setFormData={setFormData}
            setError={setError}
            setSuccessMessage={setSuccessMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setOpen={setOpen}
            resetForm={resetForm}
            router={router}
            error={error}
            successMessage={successMessage}
            setShowForgotPassword={setShowForgotPassword}
          />
        ) : isVerifyingOtp ? (
          <OtpVerificationForm
            formData={formData}
            setFormData={setFormData}
            setError={setError}
            setSuccessMessage={setSuccessMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setOpen={setOpen}
            resetForm={resetForm}
            setIsVerifyingOtp={setIsVerifyingOtp}
            setCurrentStep={setCurrentStep}
            router={router}
            error={error}
            successMessage={successMessage}
          />
        ) : (
          <SignupForm
            formData={formData}
            setFormData={setFormData}
            acceptTerms={acceptTerms}
            setAcceptTerms={setAcceptTerms}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setError={setError}
            setSuccessMessage={setSuccessMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setIsVerifyingOtp={setIsVerifyingOtp}
            error={error}
            successMessage={successMessage}
          />
        )}

        {!showForgotPassword && (
          <div className="text-center pt-2">
            <p className="text-muted-foreground text-sm">
              {authType === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => switchAuthType(authType === "login" ? "signup" : "login")}
                className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                disabled={isVerifyingOtp || isLoading}
              >
                {authType === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}