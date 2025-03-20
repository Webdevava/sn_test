"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Eye, EyeOff, Mail, User, Phone, Shield, LockIcon } from "lucide-react";
import { signupUser, loginUser, verifyOtp, resendOtp } from "@/lib/auth-api";
import { Loader2 } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [authType, setAuthType] = useState(initialType);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("signup_token");
    if (token && authType === "signup") {
      setIsVerifyingOtp(true);
    }
  }, [authType]);

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
    if (authType === "signup") {
      Cookies.remove("signup_token", { path: "/" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === "otp") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError(null);
  };

  const validateLogin = () => {
    return formData.phoneNumber.length === 10 && formData.password.length >= 8;
  };

  const validateSignUpStep1 = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.phoneNumber.length === 10 &&
      formData.email.includes("@")
    );
  };

  const validateSignUpStep2 = () => {
    return (
      formData.password.length >= 8 &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.dob &&
      acceptTerms
    );
  };

  const validateOtp = () => {
    return formData.otp.length === 6;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateSignUpStep1()) {
      setCurrentStep(2);
    } else if (!validateSignUpStep1()) {
      setError("Please fill all fields correctly.");
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };


const handleLogin = async () => {
  setIsLoading(true);
  try {
    const response = await loginUser(formData.phoneNumber, formData.password);

    if (response.status) {
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        setOpen(false);
        resetForm();
        router.push("/dashboard");
      }, 1500);
    } else {
      setError(response.message || "Login failed.");
    }
  } catch (error) {
    setError(error.message || "Login failed. Please check your credentials.");
  } finally {
    setIsLoading(false);
  }
};

const handleSignup = async () => {
  setIsLoading(true);
  try {
    const formattedDob = formData.dob
      ? format(new Date(formData.dob), "yyyy-MM-dd")
      : null;
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      mobile: formData.phoneNumber,
      email: formData.email,
      dob: formattedDob,
      password: formData.password,
    };
    const response = await signupUser(userData);

    if (response.status) {
      setIsVerifyingOtp(true);
      setSuccessMessage("Signup successful! Please verify your OTP.");
    } else {
      setError(response.message || "Signup failed.");
    }
  } catch (error) {
    setError(error.message || "Signup failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
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

    if (authType === "login" && validateLogin()) {
      handleLogin();
    } else if (
      authType === "signup" &&
      !isVerifyingOtp &&
      currentStep === 2 &&
      validateSignUpStep2()
    ) {
      handleSignup();
    } else if (authType === "signup" && isVerifyingOtp && validateOtp()) {
      handleVerifyOtp();
    } else {
      setError("Please complete all required fields correctly.");
    }
  };

  const switchAuthType = (newType) => {
    setAuthType(newType);
    resetForm();
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordStrong = formData.password.length >= 8;

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
            {authType === "login" ? "Welcome Back" : "Create Your Account"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            {authType === "login" ? (
              <div className="text-center">
                <p>Glad to see you again</p>
                <p>Login to your account below</p>
              </div>
            ) : isVerifyingOtp ? (
              "Enter the 6-digit OTP sent to your phone."
            ) : (
              "Fill in your details to get started."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {authType === "login" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    name="phoneNumber"
                    placeholder="Enter 10-digit number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </>
          ) : isVerifyingOtp ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground">
                  OTP
                </Label>
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
            </div>
          ) : currentStep === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter 10-digit number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div
                    className={`text-xs ${
                      passwordStrong ? "text-green-500" : "text-orange-500"
                    }`}
                  >
                    {passwordStrong
                      ? "Password strength: Good"
                      : "Password must be at least 8 characters"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary ${
                      formData.confirmPassword && !passwordsMatch
                        ? "border-destructive"
                        : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <div className="text-xs text-destructive">
                    Passwords do not match
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-foreground">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm leading-snug text-muted-foreground"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 font-medium underline transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 font-medium underline transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="">
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md animate-in fade-in">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded-md animate-in fade-in">
                {successMessage}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
            {authType === "login" ? (
              <Button
                type="submit"
                disabled={!validateLogin() || isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            ) : isVerifyingOtp ? (
              <Button
                type="submit"
                disabled={!validateOtp() || isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            ) : currentStep === 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!validateSignUpStep1() || isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
              >
                Continue
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="sm:flex-1 bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 py-5"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!validateSignUpStep2() || isLoading}
                  className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            )}
          </DialogFooter>

          <div className="text-center pt-2">
            <p className="text-muted-foreground text-sm">
              {authType === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() =>
                  switchAuthType(authType === "login" ? "signup" : "login")
                }
                className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                disabled={isVerifyingOtp || isLoading}
              >
                {authType === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}