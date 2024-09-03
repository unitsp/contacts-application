import React from 'react';
import { NewContact } from '../../types';
import FormField from '../Forms/FormField';

interface ContactFormProps {
    newContact: NewContact;
    setNewContact: React.Dispatch<React.SetStateAction<NewContact>>;
    handleCreate: () => void;
    handleUpdate: () => void;
    editingContactId: number | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ newContact, setNewContact, handleCreate, handleUpdate, editingContactId }) => {
    const handleSubmit = () => {
        if (editingContactId) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <FormField
                id="contact-name"
                label="Contact Name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
            />
            <FormField
                id="contact-email"
                label="Contact Email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
            />
            <FormField
                id="contact-phone"
                label="Contact Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
            />
            <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                {editingContactId ? "Update Contact" : "Create Contact"}
            </button>
        </div>
    );
};

export default ContactForm;
