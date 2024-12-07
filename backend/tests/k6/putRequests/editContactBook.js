import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { put } from '../utils/request.js';
import { generateUsername } from '../utils/common.js'
import createContactBook from '../postRequests/createContactBook.js';
import getAdminToken from '../utils/common.js';


export const options = OPTIONS;

export default function (){
    const ContactBook = createContactBook().json();
    const ContactBookId = ContactBook["id"]; // Select random contact

    const url = `${BASE_URL}/contact-books/${ContactBookId}`;
    const token = getAdminToken();
    const request = 
    {
        "name": generateUsername()
    }
    const response = put(url, request, token);
    check( response, {
        'status is 200': (r) => r.status === 200,
    });
    return response
}