import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateAddress } from '@/lib/address-api';

const EditAddressDialog = ({ open, onOpenChange, address, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("");
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    address_type: ''
  });
  const [errors, setErrors] = useState({});

  const addressTypes = [
    { label: "Home", value: "Home" },
    { label: "Office", value: "Office" },
    { label: "Billing", value: "Billing" },
    { label: "Shipping", value: "Shipping" },
    { label: "Permanent", value: "Permanent" },
    { label: "Temporary", value: "Temporary" },
    { label: "Other", value: "Other" }
  ];

  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zip_code: address.zip_code || '',
        country: address.country || '',
        address_type: address.address_type || ''
      });
      setSelectedAddressType(address.address_type || '');
    }
  }, [address]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zip_code) {
      newErrors.zip_code = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(formData.zip_code)) { // Adjusted to allow 5 or 6 digits
      newErrors.zip_code = 'Please enter a valid 5-6 digit ZIP code';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const data = {
        ...formData,
        address_type: selectedAddressType
      };
      
      const response = await updateAddress(address.id, data);
      console.log('Edit Address Response:', response);

      if (response?.status === true) {
        toast.success("Success", {
          description: response.message || "Address updated successfully",
        });
        resetForm();
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response?.message || 'Address update failed');
      }
    } catch (error) {
      console.error('Edit Address Error:', error);
      toast.error("Error updating address", {
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      address_type: ''
    });
    setSelectedAddressType("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[75vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="address_type">Address Type</Label>
                <Select 
                  onValueChange={(value) => setSelectedAddressType(value)}
                  value={selectedAddressType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    {addressTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  className="w-full"
                />
                {errors.street && <p className="text-destructive text-sm">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full"
                  />
                  {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="w-full"
                  />
                  {errors.state && <p className="text-destructive text-sm">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    className="w-full"
                  />
                  {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                    className="w-full"
                  />
                  {errors.zip_code && <p className="text-destructive text-sm">{errors.zip_code}</p>}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-32 bg-popover border-foreground"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-32"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressDialog;