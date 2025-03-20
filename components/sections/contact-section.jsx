// pages/contacts.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  addContact, 
  listContacts, 
  updateContact, 
  deleteContact, 
  getContactDetail 
} from '@/lib/auth-api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CirclePlus, Pencil, Trash2, Phone, Mail } from "lucide-react";

export default function ContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [emailContacts, setEmailContacts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [contactType, setContactType] = useState("email");
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listContacts();
      if (response.status) {
        const allContacts = response.data || [];
        setContacts(allContacts);
        setPhoneContacts(allContacts.filter(contact => contact.phone_number));
        setEmailContacts(allContacts.filter(contact => contact.email));
      } else {
        throw new Error("Failed to fetch contacts");
      }
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Fetch contacts error:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch contacts",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactTypeChange = (value) => {
    setContactType(value);
    setFormData({
      email: '',
      phoneNumber: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let payload = {};
    if (contactType === "email") {
      if (!formData.email) {
        setError('Please provide an email address');
        return;
      }
      payload = { email: formData.email };
    } else {
      if (!formData.phoneNumber) {
        setError('Please provide a phone number');
        return;
      }
      payload = { phoneNumber: formData.phoneNumber };
    }

    try {
      setIsLoading(true);
      if (isEditMode) {
        await updateContact(currentContactId, payload);
        toast({
          title: "Success",
          description: "Contact updated successfully",
        });
      } else {
        await addContact(payload);
        toast({
          title: "Success",
          description: "Contact added successfully",
        });
      }
      await fetchContacts();
      handleClose();
    } catch (err) {
      setError('Failed to save contact');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save contact",
      });
      console.error('Save contact error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (contactId) => {
    try {
      setIsLoading(true);
      setError('');
      
      const contactToEdit = contacts.find(c => c.id === contactId);
      
      if (contactToEdit) {
        if (contactToEdit.email) {
          setContactType("email");
          setFormData({
            email: contactToEdit.email || '',
            phoneNumber: ''
          });
        } else if (contactToEdit.phone_number) {
          setContactType("phone");
          setFormData({
            email: '',
            phoneNumber: contactToEdit.phone_number || ''
          });
        }
        
        setCurrentContactId(contactId);
        setIsEditMode(true);
        setIsDialogOpen(true);
      }
    } catch (err) {
      setError('Failed to load contact details');
      console.error('Edit contact error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      setIsDeleting(contactId);
      const response = await deleteContact(contactId);
      
      if (response.status) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        setPhoneContacts(prev => prev.filter(contact => contact.id !== contactId));
        setEmailContacts(prev => prev.filter(contact => contact.id !== contactId));
        toast({
          title: "Success",
          description: "Contact deleted successfully",
        });
      } else {
        throw new Error("Failed to delete contact");
      }
    } catch (err) {
      console.error('Delete contact error:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete contact",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentContactId(null);
    setFormData({ email: '', phoneNumber: '' });
    setContactType("email");
    setError('');
  };

  if (isLoading && contacts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-muted rounded-lg w-80 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 max-w-3xl flex flex-col justify-between h-full relative">
      <div className="space-y-2">
        {/* Phone Numbers Card */}
        {phoneContacts.length > 0 && (
          <Card className="mb-2">
            <CardHeader className="flex flex-row items-center justify-between pb-0 p-3">
              <CardTitle className="text-sm font-bold">Phone Numbers</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 overflow-auto max-h-44">
              <ul className="space-y-2">
                {phoneContacts.map((contact, index) => (
                  <li 
                    key={contact.id} 
                    className="flex items-center justify-between border-b last:border-b-0 group"
                  >
                    <div className="flex items-center">
                      <span className="font-semibold mr-3">{index + 1}.</span>
                      <span className="text-primary">{contact.phone_number}</span>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(contact.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(contact.id)}
                        disabled={isDeleting === contact.id}
                      >
                        {isDeleting === contact.id ? (
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

        {/* Email Card */}
        {emailContacts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0 p-3">
              <CardTitle className="text-sm font-bold">Email</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 overflow-auto max-h-44">
              <ul className="space-y-2">
                {emailContacts.map((contact, index) => (
                  <li 
                    key={contact.id} 
                    className="flex items-center justify-between border-b last:border-b-0 group"
                  >
                    <div className="flex items-center">
                      <span className="font-semibold mr-3">{index + 1}.</span>
                      <span className="text-primary">{contact.email}</span>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(contact.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(contact.id)}
                        disabled={isDeleting === contact.id}
                      >
                        {isDeleting === contact.id ? (
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
        onClick={() => setIsDialogOpen(true)}
        className="w-full absolute left-0 bottom-0 mb-2"
      >
        <CirclePlus className="mr-2 h-4 w-4" />
        Add Another Contact
      </Button>

      {/* Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={open => {
        if (!open) handleClose();
        else setIsDialogOpen(true);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactType">Contact Type</Label>
              <Select 
                onValueChange={handleContactTypeChange} 
                value={contactType}
                disabled={isEditMode}
              >
                <SelectTrigger id="contactType">
                  <SelectValue placeholder="Select contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {contactType === "email" && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {contactType === "phone" && (
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+1234567890"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}