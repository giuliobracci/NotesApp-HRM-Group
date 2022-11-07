import { form, submit, passwordError, loginButton, state } from './index.js'

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
          document.body.appendChild(alertMessage),
          setTimeout(() => {
              state === 'login'
                  ? (alertMessage.remove(),
                    window.location.assign('/displaynotes'))
                  : (alertMessage.remove(), window.location.assign('/add'))
          }, 800))
        : (alertMessage.classList.add('alert-danger'),
          (alertMessage.innerHTML = response.message),
          document.body.appendChild(alertMessage),
          setTimeout(() => alertMessage.remove(), 5000))
}

// Listen for form submit
submit.addEventListener('click', e => {
    // Check if email is not empty
    if (form.email.value === '') {
        let response = { status: 'error', message: 'You must enter your email' }
        renderResponse(response)
        return
    }
    // Prevent unexpected behaviour from the user by disabling all the iteractions
    // as soon as the form submit is fired
    submit.classList.add('disabled')
    loginButton.classList.add('disabled')
    passwordError.classList.add('hidden')

    // Getting the user data values from the form
    let url = form.action
    let email = form.email.value
    let password = form.password.value
    const data = { email, password }

    // Pack the options object for the POST request
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

export { postData, renderResponse }
