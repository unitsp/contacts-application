import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { get } from '../utils/request.js';
import getAdminToken from '../utils/common.js';


export const options = OPTIONS;
console.log(options);

export default function (){
    const url = `${BASE_URL}/contact-books/1`;
    const token = getAdminToken();
    const response = get(url, token);
    const jsonResponse = response.json();
    check( response, {
        'status is 200': (r) => r.status === 200,
    });
    console.log(JSON.stringify(jsonResponse, null, 2));
    console.log(jsonResponse)
}