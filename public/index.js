// Select the elements from the DOM:
const registerLoginButtons = document.querySelectorAll('#register-login')
const loginButton = document.getElementById('btn-login')
const registerButton = document.getElementById('btn-register')
const showPasswordButton = document.getElementById('showPassword')
const form = document.getElementById('form')
const submit = document.getElementById('submit')
const showPasswordDiv = document.getElementById('showPasswordContainer')
const confirmationPassword = document.getElementById('confirm-password')
const passwordConfirmationContainer = document.getElementById(
    'pwd-confirmation-container'
)

// Add the eventListener to the buttons of login and register
registerLoginButtons.forEach(button =>
    button.addEventListener('click', e => {
        switchForm(e)
    })
)
confirmationPassword.addEventListener('keyup', () => {
    checkIfPasswordAreTheSame()
})

// This function handles the switch between register and login
function switchForm(event) {
    // Check if target of the event is login or register
    if (event.target.id === loginButton.id) {
        // If we are in the login section the password confirmation will hide
        passwordConfirmationContainer.classList.add('hidden')
        // Register button stops being active (less prominent in color)
        registerButton.classList.remove('active')
        // Login button becomes the active (more prominent in color)
        loginButton.classList.add('active')
        // The form action changes to point to the "/login" route
        form.action = '/login'
        // Check if show password tick is still available and hides it
        if (showPasswordDiv.classList !== 'hidden') {
            showPasswordDiv.classList.add('hidden')
        }
    } else {
        passwordConfirmationContainer.classList.remove('hidden')
        registerButton.classList.add('active')
        loginButton.classList.remove('active')
        showPasswordDiv.classList.remove('hidden')
        form.action = '/register'
    }
}

// This function gets called whenever the user types a character in the confirmation password field
// We get the current value of both the password fields and then we compare them.
// Main features:
// - The submit button is disabled until the 2 passwords match, to prevent the backend from receiving bad data
// - The user gets an istant visual feedback from typing by switching classes on the fly
function checkIfPasswordAreTheSame() {
    let passwordError = document.getElementById('passwordError')
    let password = document.getElementById('password').value
    let confirmationPassword = document.getElementById('confirm-password').value

    password !== confirmationPassword
        ? (submit.classList.add('disabled'),
          passwordError.classList.remove('hidden'))
        : (submit.classList.remove('disabled'),
          (passwordError.innerText = 'Password Match!'),
          passwordError.classList.remove('text-danger'),
          passwordError.classList.add('text-success'))
}

// Adds the event listener for click on the show password button
function showPassword() {
    let passwordFields = document.getElementsByClassName('password')
    showPasswordButton.addEventListener('click', () => {
        console.log('clicked')
        passwordIteration(passwordFields)
    })
}

// Iterates over the 2 password fields (HTML collection) and calls the function passwordVisibleInvisible
function passwordIteration(passwordFields) {
    for (let i = 0; i < passwordFields.length; i++) {
        passwordVisibleInvisible(passwordFields[i])
    }
}

// This function changes the type of input of the password field from text to password
function passwordVisibleInvisible(password) {
    if (password.type === 'password') {
        password.type = 'text'
        return
    }
    password.type = 'password'
    return
}

showPassword()
