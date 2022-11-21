import { submitNewNote, titleForm, copyForm } from '../dom/displaynotes.js'
import { renderNotes } from './events.handlers.displaynotes.js'
/* prettier-ignore */
import { sendGetRequest, getRequestOptions, sendRequest } from '../helpers/helpers.requests.js'

window.addEventListener('load', async () => {
    const userNotes = await sendGetRequest('/getnotes')
    renderNotes(userNotes)
})

// Listening for a new note submission
submitNewNote.addEventListener('click', async function () {
    // We do a snapshot of the current value of title and description of the form
    let url = '/addnotes'
    // Object with the data to POST
    let data = { title: titleForm.value, copy: copyForm.value }
    // Options for the POST request
    let options = getRequestOptions('POST', data)
    // We call the postData function with the url and the options
    let response = await sendRequest(url, options)
    console.log(response)
    renderNotes(response)
})
