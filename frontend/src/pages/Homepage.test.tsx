import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('HomePage', () => {
    const renderHomePage = (isLoggedIn = false) => {
        if (isLoggedIn) {
            localStorage.setItem('auth_token', 'fake_token');
        } else {
            localStorage.removeItem('auth_token');
        }
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        localStorage.clear();
        mockNavigate.mockClear();
    });

    afterEach(() => {
        cleanup();  // Ensures that the DOM is cleaned up between tests
    });

    it('renders correctly based on login status', () => {
        // Test when not logged in
        renderHomePage();
        expect(screen.getByText(/Welcome to the Contacts App/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();

        cleanup();  // Cleanup after the first render

        // Test when logged in
        renderHomePage(true);
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /View Contact Books/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    it('navigates to login page when "Login" button is clicked', () => {
        renderHomePage();
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('navigates to register page when "Register" button is clicked', () => {
        renderHomePage();
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('navigates to contact books page when "View Contact Books" button is clicked', () => {
        renderHomePage(true);
        fireEvent.click(screen.getByRole('button', { name: /View Contact Books/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/contact-books');
    });

    it('logs out the user and navigates to home page when "Logout" button is clicked', () => {
        renderHomePage(true);
        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
