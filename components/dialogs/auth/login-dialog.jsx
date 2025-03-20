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
import { PhoneIcon, LockIcon, Eye, EyeOff } from "lucide-react";

// The component accepts children which will be used as the trigger
export default function LoginDialog({ children }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ phoneNumber, password, rememberMe });
    // Add your authentication logic here
    // On successful login, you might want to:
    setOpen(false);
  };

  const handlePhoneNumberChange = (e) => {
    // Only allow numbers and format phone number
    const value = e.target.value.replace(/\D/g, "");
    
    // Format: (XXX) XXX-XXXX
    let formattedValue = value;
    if (value.length > 3 && value.length <= 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
    
    setPhoneNumber(formattedValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-primary/20 bg-black/25 backdrop-blur-lg text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary/80">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Log in to access your Uttaradhikari account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                placeholder="(XXX) XXX-XXXX"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                required
                maxLength={14}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={setRememberMe} 
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-white/80 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 py-5"
            >
              Login
            </Button>
          </DialogFooter>
          
          <div className="text-center pt-2">
            <p className="text-white/70 text-sm">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}