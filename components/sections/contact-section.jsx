// components/ContactsCard.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  addContact, 
  listContacts, 
  updateContact, 
  deleteContact
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
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { CirclePlus, Pencil, Trash2, Phone, Mail, Loader2 } from "lucide-react";

export default function ContactsCard({ maxHeight = "500px" }) {
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
      <Card className="w-full shadow-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm max-h-96 flex flex-col">
      {/* <CardHeader className="pb-2">
        <CardTitle className="text-lg">Contact Information</CardTitle>
        <CardDescription>Manage your contact details</CardDescription>
      </CardHeader> */}
      
      {/* Scrollable content area */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <CardContent className="pt-4">
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Phone className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No contacts yet</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Add your first contact by clicking the button below
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Phone Numbers Section */}
              {phoneContacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Phone Numbers</h3>
                  </div>
                  <ul className="divide-y">
                    {phoneContacts.map((contact, index) => (
                      <li 
                        key={contact.id} 
                        className="py-2 flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <span className="text-primary font-medium break-all">{contact.phone_number}</span>
                        </div>
                        <div className="flex space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Email Section */}
              {emailContacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Email Addresses</h3>
                  </div>
                  <ul className="divide-y">
                    {emailContacts.map((contact, index) => (
                      <li 
                        key={contact.id} 
                        className="py-2 flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <span className="text-primary font-medium break-all">{contact.email}</span>
                        </div>
                        <div className="flex space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>
      
      {/* Fixed footer with add button */}
      <CardFooter className="border-t p-4 mt-auto">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Another Contact
        </Button>
      </CardFooter>

      {/* Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={open => {
        if (!open) handleClose();
        else setIsDialogOpen(true);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{isEditMode ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
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
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>Phone Number</span>
                    </div>
                  </SelectItem>
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
                  className="w-full"
                  autoComplete="email"
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
                  className="w-full"
                  autoComplete="tel"
                />
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
                {error}
              </div>
            )}

            <DialogFooter className="sm:justify-end">
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditMode ? 'Update' : 'Add'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}