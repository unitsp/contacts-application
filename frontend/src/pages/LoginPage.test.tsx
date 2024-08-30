import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
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

describe('LoginPage', () => {
    const setup = () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    const fillForm = (email: string, password: string) => {
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
    };

    beforeEach(() => {
        mockedAxios.post.mockClear();
        mockNavigate.mockClear();
    });

    it('renders LoginPage with all fields', () => {
        setup();

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('displays validation errors when form is submitted with empty fields', async () => {
        setup();

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText((content, element) => content.includes('Email is required'))).toBeInTheDocument();
            expect(screen.getByText((content, element) => content.includes('Password is required'))).toBeInTheDocument();
        });
    });


    it('submits the form and navigates on success', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake_token' } });

        setup();
        fillForm('john@example.com', 'password');
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/contact-books'));
        expect(localStorage.getItem('auth_token')).toBe('fake_token');
    });

    it('displays error message on API failure', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    errors: { email: 'Invalid credentials' }
                }
            }
        });

        setup();
        fillForm('john@example.com', 'wrongpassword');
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
    });

    it('displays general error message on unknown error', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

        setup();
        fillForm('john@example.com', 'password');
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() =>
            expect(screen.getByText('Network Error')).toBeInTheDocument()
        );
    });
});
