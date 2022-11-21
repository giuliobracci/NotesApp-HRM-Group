// ----------------- DOM ELEMENTS ----------------- //

const registerBtn = document.getElementById('btn-register')
const loginBtn = document.getElementById('btn-login')
const registerLoginBtn = [registerBtn, loginBtn]
const form = document.getElementById('form')
const showPasswordButton = document.getElementById('showPassword')
const submit = document.getElementById('submit')
const registerElements = document.getElementById('register-elements')
const passwordError = document.getElementById('passwordError')
const inputs = [form.email, form.password, form.confirmationPassword]
const passwordRequirements = document.getElementById(
    'form-password-requirements'
)
const alertMessage = document.createElement('div')
alertMessage.setAttribute('role', 'alert')
alertMessage.classList.add('alert')

// Regex object for performing the check of the password requirements
const regex = {
    lowercase: new RegExp('[a-z]'),
    uppercase: new RegExp('[A-Z]'),
    numbers: new RegExp('[0-9]'),
    specialchar: new RegExp('[^A-Za-z0-9]'),
    all: new RegExp('^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$'),
    lengthCheck(password) {
        if (password.length >= 8 && password.length <= 32) {
            return true
        }
        return false
    },
}

/* prettier-ignore */
export {
    registerLoginBtn, loginBtn, registerBtn, showPasswordButton, form, submit,
    registerElements, passwordError, inputs, passwordRequirements, regex, alertMessage
}
