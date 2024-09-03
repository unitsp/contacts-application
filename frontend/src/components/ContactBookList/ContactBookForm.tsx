import React from 'react';
import axios from 'axios';
import { ContactBook } from '../../types';
import FormField from '../Forms/FormField';
import ContactModal from '../ContactList/ContactModal';

interface ContactBookFormProps {
    editingBookId: number | null;
    setEditingBookId: (id: number | null) => void;
    setContactBooks: React.Dispatch<React.SetStateAction<ContactBook[]>>;
    isOpen: boolean;
    onClose: () => void;
    newBookName: string;
    setNewBookName: React.Dispatch<React.SetStateAction<string>>;
}

const ContactBookForm: React.FC<ContactBookFormProps> = ({
                                                             editingBookId,
                                                             setEditingBookId,
                                                             setContactBooks,
                                                             isOpen,
                                                             onClose,
                                                             newBookName,
                                                             setNewBookName,
                                                         }) => {

    const handleSubmit = async () => {
        if (!newBookName.trim()) return;

        const requestConfig = {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        };

        try {
            if (editingBookId !== null) {
                const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/contact-books/${editingBookId}`,
                    { name: newBookName }, requestConfig);
                setContactBooks(prevBooks => prevBooks.map(book =>
                    book.id === editingBookId ? { ...book, name: data.name } : book
                ));
            } else {
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/contact-books`,
                    { name: newBookName }, requestConfig);
                setContactBooks(prevBooks => [...prevBooks, data]);
            }
            setNewBookName('');
            setEditingBookId(null);
            onClose();
        } catch (error) {
            console.error(`Failed to ${editingBookId ? 'update' : 'create'} contact book.`, error);
        }
    };

    return (
        <ContactModal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col space-y-4">
                <FormField
                    id="contact-book-name"
                    label="Contact Book Name"
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {editingBookId ? "Update Contact Book" : "Create Contact Book"}
                </button>
            </div>
        </ContactModal>
    );
};

export default ContactBookForm;
