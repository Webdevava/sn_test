// pages/contacts.js
'use client';

import { useState, useEffect } from 'react';
import { 
  addContact, 
  listContacts, 
  updateContact, 
  deleteContact, 
  getContactDetail 
} from '@/lib/auth-api';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await listContacts();
      if (response.status) {
        setContacts(response.data);
      }
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate that only one field is filled
    if (formData.email && formData.phoneNumber) {
      setError('Please provide either email or phone number, not both');
      return;
    }

    if (!formData.email && !formData.phoneNumber) {
      setError('Please provide either an email or phone number');
      return;
    }

    try {
      setLoading(true);
      const payload = formData.email 
        ? { email: formData.email }
        : { phoneNumber: formData.phoneNumber };

      if (isEditMode) {
        await updateContact(currentContactId, payload);
      } else {
        await addContact(payload);
      }
      
      await fetchContacts();
      handleClose();
    } catch (err) {
      setError('Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (contactId) => {
    try {
      const response = await getContactDetail(contactId);
      if (response.status) {
        setFormData({
          email: response.data.email || '',
          phoneNumber: response.data.phone_number || ''
        });
        setCurrentContactId(contactId);
        setIsEditMode(true);
        setIsDialogOpen(true);
      }
    } catch (err) {
      setError('Failed to load contact details');
    }
  };

  const handleDelete = async (contactId) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        await deleteContact(contactId);
        await fetchContacts();
      } catch (err) {
        setError('Failed to delete contact');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentContactId(null);
    setFormData({ email: '', phoneNumber: '' });
    setError('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      
      {/* Add Contact Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Add Contact
      </button>

      {/* Contacts List */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {contacts.map(contact => (
          <li 
            key={contact.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {contact.email || contact.phone_number}
            </span>
            <div>
              <button
                onClick={() => handleEdit(contact.id)}
                className="text-blue-500 mr-2 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Edit Contact' : 'Add Contact'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  disabled={formData.phoneNumber !== ''}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  disabled={formData.email !== ''}
                />
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}