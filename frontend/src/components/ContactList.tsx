import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import toast, { Toaster } from 'react-hot-toast'; // For notifications

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

interface ContactListProps {
    contactBookId: number;
}

interface ContactCreatedEvent {
    contact: Contact;
}

const useContacts = (contactBookId: number) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        try {
            const { data } = await axios.get<Contact[]>(`${process.env.REACT_APP_API_URL}/api/contact-books/${contactBookId}/contacts`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            });
            setContacts(data);
        } catch {
            setError('Failed to load contacts.');
        } finally {
            setLoading(false);
        }
    }, [contactBookId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return { contacts, setContacts, loading, error, reloadContacts: fetchContacts };
};

const ContactList: React.FC<ContactListProps> = ({ contactBookId }) => {
    const { contacts, setContacts, loading, error } = useContacts(contactBookId);
    const [editingContactId, setEditingContactId] = useState<number | null>(null);
    const [newContact, setNewContact] = useState<{ name: string, email: string, phone: string }>({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const pusher = new Pusher(
            process.env.REACT_APP_PUSHER_APP_KEY || '',
            {
                cluster: process.env.REACT_APP_PUSHER_CLUSTER || '',
                forceTLS: false,
                authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
            }
        );

        const channel = pusher.subscribe(`private-contact-book.${contactBookId}`);

        channel.bind('ContactCreated', (data: ContactCreatedEvent) => {
            toast.success(`Contact "${data.contact.name}" from Contact List Created`);

            // Optimized code: Directly append the new contact to the contacts state
            setContacts(prevContacts => [...prevContacts, data.contact]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [contactBookId, setContacts]);

    const handleCreateOrUpdateContact = useCallback(async () => {
        if (!newContact.name.trim() || !newContact.email.trim() || !newContact.phone.trim()) return;

        const requestConfig = {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        };

        try {
            if (editingContactId !== null) {
                const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/contact-books/${contactBookId}/contacts/${editingContactId}`,
                    newContact, requestConfig);
                setContacts(prevContacts => prevContacts.map(contact =>
                    contact.id === editingContactId ? { ...contact, ...data } : contact
                ));
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/contact-books/${contactBookId}/contacts`,
                    newContact, requestConfig);
                toast(`Contact Creation Started`); // Show a notification when creation starts
            }
            setNewContact({ name: '', email: '', phone: '' });
            setEditingContactId(null);
        } catch (error) {
            console.error(`Failed to ${editingContactId ? 'update' : 'create'} contact.`, error);
        }
    }, [newContact, editingContactId, setContacts, contactBookId]);

    const handleEditContact = (contact: Contact) => {
        setEditingContactId(contact.id);
        setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
    };

    const handleDeleteContact = useCallback(async (id: number) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/contact-books/${contactBookId}/contacts/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            });
            setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
        } catch (error) {
            console.error('Failed to delete contact.', error);
        }
    }, [setContacts, contactBookId]);

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <Toaster /> {/* Add this line to include the toast notifications */}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder={editingContactId ? "Update Contact Name" : "New Contact Name"}
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <input
                    type="email"
                    placeholder="Contact Email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <input
                    type="text"
                    placeholder="Contact Phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <button
                    onClick={handleCreateOrUpdateContact}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {editingContactId ? "Update Contact" : "Create Contact"}
                </button>
            </div>
            {contacts.length === 0 ? (
                <p className="text-gray-500 text-center">No contacts found.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                        <li key={contact.id} className="py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{contact.name}</h2>
                                <p className="text-sm text-gray-500">Email: {contact.email}</p>
                                <p className="text-sm text-gray-500">Phone: {contact.phone}</p>
                                <p className="text-sm text-gray-500">Created: {formatDateTime(contact.created_at)}</p>
                                <p className="text-sm text-gray-500">Updated: {formatDateTime(contact.updated_at)}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditContact(contact)}
                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteContact(contact.id)}
                                    className="text-red-600 hover:text-red-900 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContactList;
