"use client";

import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Eye, EyeOff, Mail, User, Phone, Shield } from "lucide-react";

// The component accepts children which will be used as the trigger
export default function SignUpDialog({ children }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [dob, setDob] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      // Only allow numbers and format phone number
      const numericValue = value.replace(/\D/g, "");
      
      // Format: (XXX) XXX-XXXX
      let formattedValue = numericValue;
      if (numericValue.length > 3 && numericValue.length <= 6) {
        formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
      } else if (numericValue.length > 6) {
        formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
      }
      
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.phoneNumber && formData.email;
  };

  const validateStep2 = () => {
    return (
      formData.password && 
      formData.confirmPassword && 
      formData.password === formData.confirmPassword && 
      dob && 
      acceptTerms
    );
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      console.log({ ...formData, dob, acceptTerms });
      // Add your registration logic here
      // On successful registration, you might want to:
      setOpen(false);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setDob(null);
      setAcceptTerms(false);
      setCurrentStep(1);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordStrong = formData.password.length >= 8;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg border border-primary/20 bg-black/25 backdrop-blur-lg text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary/80">
            Create Your Account
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {currentStep === 1 
              ? "Enter your details to get started with Uttaradhikari" 
              : "Just a few more details to secure your account"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {currentStep === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                    required
                    maxLength={14}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary ${
                      formData.confirmPassword && !passwordsMatch ? "border-red-500" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <div className="text-xs text-red-500">Passwords do not match</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-white">
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !dob ? "text-gray-500" : "text-white"
                      } pl-10 bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:text-white focus-visible:ring-primary`}
                    >
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      {dob ? format(dob, "PPP") : "Select your date of birth"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      initialFocus
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
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
                    className="text-sm leading-snug text-white/80"
                  >
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

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-6">
            {currentStep === 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!validateStep1()}
                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-5"
              >
                Continue
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <Button 
                  type="button" 
                  onClick={prevStep}
                  variant="outline"
                  className="sm:flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 transition-all duration-200 py-5"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={!validateStep2()}
                  className="sm:flex-1 bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-5"
                >
                  Create Account
                </Button>
              </div>
            )}
          </DialogFooter>
          
          <div className="text-center pt-2">
            <p className="text-white/70 text-sm">
              Already have an account?{" "}
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Log in
              </a>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}