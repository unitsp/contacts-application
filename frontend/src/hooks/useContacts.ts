import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Contact } from '../types';

const useContacts = (contactBookId: number, token: string | null) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        if (!token) {
            setError('Authorization token not available.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get<Contact[]>(`${process.env.REACT_APP_API_URL}/contact-books/${contactBookId}/contacts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(data);
        } catch {
            setError('Failed to load contacts.');
        } finally {
            setLoading(false);
        }
    }, [contactBookId, token]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return { contacts, setContacts, loading, error };
};

export default useContacts;
