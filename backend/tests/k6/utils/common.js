import {post} from '../utils/request.js'

function generateUsername() {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    return `example${timestamp}`;
}

// Function to generate a random email using the timestamp
function generateEmail() {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    return `example${timestamp}@example.com`; // Use the timestamp for a unique email
}

// Function to generate a random phone number (11 digits long)
function generatePhoneNumber() {
    const phoneNumber = Math.floor(1000000000 + Math.random() * 9000000000); // Generate an 11-digit number
    return phoneNumber.toString();
}

function generatePassword(){
    const password = `pass` + Date.now()
    return password
}

export default function getAdminToken(){
    const url = `http://localhost:8080/api/v1/login`;

    const request = {
        "email": "admin@admin.com",
        "password": "password"
    }
    const response = post(url, request);
    const jsonResponse = response.json();
    const token = jsonResponse["token"];
    return token
}

export { generateUsername, generateEmail, generatePhoneNumber, generatePassword, getAdminToken };