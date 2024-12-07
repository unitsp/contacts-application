import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { del } from '../utils/request.js';
import getContactBookContacts from '../getRequests/getContactBookContacts.js';
import getAdminToken from '../utils/common.js';


export const options = OPTIONS;
console.log(options);

export default function deleteContact(){
    const contactBookContacts = getContactBookContacts().json();
    const randomIndex = Math.floor(Math.random() * contactBookContacts.length); // Get random index
    const randomContact = contactBookContacts[randomIndex]; // Select random contact
    const randomId = randomContact.id; // Access the ID of the random contact
    console.log(randomId);
    const url = `${BASE_URL}/contact-books/1/contacts/${randomId}`;
    const token = getAdminToken();

    const response = del(url, token);
    console.log(response)
    check( response, {
        'status is 204': (r) => r.status === 204,
    });
}