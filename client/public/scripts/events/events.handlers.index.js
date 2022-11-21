/* prettier-ignore */
import { getRequestOptions, sendRequest } from '../helpers/helpers.requests.js'
/* prettier-ignore */
import { setActive, setDisabled, setEnabled, setHidden, setInactive, setVisible, setUnchecked, renderResponseMessage, removeAlertBadge} from '../helpers/helpers.ui.js'
/* prettier-ignore */
import { registerBtn, loginBtn, form, submit, registerElements, passwordError, inputs, regex, showPasswordButton, alertMessage } from '../dom/index.js'

// Form state variables
let formState = 'login'
let passwordRequirementsMet = false
let passwordMatch = false

// This function handles the switch between register and login
function switchForm(event) {
    formState = changeState(event)
    resetForm(inputs, form, showPasswordButton)

    formState === 'login'
        ? ((form.action = '/login'),
          setHidden(registerElements),
          setHidden(passwordError),
          setInactive(registerBtn),
          setActive(loginBtn))
        : ((form.action = '/register'),
          setVisible(registerElements),
          setInactive(loginBtn),
          setActive(registerBtn))
}

function checkIfPasswordAreTheSame(password, confirmationPassword) {
    passwordMatch =
        password === confirmationPassword &&
        password !== '' &&
        confirmationPassword !== ''
            ? true
            : false
    passwordMatch === false
        ? setVisible(passwordError)
        : setHidden(passwordError)
}
// This function sets the password fields visible or invisible
function passwordVisibleInvisible(passwords) {
    Array.from(passwords).forEach(password => {
        password.type === 'password'
            ? (password.type = 'text')
            : (password.type = 'password')
    })
}
// This function checks the password against regex expression to check the validity
function passwordValidator() {
    if (formState === 'login') {
        return
    }
    let lowercase = document.getElementById('lowercase')
    let uppercase = document.getElementById('uppercase')
    let number = document.getElementById('number')
    let specialChar = document.getElementById('specialCharacter')
    let charNumber = document.getElementById('charactersNumber')

    regex.lowercase.test(form.password.value) == true
        ? changeReqColor(lowercase, true)
        : changeReqColor(lowercase, false)

    regex.uppercase.test(form.password.value) == true
        ? changeReqColor(uppercase, true)
        : changeReqColor(uppercase, false)

    regex.numbers.test(form.password.value) == true
        ? changeReqColor(number, true)
        : changeReqColor(number, false)

    regex.specialchar.test(form.password.value) == true
        ? changeReqColor(specialChar, true)
        : changeReqColor(specialChar, false)

    regex.lengthCheck(String(form.password.value)) == true
        ? changeReqColor(charNumber, true)
        : changeReqColor(charNumber, false)

    regex.all.test(form.password.value) == false
        ? (passwordRequirementsMet = true)
        : (passwordRequirementsMet = false)
}
// This function changes the requirement of the password text color
function changeReqColor(singleRequirement, satisfied) {
    satisfied === true
        ? singleRequirement.classList.add('text-success')
        : singleRequirement.classList.remove('text-success')
}
// Checks if the form is submitable based on the formState
function isSubmitable() {
    formState === 'register'
        ? form.email.value !== '' &&
          passwordRequirementsMet === true &&
          passwordMatch === true
            ? setEnabled(submit)
            : setDisabled(submit)
        : form.email.value !== '' && form.password.value !== ''
        ? setEnabled(submit)
        : setDisabled(submit)
}
// Function that returns from the event if the user has choosed to login or register
function changeState(event) {
    return event.target.id === 'btn-login' ? 'login' : 'register'
}
// Function to handle the submitting of the form
async function handleSubmit(email, password, url) {
    let method = 'POST'
    let options = getRequestOptions(method, { email, password })
    let data = await sendRequest(url, options, method)
    renderResponseMessage(alertMessage, data.message, data.status)
    handleRedirectRefresh(data.status)
}

function handleRedirectRefresh(status) {
    setTimeout(() => {
        removeAlertBadge(alertMessage)
        status === 'ok'
            ? formState === 'login'
                ? window.location.assign('/displaynotes')
                : window.location.assign('/add')
            : window.location.reload()
    }, 1000)
}

// Function to reset the form fields and checkbox
function resetForm(inputs, form, showPassword) {
    inputs.forEach(element => (element.value = ''))
    form.password.type = 'password'
    form.confirmationPassword.type = 'password'
    setUnchecked(showPassword)
}
/* prettier-ignore */
export { switchForm, checkIfPasswordAreTheSame, passwordVisibleInvisible, passwordValidator, isSubmitable, handleSubmit, passwordRequirementsMet, formState }
