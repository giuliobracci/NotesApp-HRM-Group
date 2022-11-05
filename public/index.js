// Select the elements from the DOM:
const registerLoginButtons = document.querySelectorAll('#register-login')
const loginButton = document.getElementById('btn-login')
const registerButton = document.getElementById('btn-register')
const showPasswordButton = document.getElementById('showPassword')
const form = document.getElementById('form')
const submit = document.getElementById('submit')
const showPasswordDiv = document.getElementById('showPasswordContainer')
const passwordFields = document.getElementsByClassName('password')
const password = document.getElementById('password')
const confirmationPassword = document.getElementById('confirm-password')
const passwordError = document.getElementById('passwordError')
const passwordRequirements = document.getElementById(
    'form-password-requirements'
)
const passwordConfirmationContainer = document.getElementById(
    'pwd-confirmation-container'
)

const regex = {
    lowercase: new RegExp('[a-z]'),
    uppercase: new RegExp('[A-Z]'),
    numbers: new RegExp('[0-9]'),
    specialchar: new RegExp('[^A-Za-z0-9]'),
    lengthCheck(password) {
        if (password.length >= 8 && password.length <= 32) {
            return true
        }
        return false
    },
}

// Add the eventListener to the buttons of login and register
registerLoginButtons.forEach(button =>
    button.addEventListener('click', e => {
        switchForm(e)
    })
)
password.addEventListener('keyup', showHidePasswordRequirements)
password.addEventListener('keyup', passwordValidator)
confirmationPassword.addEventListener('keyup', checkIfPasswordAreTheSame)
showPasswordButton.addEventListener('click', () => {
    passwordIteration(passwordFields)
})

// This function handles the switch between register and login
function switchForm(event) {
    // Check if target of the event is login or register
    if (event.target.id === loginButton.id) {
        confirmationPassword.removeEventListener(
            'keyup',
            checkIfPasswordAreTheSame
        )
        // Remove register related event listeners
        password.removeEventListener('keyup', showHidePasswordRequirements)
        password.removeEventListener('keyup', passwordValidator)
        // Hide the password requirements
        passwordRequirements.classList.add('hidden')
        // Remove disabled from the submit button
        submit.classList.remove('disabled')
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
        // Add the event listener for password requirements and the password validator
        password.addEventListener('keyup', showHidePasswordRequirements)
        password.addEventListener('keyup', passwordValidator)
        // Disable the submit button to prevent the user from sending an empty request
        submit.classList.add('disabled')
        // Set the password confirmation field visible
        passwordConfirmationContainer.classList.remove('hidden')
        // Set the registration tab to appear active
        registerButton.classList.add('active')
        // Remove the active from the login tab
        loginButton.classList.remove('active')
        // The div show password becomes visible
        showPasswordDiv.classList.remove('hidden')
        // Set the right route for the user
        form.action = '/register'
    }
}

// This function gets called whenever the user types a character in the confirmation password field
// We get the current value of both the password fields and then we compare them.
// Main features:
// - The submit button is disabled until the 2 passwords match, to prevent the backend from receiving bad data
// - The user gets an istant visual feedback from typing by switching classes on the fly

function checkIfPasswordAreTheSame() {
    password.value !== confirmationPassword.value
        ? (submit.classList.add('disabled'),
          passwordError.classList.remove('hidden'))
        : (submit.classList.remove('disabled'),
          (submit.disabled = false),
          (passwordError.innerText = 'Password Match!'),
          passwordError.classList.remove('text-danger'),
          passwordError.classList.add('text-success'))
}

// Iterates over the 2 password fields (HTML collection) and calls the function passwordVisibleInvisible
function passwordIteration(passwordFields) {
    for (let i = 0; i < passwordFields.length; i++) {
        passwordVisibleInvisible(passwordFields[i])
    }
}

// This function changes the type of input of the password field from text to password
function passwordVisibleInvisible(password) {
    password.type === 'password'
        ? (password.type = 'text')
        : (password.type = 'password')
}
function passwordValidator() {
    let lowercase = document.getElementById('lowercase')
    let uppercase = document.getElementById('uppercase')
    let number = document.getElementById('number')
    let specialChar = document.getElementById('specialCharacter')
    let charNumber = document.getElementById('charactersNumber')

    regex.lowercase.test(password.value) == true
        ? changePasswordRequirementsColor(lowercase, true)
        : changePasswordRequirementsColor(lowercase, false)
    regex.uppercase.test(password.value) == true
        ? changePasswordRequirementsColor(uppercase, true)
        : changePasswordRequirementsColor(uppercase, false)
    regex.numbers.test(password.value) == true
        ? changePasswordRequirementsColor(number, true)
        : changePasswordRequirementsColor(number, false)
    regex.specialchar.test(password.value) == true
        ? changePasswordRequirementsColor(specialChar, true)
        : changePasswordRequirementsColor(specialChar, false)

    regex.lengthCheck(String(password.value)) == true
        ? changePasswordRequirementsColor(charNumber, true)
        : changePasswordRequirementsColor(charNumber, false)
}

function showHidePasswordRequirements() {
    if (passwordRequirements.classList.contains('hidden')) {
        passwordRequirements.classList.remove('hidden')
    }
    return
}

function changePasswordRequirementsColor(singleRequirement, satisfied) {
    satisfied === true
        ? singleRequirement.classList.add('text-success')
        : singleRequirement.classList.remove('text-success')
}

export { form, submit, passwordError }
