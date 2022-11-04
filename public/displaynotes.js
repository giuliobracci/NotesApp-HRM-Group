const taskList = document.getElementById("taskList");
// Fetch the notes from the API 
fetch('/getnotes')
  .then((response) => response.json())
  .then((data) => createCard(data)) ;
  
 // Function to inject the array of notes in the DOM 
function createCard(data) {
  data.forEach((element) => {
    // Create a new object "note"
    let note = {
      "title": element.title,
      "copy": element.copy
    }
    // Create the new HTML elements
    let newCard = document.createElement("li");
    let newTitle = document.createElement("h4");
    let newDescription = document.createElement("p");

    newCard.classList.add("list-group-item");

    // Inject the text of notes into the new HTML elements
    newTitle.innerText = note.title;
    newDescription.innerText = note.copy;
    // Append the li to the ul and the title and description to the li
    taskList.appendChild(newCard);
    newCard.appendChild(newTitle);
    newCard.appendChild(newDescription);

  }); 
}

