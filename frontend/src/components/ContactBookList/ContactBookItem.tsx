import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactBook } from '../../types';

interface ContactBookItemProps {
    book: ContactBook;
    onEdit: (id: number, name: string) => void;
    onDelete: (id: number) => void;
}

const ContactBookItem: React.FC<ContactBookItemProps> = ({ book, onEdit, onDelete }) => {
    const navigate = useNavigate();

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

    return (
        <li className="py-4 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{book.name}</h2>
                <p className="text-sm text-gray-500">Created: {formatDateTime(book.created_at)}</p>
                <p className="text-sm text-gray-500">Updated: {formatDateTime(book.updated_at)}</p>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(book.id, book.name)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(book.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                >
                    Delete
                </button>
                <button
                    onClick={() => navigate(`/contact-books/${book.id}/contacts`)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    View Details
                </button>
            </div>
        </li>
    );
};

export default ContactBookItem;
