// Getting all the elements from the DOM
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
alertMessage.classList.add('alert', alertClassName)

// Fetch the notes of the user from the server with a GET request
document.onload()
fetch('/getnotes')
    .then(response => response.json())
    .then(data => renderNotes(data))

// Listening for a new note submission
submitNewNote.addEventListener('click', () => {
    // We do a snapshot of the current value of title and description of the form
    let title = titleForm.value
    let copy = copyForm.value
    let url = '/addnotes'

    // Object with the data to POST
    data = { title: title, copy: copy }
    // Options for the POST request
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
    }
    // We call the postData function with the url and the options
    sendData(url, options)
})

// Function to inject the notes into the DOM
function renderNotes(notes) {
    // If the user has more than one note we iterate through the array
    notes.length > 1
        ? notes.forEach(element => {
              insertNewCardContent(element)
          })
        : // Else we pick just the first element
          insertNewCardContent(notes[0])
}

// Insert new card content takes 1 note at the time and performs the prepend into the DOM
function insertNewCardContent(note) {
    // Extract the data of id, title and copy
    let noteData = {
        id: note._id,
        title: note.title,
        copy: note.copy,
    }

    // Note id, title and paragraph are 3 elements of the DUMMY hidden node
    // We assign the new note id, title and copy to them
    noteID.id = noteData.id
    noteTitle.innerText = noteData.title
    noteParagraph.innerText = noteData.copy

    // We clone the the dummy node and assign the copy to the newNote variable
    // TRUE tells the cloneNode function to clone also all of the children to keep the original layout
    let newNote = noteNode.cloneNode(true)
    // Remove the hidden class from the new note
    newNote.classList.remove('hidden')
    // Add the class for fade in transition
    newNote.classList.add('card-created')
    newNote.addEventListener(
        'keyup',
        delay(function (event) {
            modifyNote(event)
        }, 3000)
    )

    // Prepend the card into the injection target node
    injectionCardParent.prepend(newNote)
}

// This debouncing function delays the triggering of the event handler until the user has finished typing
function delay(callback, ms) {
    var timer = 0
    return function () {
        var context = this,
            args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            callback.apply(context, args)
        }, ms || 0)
    }
}

// This function extracts the new note informations after the user has finished typing
function modifyNote(event) {
    let id = event.path[2].children[0].firstElementChild.id
    let url = `/notes/${id}`

    let modifiedNote = {
        id: id,
        title: event.path[2].children[0].innerText,
        copy: event.path[2].children[1].innerText,
    }

    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedNote),
    }
    sendData(url, options)
}

// The function performs a request and then calls the renderResponseNewNote
async function sendData(url, options) {
    await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            renderResponseVisualFeedback(data, url)
        })
}

// This function checks the JSON of the response status
// IF the status is 'ok' then will show a green alert message
// AND will call the insertNewCardContent to prepend the new note into the DOM
// ELSE if the we receive an error we'll print the error and render a
// danger alert at the top of the screen

function renderResponseVisualFeedback(response, url) {
    alertMessage.innerHTML = response.message
    response.status !== 'ok'
        ? alertMessage.classList.replace('alert-success', 'alert-danger')
        : alertMessage.classList.replace('alert-danger', 'alert-success')
    url === '/addnotes' ? insertNewCardContent(response) : ''

    document.body.prepend(alertMessage)

    setTimeout(() => alertMessage.remove(), 4000)
}
