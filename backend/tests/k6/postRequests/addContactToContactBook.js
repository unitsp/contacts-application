import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { post } from '../utils/request.js';
import { generateUsername, generateEmail, generatePhoneNumber } from '../utils/common.js'

import getContactBooks from '../getRequests/getContactBooks.js';
import getAdminToken from '../utils/common.js';

export const options = OPTIONS;
console.log(options);

export default function getContactBookContacts(){
    const contactBooks = getContactBooks().json();
    const randomIndex = Math.floor(Math.random() * contactBooks.length); // Get random index
    const randomContact = contactBooks[randomIndex]; // Select random contact
    const randomId = randomContact.id; // Access the ID of the random contact

    const name = generateUsername();
    const email = generateEmail();
    const phone = generatePhoneNumber();

    const url = `${BASE_URL}/contact-books/${randomId}/contacts`;
    const token = getAdminToken();
    const request = {
        "name": name,
        "email": email,
	    "phone": phone
    }
    const response = post(url, request, token);
    console.log(response.status);
    check( response, {
        'status is 202': (r) => r.status === 202,
    });
    console.log(response)
    return response
}