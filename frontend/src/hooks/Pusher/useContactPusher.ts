import usePusherChannel from './usePusherChannel';
import toast from 'react-hot-toast';

const useContactPusher = (
    contactBookId: number,
    token: string | null,
    fetchContacts: () => Promise<void>
) => {
    usePusherChannel(`private-contact-book.${contactBookId}`, token, {
        'App\\Events\\ContactCreated': () => {
            toast.success('A new contact was created.');
            fetchContacts();
        },
        'App\\Events\\ContactUpdated': () => {
            toast.success('A contact was updated.');
            fetchContacts();
        },
        'App\\Events\\ContactDeleted': () => {
            toast.error('A contact was deleted.');
            fetchContacts();
        }
    });
};

export default useContactPusher;
