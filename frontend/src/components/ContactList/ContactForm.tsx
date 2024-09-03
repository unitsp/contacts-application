import React from 'react';
import { NewContact } from '../../types';

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
            <input
                type="text"
                placeholder="Contact Name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                className="border rounded p-2"
            />
            <input
                type="email"
                placeholder="Contact Email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="Contact Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                className="border rounded p-2"
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
