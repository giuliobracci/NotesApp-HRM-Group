// ----------------- DOM ELEMENTS ----------------- //
const noteNode = document.querySelector('#noteCardTemplate')
const injectionCardParent = document.getElementById('card-injection')
const noteID = document.getElementById('dummy')
const noteTitle = document.getElementById('card-title')
const noteParagraph = document.getElementById('card-copy')
const submitNewNote = document.getElementById('add-note-button')
const alertMessage = document.createElement('div')
const titleForm = document.getElementById('title')
const copyForm = document.getElementById('copy')

// Preparing the alert messages with the role of alert and a default class of alert-danger
alertMessage.setAttribute('role', 'alert')
alertMessage.classList.add('alert')

/* prettier-ignore */
export { injectionCardParent, noteNode, submitNewNote, noteID, noteTitle, noteParagraph, alertMessage, titleForm, copyForm}
