import React from 'react';
import { ContactBook } from '../../types';
import ContactBookItem from './ContactBookItem';

interface ContactBookListProps {
    contactBooks: ContactBook[];
    onEdit: (id: number, name: string) => void;
    onDelete: (id: number) => void;
}

const ContactBookList: React.FC<ContactBookListProps> = ({ contactBooks, onEdit, onDelete }) => {
    return (
        <ul className="divide-y divide-gray-200">
            {contactBooks.map((book) => (
                <ContactBookItem
                    key={book.id}
                    book={book}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default ContactBookList;
