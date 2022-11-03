// Select the elements from the DOM:
// The login button, the register button, the container of the password confirmation
const registerLoginButtons = document.querySelectorAll("#register-login");
const loginButton = document.getElementById("btn-login");
const registerButton = document.getElementById("btn-register");
const form = document.getElementById("form");
const passwordConfirmationContainer = document.getElementById(
  "pwd-confirmation-container"
);

// Add the eventListener to the buttons of login and register
registerLoginButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    switchForm(e);
  })
);

// This function handles the switch between register and login form by
// adding and removing the hidden class

function switchForm(event) {
  event.target.id === loginButton.id
    ? (passwordConfirmationContainer.classList.add("hidden"),
      (form.action = "./login"))
    : (passwordConfirmationContainer.classList.remove("hidden"),
      (form.action = "./register"));
}
