// LoginForm.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockIcon, Phone } from "lucide-react";
import { loginUser } from "@/lib/auth-api";
import { Loader2 } from "lucide-react";

export default function LoginForm({
  formData,
  setFormData,
  setError,
  setSuccessMessage,
  setIsLoading,
  isLoading,
  setOpen,
  resetForm,
  router,
  error,
  successMessage,
  setShowForgotPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);

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

  const validateLogin = () => {
    return formData.phoneNumber.length === 10 && formData.password.length >= 8;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (validateLogin()) {
      handleLogin();
    } else {
      setError("Please complete all required fields correctly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
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
        <Label htmlFor="password" className="text-foreground">Password</Label>
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
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Forgot password?
        </button>
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
        disabled={!validateLogin() || isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 py-5"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}