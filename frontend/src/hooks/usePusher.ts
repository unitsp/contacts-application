import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const usePusher = (contactBookId: number, token: string | null, setContacts: React.Dispatch<React.SetStateAction<Contact[]>>) => {
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
            channel.bind('App\\Events\\ContactCreated', (data: { contact: Contact }) => {
                toast.success(`Contact "${data.contact.name}" was created.`);
                setContacts(prevContacts => [...prevContacts, data.contact]);
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [contactBookId, setContacts, token]);
};

export default usePusher;
