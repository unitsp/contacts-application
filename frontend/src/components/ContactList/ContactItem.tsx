import React, { useState } from 'react';
import { Contact } from '../../types';
import formatDateTime from '../../utils/formatDateTime';
import useContactHistory from '../../hooks/useContactHistory';

interface ContactItemProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (id: number) => void;
    token: string | null;  // Assuming you're passing the auth token as a prop
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onEdit, onDelete, token }) => {
    const [showHistory, setShowHistory] = useState(false);
    const { history, loading, error, fetchHistory } = useContactHistory(contact.id, token);

    const handleShowHistory = () => {
        fetchHistory();
        setShowHistory(true);
    };

    return (
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
                <button onClick={handleShowHistory} className="text-gray-600 hover:text-gray-900 font-medium">
                    History
                </button>
            </div>

            {/* History Popup */}
            {showHistory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 max-w-lg">
                        <h3 className="text-lg font-semibold mb-4">Change History</h3>
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : history.length > 0 ? (
                            <ul className="space-y-4">
                                {history.map((item, index) => (
                                    <li key={index} className="text-sm text-gray-700">
                                        <strong>{formatDateTime(item.created_at)}:</strong>
                                        <ul className="ml-4">
                                            {Object.entries(item.changes).map(([key, value]) => {
                                                const { old, new: newValue } = value as { old: string; new: string };
                                                return (
                                                    <li key={key}>
                                                        <span className="text-gray-900">{key}</span>: changed from{' '}
                                                        <span className="text-red-500">{old}</span> to{' '}
                                                        <span className="text-green-500">{newValue}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No history available.</p>
                        )}
                        <button
                            onClick={() => setShowHistory(false)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default ContactItem;
