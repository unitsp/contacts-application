import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import toast, { Toaster } from 'react-hot-toast';

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

interface NewContact {
    name: string;
    email: string;
    phone: string;
}

const useContacts = (contactBookId: number, token: string | null) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        if (!token) {
            setError('Authorization token not available.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get<Contact[]>(`${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(data);
        } catch {
            setError('Failed to load contacts.');
        } finally {
            setLoading(false);
        }
    }, [contactBookId, token]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return { contacts, setContacts, loading, error };
};

const ContactList: React.FC<ContactListProps> = ({ contactBookId }) => {
    const token = useMemo(() => localStorage.getItem('auth_token'), []);
    const { contacts, setContacts, loading, error } = useContacts(contactBookId, token);
    const [editingContactId, setEditingContactId] = useState<number | null>(null);
    const [newContact, setNewContact] = useState<NewContact>({ name: '', email: '', phone: '' });

    useEffect(() => {
        if (!token) return;
        console.log(token, 'token')
        console.log(contactBookId, 'contactBookId')
        console.log(
            process.env.REACT_APP_PUSHER_APP_KEY,
            process.env.REACT_APP_PUSHER_CLUSTER,
            process.env.REACT_APP_API_URL
        );
        const pusher = new Pusher(
            process.env.REACT_APP_PUSHER_APP_KEY || '',
            {
                cluster: process.env.REACT_APP_PUSHER_CLUSTER || '',
                forceTLS: true,
                authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            }
        );

        const channel = pusher.subscribe(`private-contact-book.${contactBookId}`);

        // Listening for subscription success
        channel.bind('pusher:subscription_succeeded', () => {
            console.log(`Successfully subscribed to private-contact-book.${contactBookId}`);

            // Now that subscription has succeeded, we can safely bind events
            channel.bind('App\\Events\\ContactCreated', (data: ContactCreatedEvent) => {
                console.log('Contact created:', data.contact);
                toast.success(`Contact "${data.contact.name}" was created.`);
                setContacts(prevContacts => [...prevContacts, data.contact]);
            });
        });

        // Listening for subscription errors
        channel.bind('pusher:subscription_error', (status: unknown) => {
            console.error(`Subscription error for channel private-contact-book.${contactBookId}`, status);
        });

        console.log('Attempting to subscribe to private-contact-book.', contactBookId);

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [contactBookId, setContacts, token]);




    const handleCreateOrUpdateContact = useCallback(async () => {
        if (!newContact.name.trim() || !newContact.email.trim() || !newContact.phone.trim() || !token) return;

        const requestConfig = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            if (editingContactId !== null) {
                const { data } = await axios.put(
                    `${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts/${editingContactId}`,
                    newContact, requestConfig
                );
                setContacts(prevContacts => prevContacts.map(contact =>
                    contact.id === editingContactId ? { ...contact, ...data } : contact
                ));
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts`,
                    newContact, requestConfig);
                toast('Contact creation started.');
            }
            setNewContact({ name: '', email: '', phone: '' });
            setEditingContactId(null);
        } catch (error) {
            toast.error(`Failed to ${editingContactId ? 'update' : 'create'} contact.`);
            console.error(`Failed to ${editingContactId ? 'update' : 'create'} contact.`, error);
        }
    }, [newContact, editingContactId, setContacts, contactBookId, token]);

    const handleEditContact = (contact: Contact) => {
        setEditingContactId(contact.id);
        setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
    };

    const handleDeleteContact = useCallback(async (id: number) => {
        if (!token) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
        } catch (error) {
            toast.error('Failed to delete contact.');
            console.error('Failed to delete contact.', error);
        }
    }, [setContacts, contactBookId, token]);

    const formatDateTime = useCallback((dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }, []);

    const ContactItem: React.FC<{ contact: Contact }> = ({ contact }) => (
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
    );

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <Toaster />
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
                        <ContactItem key={contact.id} contact={contact} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContactList;
