export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

export interface NewContact {
    name: string;
    email: string;
    phone: string;
}

export interface ContactCreatedEvent {
    contact: Contact;
}
