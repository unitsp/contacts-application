import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const usePusher = (
    contactBookId: number,
    token: string | null,
    fetchContacts: () => Promise<void>
) => {
    useEffect(() => {
        if (!token) return;

        const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY || '', {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER || '',
            forceTLS: true,
            authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        });

        const channel = pusher.subscribe(`private-contact-book.${contactBookId}`);

        channel.bind('pusher:subscription_succeeded', () => {
            channel.bind('App\\Events\\ContactCreated', () => {
                toast.success('A new contact was created.');
                fetchContacts();
            });

            channel.bind('App\\Events\\ContactUpdated', () => {
                toast.success('A contact was updated.');
                fetchContacts();
            });

            channel.bind('App\\Events\\ContactDeleted', () => {
                toast.error('A contact was deleted.');
                fetchContacts();
            });
        });

        channel.bind('pusher:subscription_error', (error: any) => {
            toast.error('Failed to subscribe to channel.');
            console.error('Pusher subscription error:', error);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [contactBookId, token, fetchContacts]);
};

export default usePusher;
