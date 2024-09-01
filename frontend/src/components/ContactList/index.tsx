import React, { useState, useCallback, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import useContacts from '../../hooks/useContacts';
import usePusher from '../../hooks/usePusher';
import ContactForm from './ContactForm';
import ContactListWrapper from './ContactListWrapper';
import { createContact, updateContact, deleteContact } from '../../utils/contactOperations';
import { Contact, NewContact } from '../../types';

const Index: React.FC<{ contactBookId: number }> = ({ contactBookId }) => {
    const token = useMemo(() => localStorage.getItem('auth_token'), []);
    const { contacts, setContacts, loading, error } = useContacts(contactBookId, token);
    const [editingContactId, setEditingContactId] = useState<number | null>(null);
    const [newContact, setNewContact] = useState<NewContact>({ name: '', email: '', phone: '' });

    usePusher(contactBookId, token, setContacts);

    const handleCreateOrUpdateContact = useCallback(async () => {
        if (editingContactId !== null) {
            await updateContact(contactBookId, editingContactId, newContact, token, setContacts);
        } else {
            await createContact(contactBookId, newContact, token, setContacts);
        }
        setNewContact({ name: '', email: '', phone: '' });
        setEditingContactId(null);
    }, [newContact, editingContactId, setContacts, contactBookId, token]);

    const handleEditContact = (contact: Contact) => {
        setEditingContactId(contact.id);
        setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
    };

    const handleDeleteContact = useCallback(async (id: number) => {
        await deleteContact(contactBookId, id, token, setContacts);
    }, [setContacts, contactBookId, token]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <Toaster />
            <ContactForm
                newContact={newContact}
                setNewContact={setNewContact}
                handleCreateOrUpdate={handleCreateOrUpdateContact}
                editingContactId={editingContactId}
            />
            <ContactListWrapper
                contacts={contacts}
                loading={loading}
                error={error}
                handleEditContact={handleEditContact}
                handleDeleteContact={handleDeleteContact}
            />
        </div>
    );
};

export default Index;
