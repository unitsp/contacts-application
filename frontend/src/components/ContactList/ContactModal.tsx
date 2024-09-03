import React from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-50 fixed inset-0" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default ContactModal;
