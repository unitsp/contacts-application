import React from 'react';
import { Contact } from '../../types';
import formatDateTime from '../../utils/formatDateTime';

interface ContactItemProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (id: number) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onEdit, onDelete }) => (
    <li className="py-4 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-semibold text-gray-900">{contact.name}</h2>
            <p className="text-sm text-gray-500">Email: {contact.email}</p>
            <p className="text-sm text-gray-500">Phone: {contact.phone}</p>
            <p className="text-sm text-gray-500">Created: {formatDateTime(contact.created_at)}</p>
            <p className="text-sm text-gray-500">Updated: {formatDateTime(contact.updated_at)}</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => onEdit(contact)} className="text-blue-600 hover:text-blue-900 font-medium">
                Edit
            </button>
            <button onClick={() => onDelete(contact.id)} className="text-red-600 hover:text-red-900 font-medium">
                Delete
            </button>
        </div>
    </li>
);

export default ContactItem;
