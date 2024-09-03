import React, { useState, useCallback, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import useContacts from '../../hooks/useContacts';
import usePusher from '../../hooks/usePusher';
import ContactModal from './ContactModal';
import ContactForm from './ContactForm';
import ContactListWrapper from './ContactListWrapper';
import { createContact, updateContact, deleteContact } from '../../utils/contactOperations';
import { Contact, NewContact } from '../../types';

const Index: React.FC<{ contactBookId: number }> = ({ contactBookId }) => {
    const token = useMemo(() => localStorage.getItem('auth_token'), []);
    const { contacts, setContacts, loading, error, fetchContacts } = useContacts(contactBookId, token);
    const [editingContactId, setEditingContactId] = useState<number | null>(null);
    const [newContact, setNewContact] = useState<NewContact>({ name: '', email: '', phone: '' });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Use fetchContacts to reload contacts when events are received
    usePusher(contactBookId, token, fetchContacts);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingContactId(null);
        setNewContact({ name: '', email: '', phone: '' });
    };

    const handleCreateContact = useCallback(async () => {
        await createContact(contactBookId, newContact, token, setContacts);
        closeModal();
    }, [newContact, setContacts, contactBookId, token]);

    const handleUpdateContact = useCallback(async () => {
        if (editingContactId !== null) {
            await updateContact(contactBookId, editingContactId, newContact, token, setContacts);
            closeModal();
        }
    }, [newContact, editingContactId, setContacts, contactBookId, token]);

    const handleEditContact = (contact: Contact) => {
        setEditingContactId(contact.id);
        setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
        openModal();
    };

    const handleDeleteContact = useCallback(async (id: number) => {
        await deleteContact(contactBookId, id, token, setContacts);
    }, [setContacts, contactBookId, token]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <Toaster />
            <button
                onClick={openModal}
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Add Contact
            </button>
            <ContactListWrapper
                contacts={contacts}
                loading={loading}
                error={error}
                handleEditContact={handleEditContact}
                handleDeleteContact={handleDeleteContact}
            />
            <ContactModal isOpen={isModalOpen} onClose={closeModal}>
                <ContactForm
                    newContact={newContact}
                    setNewContact={setNewContact}
                    handleCreate={handleCreateContact}
                    handleUpdate={handleUpdateContact}
                    editingContactId={editingContactId}
                />
            </ContactModal>
        </div>
    );
};

export default Index;
