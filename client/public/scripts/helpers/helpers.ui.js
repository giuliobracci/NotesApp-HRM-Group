const renderResponseMessage = (alertElement, message, status) => {
    alertElement.innerHTML = message
    addAlertBadge(alertElement)
    status === 'ok'
        ? alertElement.classList.add('alert-success')
        : alertElement.classList.add('alert-danger')
}
const addAlertBadge = element => {
    document.body.prepend(element)
    setTimeout(() => removeAlertBadge(element), 2000)
}
const removeAlertBadge = element => {
    element.remove()
}
const setDisabled = element => {
    element.classList.add('disabled')
}
const setEnabled = element => {
    element.classList.remove('disabled')
}
const setHidden = element => {
    element.classList.add('hidden')
}
const setVisible = element => {
    element.classList.remove('hidden')
}
const setActive = element => {
    element.classList.add('active')
}
const setInactive = element => {
    element.classList.remove('active')
}
const setUnchecked = element => {
    element.checked = false
}
/* prettier-ignore */
export { addAlertBadge, removeAlertBadge, setDisabled, setEnabled, setHidden, setVisible, setActive, setInactive, setUnchecked, renderResponseMessage }
