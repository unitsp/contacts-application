import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { put } from '../utils/request.js';
import { generateUsername, generateEmail, generatePhoneNumber } from '../utils/common.js'
import getAdminToken from '../utils/common.js';

import getContactBookContacts from '../getRequests/getContactBookContacts.js'

export const options = OPTIONS;
console.log(options);

export default function editContact(){
    const contact = getContactBookContacts().json();
    const randomIndex = Math.floor(Math.random() * contact.length); // Get random index
    const randomContact = contact[randomIndex]; // Select random contact
    const randomBookId = randomContact.contact_book_id // Access the Book ID of the random contact
    const randomContactId = randomContact.id; // Access the ID of the random contact

    const name = generateUsername();
    const email = generateEmail();
    const phone = generatePhoneNumber();

    const url = `${BASE_URL}/contact-books/${randomBookId}/contacts/${randomContactId}`;
    const token = getAdminToken();
    const request = {
        "name": name,
        "email": email,
	    "phone": phone
    }
    const response = put(url, request, token);
    console.log(response.status);
    check( response, {
        'status is 200': (r) => r.status === 200,
    }); // This will fail! returns a 500 even though the edit is eventually consistant 
    console.log(response)
    return response
}