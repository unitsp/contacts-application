import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface ContactBook {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

const useContactBooks = () => {
    const [contactBooks, setContactBooks] = useState<ContactBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContactBooks = async () => {
            try {
                const { data } = await axios.get<ContactBook[]>(`${process.env.REACT_APP_API_URL}/api/contact-books`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
                });
                setContactBooks(data);
            } catch {
                setError('Failed to load contact books.');
            } finally {
                setLoading(false);
            }
        };

        fetchContactBooks();
    }, []);

    return { contactBooks, setContactBooks, loading, error };
};

const ContactBookList: React.FC = () => {
    const { contactBooks, setContactBooks, loading, error } = useContactBooks();
    const [editingBookId, setEditingBookId] = useState<number | null>(null);
    const [newBookName, setNewBookName] = useState<string>('');

    const navigate = useNavigate();

    const handleCreateOrUpdateContactBook = useCallback(async () => {
        if (!newBookName.trim()) return;

        const requestConfig = {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        };

        try {
            if (editingBookId !== null) {
                const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/contact-books/${editingBookId}`,
                    { name: newBookName }, requestConfig);
                setContactBooks(prevBooks => prevBooks.map(book =>
                    book.id === editingBookId ? { ...book, name: data.name } : book
                ));
            } else {
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/contact-books`,
                    { name: newBookName }, requestConfig);
                setContactBooks(prevBooks => [...prevBooks, data]);
            }
            setNewBookName('');
            setEditingBookId(null);
        } catch (error) {
            console.error(`Failed to ${editingBookId ? 'update' : 'create'} contact book.`, error);
        }
    }, [newBookName, editingBookId, setContactBooks]);

    const handleEditContactBook = (id: number, name: string) => {
        setEditingBookId(id);
        setNewBookName(name);
    };

    const handleDeleteContactBook = useCallback(async (id: number) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/contact-books/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            });
            setContactBooks(prevBooks => prevBooks.filter(book => book.id !== id));
        } catch (error) {
            console.error('Failed to delete contact book.', error);
        }
    }, [setContactBooks]);

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

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder={editingBookId ? "Update Contact Book Name" : "New Contact Book Name"}
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <button
                    onClick={handleCreateOrUpdateContactBook}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {editingBookId ? "Update Contact Book" : "Create Contact Book"}
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {contactBooks.map((book) => (
                    <li key={book.id} className="py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{book.name}</h2>
                            <p className="text-sm text-gray-500">Created: {formatDateTime(book.created_at)}</p>
                            <p className="text-sm text-gray-500">Updated: {formatDateTime(book.updated_at)}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditContactBook(book.id, book.name)}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteContactBook(book.id)}
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
                ))}
            </ul>
        </div>
    );
};

export default ContactBookList;
