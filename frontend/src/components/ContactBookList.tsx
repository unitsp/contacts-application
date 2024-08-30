import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the ContactBook interface at the top
interface ContactBook {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

// Define the hook at the top of the file
const useContactBooks = () => {
    const [contactBooks, setContactBooks] = useState<ContactBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<ContactBook[]>(`${process.env.REACT_APP_API_URL}/api/contact-books`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
        })
            .then(response => setContactBooks(response.data))
            .catch(() => setError('Failed to load contact books.'))
            .finally(() => setLoading(false));
    }, []);

    return { contactBooks, setContactBooks, loading, error };
};

const ContactBookList: React.FC = () => {
    const { contactBooks, setContactBooks, loading, error } = useContactBooks();
    const [newBookName, setNewBookName] = useState<string>('');

    const handleCreateContactBook = async () => {
        if (!newBookName.trim()) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contact-books`,
                { name: newBookName },
                { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } }
            );
            setNewBookName('');
            setContactBooks([...contactBooks, response.data]);
        } catch (error) {
            console.error('Failed to create contact book.', error);
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <p className="text-gray-500 text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="New Contact Book Name"
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <button
                    onClick={handleCreateContactBook}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Create Contact Book
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {contactBooks.map((book) => (
                    <li key={book.id} className="py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{book.name}</h2>
                            <p className="text-sm text-gray-500">
                                Created: {formatDateTime(book.created_at)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Updated: {formatDateTime(book.updated_at)}
                            </p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                            View Details
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactBookList;
