"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, User, Phone, Shield } from "lucide-react";
import { signupUser } from "@/lib/auth-api";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function SignupForm({
  formData,
  setFormData,
  acceptTerms,
  setAcceptTerms,
  currentStep,
  setCurrentStep,
  setError,
  setSuccessMessage,
  setIsLoading,
  isLoading,
  setIsVerifyingOtp,
  error,
  successMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError(null);
  };

  const validateSignUpStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.firstName &&
      formData.lastName &&
      formData.phoneNumber.length === 10 &&
      formData.email &&
      emailRegex.test(formData.email)
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

  const nextStep = () => {
    if (currentStep === 1 && validateSignUpStep1()) {
      setCurrentStep(2);
    } else {
      setError("Please fill all fields correctly.");
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const formattedDob = formData.dob ? format(new Date(formData.dob), "yyyy-MM-dd") : null;
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
        console.log("Signup token after signup:", Cookies.get("signup_token"));
        setIsVerifyingOtp(true);
        setSuccessMessage("Signup successful! Please verify your OTP.");
      } else {
        setError(response.message || "Signup failed.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && 
          error.response.data && error.response.data.detail === "Mobile already registered") {
        setError("Mobile number already registered. Please use a different number.");
      } else {
        setError(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (currentStep === 2 && validateSignUpStep2()) {
      handleSignup();
    } else {
      setError("Please complete all required fields correctly.");
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordStrong = formData.password.length >= 8;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {currentStep === 1 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground">First Name</Label>
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
              <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
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
            <Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
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
            <Label htmlFor="email" className="text-foreground">Email Address</Label>
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
            <Label htmlFor="password" className="text-foreground">Password</Label>
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.password && (
              <div className={`text-xs ${passwordStrong ? "text-green-500" : "text-orange-500"}`}>
                {passwordStrong ? "Password strength: Good" : "Password must be at least 8 characters"}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
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
                  formData.confirmPassword && !passwordsMatch ? "border-destructive" : ""
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
            {formData.confirmPassword && !passwordsMatch && (
              <div className="text-xs text-destructive">Passwords do not match</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-foreground">Date of Birth</Label>
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
              <label htmlFor="terms" className="text-sm leading-snug text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-primary/80 font-medium underline transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-primary/80 font-medium underline transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
        </>
      )}

      <div>
        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md animate-in fade-in">{error}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded-md animate-in fade-in">{successMessage}</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
        {currentStep === 1 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!validateSignUpStep1() || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
          >
            Continue
          </Button>
        ) : (
          <>
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
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}