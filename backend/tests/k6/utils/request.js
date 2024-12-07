import http from 'k6/http';

export function getDefaultHeaders(token) {
    const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    return headers
}

export function get(url, token) {
    const headers =  getDefaultHeaders(token);
    const params = { headers };
    return http.get(url, params);
}

export function post(url, requestBody, token) {
    const headers = getDefaultHeaders(token);
    const params = { 
        headers,
        timeout: '30s'
    };
    const payload = JSON.stringify(requestBody);
    return http.post(url, payload, params);
}

export function del(url, token) {
    const headers = getDefaultHeaders(token);
    const params = { headers };
    return http.del(url, null, params);
}

export function put(url, requestBody, token) {
    const headers = getDefaultHeaders(token);
    const params = { 
        headers,
        timeout: '30s'
    };
    const payload = JSON.stringify(requestBody);
    return http.put(url, payload, params)
}
