import React from 'react';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ContactBooksPage from './ContactBooksPage';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContactBooksPage', () => {
    const mockContactBooks = [
        { id: 1, name: 'Personal Contacts', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T12:00:00Z' },
        { id: 2, name: 'Work Contacts', created_at: '2024-01-02T10:00:00Z', updated_at: '2024-01-02T12:00:00Z' },
    ];

    beforeEach(() => jest.clearAllMocks());

    it('renders and displays contact books', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockContactBooks });
        render(<ContactBooksPage />);

        await waitFor(() => {
            expect(screen.getByText('Personal Contacts')).toBeInTheDocument();
            expect(screen.getByText('Work Contacts')).toBeInTheDocument();
        });

        expect(screen.getByText('My Contact Books')).toBeInTheDocument();
    });

    it('displays an error message on load failure', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to load contact books.'));
        render(<ContactBooksPage />);

        await waitFor(() => expect(screen.getByText('Failed to load contact books.')).toBeInTheDocument());
    });

    it('creates and displays a new contact book', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockContactBooks });
        mockedAxios.post.mockResolvedValueOnce({
            data: { id: 3, name: 'New Contact Book', created_at: '2024-01-03T10:00:00Z', updated_at: '2024-01-03T10:00:00Z' },
        });

        render(<ContactBooksPage />);

        await waitFor(() => {
            expect(screen.getByText('Personal Contacts')).toBeInTheDocument();
            expect(screen.getByText('Work Contacts')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText('New Contact Book Name'), { target: { value: 'New Contact Book' } });
        fireEvent.click(screen.getByText('Create Contact Book'));

        await waitFor(() => expect(screen.getByText('New Contact Book')).toBeInTheDocument());
    });

    it('edits and updates an existing contact book', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockContactBooks });
        mockedAxios.put.mockResolvedValueOnce({
            data: { id: 1, name: 'Updated Personal Contacts', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-04T10:00:00Z' },
        });

        render(<ContactBooksPage />);

        await waitFor(() => {
            expect(screen.getByText('Personal Contacts')).toBeInTheDocument();
            expect(screen.getByText('Work Contacts')).toBeInTheDocument();
        });

        fireEvent.click(within(screen.getByText('Personal Contacts').closest('li')!).getByText('Edit'));

        fireEvent.change(screen.getByPlaceholderText('Update Contact Book Name'), { target: { value: 'Updated Personal Contacts' } });
        fireEvent.click(screen.getByText('Update Contact Book'));

        await waitFor(() => {
            expect(screen.getByText('Updated Personal Contacts')).toBeInTheDocument();
            expect(screen.queryByText('Personal Contacts')).not.toBeInTheDocument();
        });
    });

    it('deletes a contact book and removes it from the display', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockContactBooks });
        mockedAxios.delete.mockResolvedValueOnce({ status: 204 });

        render(<ContactBooksPage />);

        await waitFor(() => {
            expect(screen.getByText('Personal Contacts')).toBeInTheDocument();
            expect(screen.getByText('Work Contacts')).toBeInTheDocument();
        });

        // Simulate deleting the first contact book
        const personalContactsDeleteButton = within(screen.getByText('Personal Contacts').closest('li')!)
            .getByText('Delete');

        fireEvent.click(personalContactsDeleteButton);

        await waitFor(() => {
            expect(screen.queryByText('Personal Contacts')).not.toBeInTheDocument();
        });
    });
});
