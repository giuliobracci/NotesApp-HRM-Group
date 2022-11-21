/* prettier-ignore */
import { switchForm, checkIfPasswordAreTheSame, passwordVisibleInvisible, passwordValidator, passwordRequirementsMet, isSubmitable, handleSubmit } from './events.handlers.index.js'
/* prettier-ignore */
import {form, inputs, registerLoginBtn, submit, passwordRequirements } from '../dom/index.js'
import { setVisible, setHidden } from '../helpers/helpers.ui.js'

// ------------- EVENT LISTENERS ------------- //

// Add the event listener for showing or hiding the
// password requirements under the input password field
form.password.addEventListener('keyup', () => {
    passwordRequirementsMet === false
        ? setVisible(passwordRequirements)
        : setHidden(passwordRequirements)
})
// Add the event listener for firing the password validator
form.password.addEventListener('keyup', passwordValidator)

// Add the event listener for firing the password vs confirmation password check
form.confirmationPassword.addEventListener('keyup', () => {
    checkIfPasswordAreTheSame(
        form.password.value,
        form.confirmationPassword.value
    )
})
// Add the event listener for the click on show password
form.showPassword.addEventListener('click', () => {
    passwordVisibleInvisible([form.password, form.confirmationPassword])
})
// Add the event listener to check if the form is submitable
inputs.forEach(input => input.addEventListener('keyup', () => isSubmitable()))
// Add the eventListener to the buttons of login and register
registerLoginBtn.forEach(button =>
    button.addEventListener('click', event => {
        switchForm(event)
    })
)
// Listen for form submit
submit.addEventListener('click', () => {
    handleSubmit(form.email.value, form.password.value, form.action)
})
