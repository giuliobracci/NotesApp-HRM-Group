const express = require("express");
const moongose = require("mongoose");
const Note = require("./models/note");
const User = require("./models/user");
const CryptoJS = require("crypto-js");
const Key = "4352538";

//const session = require("express-session");
//const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

let mail = "";

//app.use(session({ resave: true, saveUninitialized: true }));
//app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

// Database Connection
moongose.connect(
  "mongodb+srv://giuliobracci:Grosseto_12@notesapp.4e96h8j.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Endpoints for HTML

// Landing page
app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});
// Page after registration
app.get("/firstnote", (req, res) => {
  res.sendFile("public/firstnote.html", { root: __dirname });
});

// Page after registration
app.get("/displaynotes", (req, res) => {
  res.sendFile("public/displaynotes.html", { root: __dirname });
});

// Endpoints for API //

// Registration route
app.post("/register", async (req, res) => {
  // Extract the variables from the request
  let email = req.body.email;
  let password = encrypt(req.body.password);

  // Create record in the database
  User.create({ email, password });

  // Return response
  res.redirect("/firstnote.html");
});

// Login route
app.post("/login", async (req, res) => {
  // Query the database for the login request
  let user = await User.findOne(req.body);
  // If no user found
  if (!user) {
    res.status(404).json({
      succes: false,
      message: "No user found with the entered credentials",
    });
    res.redirect("/");
  }
  res
    .status(200)
    .json({ succes: true, user: { email: user.email }, message: "User found" });
  res.redirect("/displaynotes");
});

// Display notes
app.post("/getnotes", (req, res) => {
  const { userToken } = req.body;
});

app.post("/addnotes", (req, res) => {
  console.log(req);
});

// HELPERS & UTILITIES //

// Encrypt the user password using CryptoJS
function encrypt(password) {
  const ciphertext = CryptoJS.AES.encrypt(password, Key).toString();
  return ciphertext;
}

// Decrypt the user password using CryptoJS
function decrypt(password) {
  const bytes = CryptoJS.AES.decrypt(password, Key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
