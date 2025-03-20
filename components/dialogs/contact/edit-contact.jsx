// @/components/dialogs/contact/edit-contact.jsx
import React, { useState, useEffect } from 'react';
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
import { updateContact } from '@/lib/auth-api';

const EditContactDialog = ({ open, onOpenChange, contact, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactType, setContactType] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      const isEmail = !!contact.email;
      setContactType(isEmail ? 'email' : 'phone');
      setValue(isEmail ? contact.email : contact.phone_number);
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};
    if (contactType === 'email') {
      if (!value.trim()) {
        newErrors.value = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        newErrors.value = 'Invalid email format';
      }
    } else {
      if (!value.trim()) {
        newErrors.value = 'Phone number is required';
      } else if (!/^\d{10}$/.test(value.trim())) {
        newErrors.value = 'Phone number must be exactly 10 digits';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !contact) return;

    try {
      setIsSubmitting(true);
      const payload = contactType === 'email' 
        ? { email: value.trim() }
        : { phone_number: value.trim() };
        
      const response = await updateContact(contact.id, payload);
      
      if (response.status === true) {
        toast.success(response.message || "Contact updated successfully", {
          richColors: true,
        });
        onSuccess();
      } else {
        throw new Error(response.message || 'Failed to update contact');
      }
    } catch (error) {
      console.error('Edit Contact Error:', error);
      toast.error(error.message || 'Failed to update contact', {
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setValue('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Toaster richColors />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit {contactType === 'email' ? 'Email' : 'Phone Number'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value">{contactType === 'email' ? 'Email' : 'Phone Number'}</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(contactType === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value)}
                placeholder={`Enter ${contactType === 'email' ? 'email' : '10-digit phone number'}`}
                maxLength={contactType === 'phone' ? 10 : undefined}
                type={contactType === 'email' ? 'email' : 'text'}
              />
              {errors.value && (
                <p className="text-destructive text-sm">{errors.value}</p>
              )}
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;