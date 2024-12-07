import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { post } from '../utils/request.js';
import { generateEmail, generateUsername, generatePassword } from '../utils/common.js'
import getAdminToken from '../utils/common.js';


export const options = OPTIONS;

export default function (){
    const url = `${BASE_URL}/register`;
    const token = getAdminToken();
    const name = generateUsername();
    const email = generateEmail();
    const password = generatePassword();
    const request = 
    {
        "name": name,
        "email": email,
        "password": password,
        "password_confirmation": password

    }
    const response = post(url, request, token);
    check( response, {
        'status is 201': (r) => r.status === 201,
    });
    return [request, response]
}