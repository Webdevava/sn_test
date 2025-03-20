// @/components/dialogs/contact/add-contact.jsx
import React, { useState } from 'react';
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail } from "lucide-react";
import { addContact } from '@/lib/auth-api';

const AddContactDialog = ({ open, onOpenChange, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactType, setContactType] = useState('phone');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (contactType === "email") {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Invalid email format';
      }
    } else {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
        newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = contactType === "email" 
        ? { email: email.trim() }
        : { phone_number: phoneNumber.trim() };

      const response = await addContact(payload);
      
      if (response.status === true) {
        toast.success(response.message || "Contact added successfully", {
          richColors: true,
        });
        resetForm();
        onSuccess();
      } else {
        throw new Error(response.message || 'Failed to add contact');
      }
    } catch (error) {
      console.error('Add Contact Error:', error);
      toast.error(error.message || 'Failed to add contact', {
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPhoneNumber('');
    setContactType('phone');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Toaster richColors />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact_type">Contact Type</Label>
              <Select
                value={contactType}
                onValueChange={(value) => {
                  setContactType(value);
                  setEmail('');
                  setPhoneNumber('');
                  setErrors({});
                }}
              >
                <SelectTrigger id="contact_type">
                  <SelectValue placeholder="Select contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {contactType === "phone" ? (
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  type="text"
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm">{errors.phoneNumber}</p>
                )}
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  type="email"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;