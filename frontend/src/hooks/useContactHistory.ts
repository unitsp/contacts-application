import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface ContactHistory {
    created_at: string;
    changes: Record<string, { old: string; new: string }>;
}

const useContactHistory = (contactId: number, token: string | null) => {
    const [history, setHistory] = useState<ContactHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        if (!token) {
            setError('Authorization token not available.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get<ContactHistory[]>(`${process.env.REACT_APP_API_URL}/contacts/${contactId}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(data);
        } catch {
            setError('Failed to load contact history.');
        } finally {
            setLoading(false);
        }
    }, [contactId, token]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, loading, error, fetchHistory };
};

export default useContactHistory;
