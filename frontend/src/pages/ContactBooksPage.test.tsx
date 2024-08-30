import React from 'react';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ContactBooksPage from './ContactBooksPage';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContactBooksPage', () => {
    const mockContactBooks = [
        {
            id: 1,
            name: 'Personal Contacts',
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T12:00:00Z',
        },
        {
            id: 2,
            name: 'Work Contacts',
            created_at: '2024-01-02T10:00:00Z',
            updated_at: '2024-01-02T12:00:00Z',
        },
    ];

    beforeEach(() => {
        mockedAxios.get.mockClear();
        mockedAxios.post.mockClear();
    });

    it('renders the ContactBooksPage and displays contact books', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockContactBooks });

        render(<ContactBooksPage />);

        // Wait for the contact books to load and be displayed
        await waitFor(() => {
            expect(screen.getByText('Personal Contacts')).toBeInTheDocument();
            expect(screen.getByText('Work Contacts')).toBeInTheDocument();
        });

        // Assert that the page title is correct
        expect(screen.getByText('My Contact Books')).toBeInTheDocument();
    });

    it('displays an error message when contact books fail to load', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to load contact books.'));

        render(<ContactBooksPage />);

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Failed to load contact books.')).toBeInTheDocument();
        });
    });

    it('creates a new contact book and displays it on the page', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockContactBooks });
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                id: 3,
                name: 'New Contact Book',
                created_at: '2024-01-03T10:00:00Z',
                updated_at: '2024-01-03T10:00:00Z',
            },
        });

        render(<ContactBooksPage />);

        // Wait for the existing contact books to load
        await waitFor(() => {
            expect(screen.getByText('Personal Contacts')).toBeInTheDocument();
            expect(screen.getByText('Work Contacts')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.change(screen.getByPlaceholderText('New Contact Book Name'), {
                target: { value: 'New Contact Book' },
            });

            fireEvent.click(screen.getByText('Create Contact Book'));
        });

        await waitFor(() => {
            const newContactBookElement = screen.getByText('New Contact Book').closest('li');
            expect(newContactBookElement).toBeInTheDocument();
        });
    });
});
