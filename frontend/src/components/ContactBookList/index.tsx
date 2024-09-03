import React, {useMemo, useState} from 'react';
import useContactBooks from '../../hooks/useContactBooks';
import ContactBookForm from './ContactBookForm';
import ContactBookList from './ContactBookList';
import usePusher from '../../hooks/Pusher/useContactBookPusher';
import axios from 'axios';

const Index: React.FC = () => {
    const token = useMemo(() => localStorage.getItem('auth_token'), []);
    const userId = useMemo(() => localStorage.getItem('auth_id'), []);
    const { contactBooks, setContactBooks, loading, error, fetchContactBooks } = useContactBooks();
    const [editingBookId, setEditingBookId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newBookName, setNewBookName] = useState<string>('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBookId(null); // Reset editing state on close
        setNewBookName('');
    };

    const handleEditContactBook = (id: number, name: string) => {
        setEditingBookId(id);
        setNewBookName(name);
        openModal();
    };

    const handleCreateContactBook = () => {
        setEditingBookId(null);
        setNewBookName('');
        openModal();
    };

    const handleDeleteContactBook = async (id: number) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/contact-books/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            });
            setContactBooks(prevBooks => prevBooks.filter(book => book.id !== id));
        } catch (error) {
            console.error('Failed to delete contact book.', error);
        }
    };

    usePusher(userId, token, fetchContactBooks);

    if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <button onClick={handleCreateContactBook} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Create New Contact Book
            </button>
            <ContactBookList
                contactBooks={contactBooks}
                onEdit={handleEditContactBook}
                onDelete={handleDeleteContactBook}
            />
            <ContactBookForm
                editingBookId={editingBookId}
                setEditingBookId={setEditingBookId}
                setContactBooks={setContactBooks}
                isOpen={isModalOpen}
                onClose={closeModal}
                newBookName={newBookName}
                setNewBookName={setNewBookName}
            />
        </div>
    );
};

export default Index;
