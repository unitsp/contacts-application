import { useEffect, useRef } from 'react';
import Pusher, { Channel } from 'pusher-js';
import toast from 'react-hot-toast';

let pusherInstance: Pusher | null = null;

const getPusherInstance = (token: string): Pusher => {
    if (!pusherInstance) {
        pusherInstance = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY || '', {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER || '',
            forceTLS: true,
            authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        });
    }
    return pusherInstance;
};

const usePusherChannel = (
    channelName: string,
    token: string | null,
    eventHandlers: { [eventName: string]: () => void }
) => {
    const eventHandlersRef = useRef(eventHandlers);

    useEffect(() => {
        if (!token) return;

        const pusher = getPusherInstance(token);
        let channel: Channel = pusher.channel(channelName) as Channel;

        if (!channel) {
            channel = pusher.subscribe(channelName);
        }

        channel.bind('pusher:subscription_succeeded', () => {
            console.log('Subscribed to channel:', channelName);
            for (const eventName in eventHandlersRef.current) {
                if (Object.hasOwnProperty.call(eventHandlersRef.current, eventName)) {
                    channel.bind(eventName, eventHandlersRef.current[eventName]);
                }
            }
        });

        channel.bind('pusher:subscription_error', (error: any) => {
            toast.error('Failed to subscribe to channel.');
            console.error('Pusher subscription error:', error);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [channelName, token]);

    useEffect(() => {
        eventHandlersRef.current = eventHandlers;
    }, [eventHandlers]);
};

export default usePusherChannel;
