import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleViewContactBooks = () => {
        navigate('/contact-books');
    };

    return (
        <div className="container mx-auto text-center">
            {isLoggedIn ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
                    <button
                        onClick={handleViewContactBooks}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        View Contact Books
                    </button>
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Welcome to the Contacts App</h1>
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 text-white px-4 py-2 rounded m-2"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleRegister}
                        className="bg-green-500 text-white px-4 py-2 rounded m-2"
                    >
                        Register
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
