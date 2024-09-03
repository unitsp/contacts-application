import { useEffect, useState } from 'react';
import axios from 'axios';
import { ContactBook } from '../types';

const useContactBooks = () => {
    const [contactBooks, setContactBooks] = useState<ContactBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContactBooks = async () => {
        try {
            const { data } = await axios.get<ContactBook[]>(`${process.env.REACT_APP_API_URL}/contact-books`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            });
            setContactBooks(data);
        } catch {
            setError('Failed to load contact books.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactBooks();
    }, []);

    return { contactBooks, setContactBooks, loading, error, fetchContactBooks};
};

export default useContactBooks;