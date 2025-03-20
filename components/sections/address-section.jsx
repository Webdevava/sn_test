// pages/addresses.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { 
  getAddressList,
  createAddress,
  getAddressDetail,
  updateAddress,
  deleteAddress
} from '@/lib/address-api';
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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";

// Add Address Dialog Component
const AddAddressDialog = ({ open, onOpenChange, onSuccess }) => {
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zip_code) {
      newErrors.zip_code = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(formData.zip_code)) {
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
        street: formData.street,  // Map to API expected fields
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        address_type: selectedAddressType
      };
      
      const response = await createAddress(data);
      // Assuming the API returns the created address object on success
      toast.success("Address added successfully");
      resetForm();
      onSuccess(response);  // Pass the new address to parent
      onOpenChange(false);
    } catch (error) {
      console.error('Add Address Error:', error);
      toast.error("Error adding address", {
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
          <DialogTitle>Add New Address</DialogTitle>
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

              {selectedAddressType && (
                <>
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
                </>
              )}
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
              disabled={!selectedAddressType || isSubmitting}
              className="w-32"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Address Dialog Component
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
    } else if (!/^\d{5,6}$/.test(formData.zip_code)) {
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
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        address_type: selectedAddressType
      };
      
      const response = await updateAddress(address.id, data);
      toast.success("Address updated successfully");
      resetForm();
      onSuccess(response);
      onOpenChange(false);
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

// Main Addresses Page Component
export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response =await getAddressList();
      setAddresses(response || []);
    } catch (err) {
      console.error('Fetch addresses error:', err);
      toast.error(err.message || "Failed to fetch addresses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleEdit = (address) => {
    setSelectedAddress({
      id: address.id,
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      address_type: address.address_type
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (addressId) => {
    try {
      setIsDeleting(addressId);
      await deleteAddress(addressId);
      setAddresses(prev => prev.filter(address => address.id !== addressId));
      toast.success("Address deleted successfully");
    } catch (err) {
      console.error('Delete address error:', err);
      toast.error(err.message || "Failed to delete address");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddSuccess = (newAddress) => {
    setAddresses(prev => [...prev, {
      id: newAddress.id,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zip_code: newAddress.zip_code,
      country: newAddress.country,
      address_type: newAddress.address_type
    }]);
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = (updatedAddress) => {
    setAddresses(prev => prev.map(address => 
      address.id === updatedAddress.id ? {
        id: updatedAddress.id,
        street: updatedAddress.street,
        city: updatedAddress.city,
        state: updatedAddress.state,
        zip_code: updatedAddress.zip_code,
        country: updatedAddress.country,
        address_type: updatedAddress.address_type
      } : address
    ));
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="bg-muted rounded-lg w-80 h-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 max-w-3xl flex flex-col justify-between h-full relative">
      <div className="space-y-2">
        {addresses.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0 p-3">
              <CardTitle className="text-sm font-bold">Addresses</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 overflow-auto max-h-44">
              <ul className="space-y-2">
                {addresses.map((address, index) => (
                  <li 
                    key={address.id} 
                    className="flex items-center justify-between border-b last:border-b-0 group"
                  >
                    <div className="flex items-center">
                      <span className="font-semibold mr-3">{index + 1}.</span>
                      <div>
                        <span className="text-primary">{address.street}</span>
                        {address.address_type && (
                          <span className="text-xs text-gray-500 ml-2">({address.address_type})</span>
                        )}
                        <div className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zip_code}, {address.country}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(address.id)}
                        disabled={isDeleting === address.id}
                      >
                        {isDeleting === address.id ? (
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="w-full absolute left-0 bottom-0 mb-2"
      >
        <CirclePlus className="mr-2 h-4 w-4" />
        Add Another Address
      </Button>

      <AddAddressDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
      <EditAddressDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        address={selectedAddress}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}