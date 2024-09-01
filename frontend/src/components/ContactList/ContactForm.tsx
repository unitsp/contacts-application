import React from 'react';
import { NewContact } from '../../types';

interface ContactFormProps {
    newContact: NewContact;
    setNewContact: React.Dispatch<React.SetStateAction<NewContact>>;
    handleCreateOrUpdate: () => void;
    editingContactId: number | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ newContact, setNewContact, handleCreateOrUpdate, editingContactId }) => (
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
            onClick={handleCreateOrUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded"
        >
            {editingContactId ? "Update Contact" : "Create Contact"}
        </button>
    </div>
);

export default ContactForm;
