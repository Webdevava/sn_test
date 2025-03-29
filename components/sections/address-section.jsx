'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { 
  getAddressList,
  createAddress,
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
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  CirclePlus, 
  Pencil, 
  Trash2, 
  Home, 
  Briefcase, 
  Package, 
  MapPin, 
  Loader2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        address_type: selectedAddressType
      };
      
      const response = await createAddress(data);
      toast.success("Address added successfully");
      resetForm();
      onSuccess(response);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                />
                {errors.street && <p className="text-destructive text-sm">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                  />
                  {errors.state && <p className="text-destructive text-sm">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                  />
                  {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zip_code && <p className="text-destructive text-sm">{errors.zip_code}</p>}
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedAddressType || isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Enter street address"
            />
            {errors.street && <p className="text-destructive text-sm">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
              {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
              {errors.state && <p className="text-destructive text-sm">{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
              />
              {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
              />
              {errors.zip_code && <p className="text-destructive text-sm">{errors.zip_code}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function AddressesPage({ maxHeight = "500px" }) {
  const [addresses, setAddresses] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAddressList();
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
    setAddresses(prev => [...prev, newAddress]);
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = (updatedAddress) => {
    setAddresses(prev => prev.map(address => 
      address.id === updatedAddress.id ? updatedAddress : address
    ));
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
  };

  // Address type specific styling and icons
  const getAddressStyle = (type) => {
    switch (type) {
      case "Home":
        return { icon: <Home className="h-4 w-4" />, border: "border-l-green-500" };
      case "Office":
        return { icon: <Briefcase className="h-4 w-4" />, border: "border-l-blue-500" };
      case "Shipping":
        return { icon: <Package className="h-4 w-4" />, border: "border-l-purple-500" };
      case "Billing":
        return { icon: <MapPin className="h-4 w-4" />, border: "border-l-yellow-500" };
      case "Permanent":
        return { icon: <Home className="h-4 w-4" />, border: "border-l-teal-500" };
      case "Temporary":
        return { icon: <MapPin className="h-4 w-4" />, border: "border-l-orange-500" };
      case "Other":
        return { icon: <MapPin className="h-4 w-4" />, border: "border-l-gray-500" };
      default:
        return { icon: <MapPin className="h-4 w-4" />, border: "border-l-gray-500" };
    }
  };

  if (isLoading && addresses.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm max-h-96 flex flex-col">
      <div className="overflow-auto" style={{ maxHeight }}>
        <CardContent className="pt-4">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No addresses yet</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Add your first address by clicking the button below
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => {
                const { icon, border } = getAddressStyle(address.address_type);
                return (
                  <Card key={address.id} className={`overflow-hidden border-l-4 ${border}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {icon}
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {address.address_type}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              <span className="text-primary">{address.street}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.zip_code}, {address.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
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
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="border-t p-4 mt-auto">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Another Address
        </Button>
      </CardFooter>

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
    </Card>
  );
}                                         