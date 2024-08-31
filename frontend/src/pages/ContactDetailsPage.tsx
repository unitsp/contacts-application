import React from 'react';
import { useParams } from 'react-router-dom';
import ContactList from '../components/ContactList';

const ContactDetailsPage: React.FC = () => {
    const { contactBookId } = useParams<{ contactBookId: string }>();

    if (!contactBookId) return <p>Contact Book ID not provided.</p>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Contacts in Book #{contactBookId}
                </h1>
                <ContactList contactBookId={parseInt(contactBookId, 10)} />
            </div>
        </div>
    );
};

export default ContactDetailsPage;
