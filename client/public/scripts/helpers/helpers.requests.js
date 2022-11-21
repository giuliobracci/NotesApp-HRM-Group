// Function that returns the request options, accepts the HTML method and the data to send
export function getRequestOptions(method, data) {
    return {
        method: method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
    }
}

// Fetch a GET request
export async function sendGetRequest(url) {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            return data
        })
}

// Fetch a POST, PUT OR DELETE request to the server, provide a url, an option object and a callback function
export async function sendRequest(url, options) {
    return await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            return data
        })
}
