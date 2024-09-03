import usePusherChannel from './usePusherChannel';
import toast from 'react-hot-toast';


const useContactBookPusher = (
    userId: string | null,
    token: string | null,
    fetchContactBooks: () => Promise<void>
) => {
    usePusherChannel(`private-user-contact-books.${userId}`, token, {
        'App\\Events\\ContactBooksListChanged': () => {
            toast.success('A contact books was updated.');
            fetchContactBooks();
        }
    });
};

export default useContactBookPusher;
