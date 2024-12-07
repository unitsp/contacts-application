import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { get } from '../utils/request.js';
import getAdminToken from '../utils/common.js';

export const options = OPTIONS;
console.log(options);

export default function getContactBooks(){
    const url = `${BASE_URL}/contact-books`;
    const token = getAdminToken();
    const response = get(url, token);
    check( response, {
        'status is 200': (r) => r.status === 200,
    });
    console.log(response)
    return response
}
