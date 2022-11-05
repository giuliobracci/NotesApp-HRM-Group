import { form, submit, passwordError } from './index.js'

const alertMessage = document.createElement('div')

alertMessage.setAttribute('role', 'alert')
alertMessage.classList.add('alert')

// POST data to the server
async function postData(url, options) {
    await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            renderResponse(data)
        })
}

// Render visual feedback to the user
function renderResponse(response) {
    response.status === 'ok'
        ? (alertMessage.classList.add('alert-success'),
          (alertMessage.innerHTML = response.message),
          document.body.appendChild(alertMessage))
        : (alertMessage.classList.add('alert-danger'),
          (alertMessage.innerHTML = response.message),
          document.body.appendChild(alertMessage),
          setTimeout(() => alertMessage.remove(), 4000))
}

// Listen for form submit
submit.addEventListener('click', e => {
    submit.classList.add('disabled')
    passwordError.classList.add('hidden')

    let url = form.action
    let email = form.email.value
    let password = form.password.value

    const data = { email, password }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
    }
    postData(url, options)
})
