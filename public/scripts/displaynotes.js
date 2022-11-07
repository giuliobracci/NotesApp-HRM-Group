// Behaviour:
// The page begins with a template of card hidden [noteNode] that gets used as a dummy component
// for rendering all the note components since its complex nesting of divs
// 1. We get the notes the user has with fetch
// 2. We iterate through all the notes cloning the dummy component and assigning the new title and description
// 3. We render each note to the screen
// 4. We await for the user to submit a new note, then if response is 'ok'
//    we render to the screen along with a success message
// 5. If for some reason the server throws us an error, we render an error to the user

// Getting all the elements from the DOM
const noteNode = document.querySelector('#noteCardTemplate')
const injectionCardParent = document.getElementById('card-injection')
const noteTitle = document.getElementById('card-title')
const noteParagraph = document.getElementById('card-copy')
const submitNewNote = document.getElementById('add-note-button')
const alertMessage = document.createElement('div')
const titleForm = document.getElementById('title')
const copyForm = document.getElementById('copy')

// Preparing the alert messages with the role of alert and a default class of alert-danger
alertMessage.setAttribute('role', 'alert')
alertMessage.classList.add('alert', 'alert-danger')

// Fetch the notes of the user from the server with a GET request
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
    postData(url, options)
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
    // Extract the data of title and copy
    let noteData = {
        title: note.title,
        copy: note.copy,
    }
    // Note title and paragraph are 2 elements of the DUMMY hidden node
    // We assign the new title and copy to them
    noteTitle.innerText = noteData.title
    noteParagraph.innerText = noteData.copy
    // We clone the the dummy node and assign the copy to the newNote variable
    // TRUE tells the cloneNode function to clone also all of the children to keep the original layout
    let newNote = noteNode.cloneNode(true)
    // Remove the hidden class from the new note
    newNote.classList.remove('hidden')
    // Add the class for fade in transition
    newNote.classList.add('card-created')
    // Prepend the card into the injection target node
    injectionCardParent.prepend(newNote)
}

// -- POST NEW NOTE AND ERROR HANDLING --

// The function performs a POST request and then calls the renderResponseNewNote
async function postData(url, options) {
    await fetch(url, options)
        .then(response => response.json())
        .then(data => {
            renderResponseNewNote(data)
        })
}
// This function checks the JSON of the response status
// IF the status is 'ok' then will show a green alert message
// AND will call the insertNewCardContent to prepend the new note into the DOM
// ELSE if the we receive an error we'll print the error and render a
// danger alert at the top of the screen

function renderResponseNewNote(response) {
    response.status === 'ok'
        ? (alertMessage.classList.replace('alert-danger', 'alert-success'),
          (alertMessage.innerText = 'Note created succesfully'),
          document.body.prepend(alertMessage),
          insertNewCardContent(response),
          setTimeout(() => alertMessage.remove(), 2000))
        : (alertMessage.classList.replace('alert-success', 'alert-danger'),
          (alertMessage.innerHTML = response.message),
          document.body.prepend(alertMessage),
          setTimeout(() => alertMessage.remove(), 4000))
}
