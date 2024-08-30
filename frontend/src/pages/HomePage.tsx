import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('auth_token');
        setIsLoggedIn(!!token); // Simplified check
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

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsLoggedIn(false);
        navigate('/'); // Navigate to home page after logout
    };

    return (
        <div className="container mx-auto text-center">
            {isLoggedIn ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
                    <button
                        onClick={handleViewContactBooks}
                        className="bg-blue-500 text-white px-4 py-2 rounded m-2"
                    >
                        View Contact Books
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded m-2"
                    >
                        Logout
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
