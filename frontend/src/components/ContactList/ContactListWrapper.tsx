import React from 'react';
import { Contact } from '../../types';
import ContactItem from './ContactItem';

interface ContactListWrapperProps {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
    handleEditContact: (contact: Contact) => void;
    handleDeleteContact: (id: number) => void;
    token: string | null;  // Add token to the props
}

const ContactListWrapper: React.FC<ContactListWrapperProps> = ({ contacts, loading, error, handleEditContact, handleDeleteContact, token }) => {
    if (loading) {
        return <p className="text-gray-500 text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <>
            {contacts.length === 0 ? (
                <p className="text-gray-500 text-center">No contacts found.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            onEdit={handleEditContact}
                            onDelete={handleDeleteContact}
                            token={token}  // Pass token down to ContactItem
                        />
                    ))}
                </ul>
            )}
        </>
    );
};

export default ContactListWrapper;
