import axios from 'axios';
import toast from 'react-hot-toast';
import { Contact, NewContact } from '../types';

export const createContact = async (
    contactBookId: number,
    newContact: NewContact,
    token: string | null,
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
): Promise<void> => {
    if (!newContact.name.trim() || !newContact.email.trim() || !newContact.phone.trim() || !token) {
        toast.error('Please fill in all fields.');
        return;
    }

    const requestConfig = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts`,
            newContact,
            requestConfig
        );
        toast('Contact creation started.');
    } catch (error) {
        toast.error('Failed to create contact.');
        console.error('Failed to create contact.', error);
    }
};

export const updateContact = async (
    contactBookId: number,
    editingContactId: number,
    newContact: NewContact,
    token: string | null,
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
): Promise<void> => {
    if (!newContact.name.trim() || !newContact.email.trim() || !newContact.phone.trim() || !token) {
        toast.error('Please fill in all fields.');
        return;
    }

    const requestConfig = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts/${editingContactId}`,
            newContact,
            requestConfig
        );
        setContacts(prevContacts =>
            prevContacts.map(contact =>
                contact.id === editingContactId ? { ...contact, ...data } : contact
            )
        );
        toast.success('Contact updated successfully.');
    } catch (error) {
        toast.error('Failed to update contact.');
        console.error('Failed to update contact.', error);
    }
};

export const deleteContact = async (
    contactBookId: number,
    id: number,
    token: string | null,
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
): Promise<void> => {
    if (!token) return;

    try {
        await axios.delete(
            `${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
        toast.success('Contact deleted successfully.');
    } catch (error) {
        toast.error('Failed to delete contact.');
        console.error('Failed to delete contact.', error);
    }
};
