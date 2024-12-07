import { check } from 'k6';
import { BASE_URL, OPTIONS } from '../utils/config.js';
import { post } from '../utils/request.js';
import registerUser from './registerUser.js';
import getAdminToken from '../utils/common.js';


export const options = OPTIONS;

export default function (){
    const userResponse = registerUser();
    
    const userEmail = userResponse[1].json()["user"]["email"];
    const userPassword = userResponse[0]["password"];
    console.log(userEmail)
    console.log(userPassword)
    const url = `${BASE_URL}/login`;
    const token = getAdminToken();

    const request = {
        "email": userEmail,
        "password": userPassword
    }
    const response = post(url, request, token);
    check( response, {
        'status is 200': (r) => r.status === 200,
    });
    return response
}