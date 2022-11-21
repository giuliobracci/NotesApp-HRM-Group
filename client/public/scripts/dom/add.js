// These are the scripts for the add first note page
// This page serves to make the user display at least 1 note on the landing
// Simply we make a POST request to the server and if it's succesfull the user
// will se a success message and then we'll be redirected to the notes dashboard

// Declaring the const from the DOM
const titleNode = document.getElementById('title')
const copyNode = document.getElementById('copy')
const submit = document.getElementById('submit')
const alertMessage = document.createElement('div')

// Set the alert to be ready
alertMessage.setAttribute('role', 'alert')
alertMessage.classList.add('alert', 'alert-danger')

// Listening for submit
submit.addEventListener('click', () => {
    let title = titleNode.value
    let copy = copyNode.value
    let data = { title: title, copy: copy }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
    }
    postData('/addnotes', options)
})

// Render temporary response
function renderResponse(response) {
    response.status === 'ok'
        ? (alertMessage.classList.replace('alert-danger', 'alert-success'),
          (alertMessage.innerHTML = response.message),
          document.body.prepend(alertMessage),
          setTimeout(() => alertMessage.remove(), 2000),
          window.location.replace('/displaynotes'))
        : (alertMessage.classList.replace('alert-success', 'alert-danger'),
          (alertMessage.innerHTML = response.message),
          document.body.prepend(alertMessage),
          setTimeout(() => alertMessage.remove(), 5000))
}

// Make the POST request to the API
async function postData(url, options) {
    await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            renderResponse(data)
        })
}

export { postData }
