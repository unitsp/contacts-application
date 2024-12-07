import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { post } from '../utils/request.js';
import { generateUsername } from '../utils/common.js';
import getAdminToken from '../utils/common.js';



export const options = OPTIONS;

export default function (){
    const url = `${BASE_URL}/contact-books`;
    const token = getAdminToken();
    const request = 
    {
        "name": generateUsername()
    }
    const response = post(url, request, token);
    check( response, {
        'status is 201': (r) => r.status === 201,
    });
    return response
}