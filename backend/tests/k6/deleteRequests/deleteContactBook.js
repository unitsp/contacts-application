import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { del } from '../utils/request.js';
import getContactBooks from '../getRequests/getContactBooks.js';
import getAdminToken from '../utils/common.js';


export const options = OPTIONS;

export default function deleteContact(){
    const contactBooks = getContactBooks().json();
    const randomIndex = Math.floor(Math.random() * contactBooks.length); // Get random index
    const randomContact = contactBooks[randomIndex]; // Select random contact
    const randomId = randomContact.id; // Access the ID of the random contact
    console.log(randomId);
    const url = `${BASE_URL}/contact-books/${randomId}`;
    const token = getAdminToken();
    const response = del(url, token);
    console.log(response)
    check( response, {
        'status is 204': (r) => r.status === 204,
    });
}