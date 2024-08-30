import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import axios from 'axios';


// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
    const setup = () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );
    };

    const fillForm = (name: string, email: string, password: string, passwordConfirmation: string) => {
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: name } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: passwordConfirmation } });
    };

    beforeEach(() => {
        mockedAxios.post.mockClear();
        mockNavigate.mockClear();
    });

    it('renders RegisterPage with all fields', () => {
        setup();

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('displays validation errors when form is submitted with empty fields', async () => {
        setup();

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        });
    });

    it('displays a password mismatch error when passwords do not match', async () => {
        setup();

        fillForm('John Doe', 'john@example.com', 'password123', 'differentPassword');
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('submits the form and navigates on success', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake_token' } });

        setup();
        fillForm('John Doe', 'john@example.com', 'password', 'password');
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/contact-books'));
        expect(localStorage.getItem('auth_token')).toBe('fake_token');
    });

    it('displays error message on API failure', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    errors: { email: 'Email is already taken' }
                }
            }
        });

        setup();
        fillForm('John Doe', 'john@example.com', 'password', 'password');
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(screen.getByText(/Email is already taken/i)).toBeInTheDocument());
    });

    it('displays general error message on unknown error', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

        setup();
        fillForm('John Doe', 'john@example.com', 'password', 'password');
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => expect(screen.getByText(/Something went wrong. Please try again/i)).toBeInTheDocument());
    });
});
