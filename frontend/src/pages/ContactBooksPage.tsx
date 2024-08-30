import React from 'react';
import ContactBookList from '../components/ContactBookList';

const ContactBooksPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    My Contact Books
                </h1>
                <ContactBookList />
            </div>
        </div>
    );
};

export default ContactBooksPage;
