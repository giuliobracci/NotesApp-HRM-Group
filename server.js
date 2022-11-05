const express = require('express')
const moongose = require('mongoose')
const Note = require('./models/note')
const User = require('./models/user')
const Key = '4352538'
const CryptoJS = require('crypto-js')
const oneDay = 1000 * 60 * 60 * 24
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const { response } = require('express')
var session = null
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))
app.use(
    sessions({
        secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
)
app.use(cookieParser())
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

// Database Connection
moongose.connect(
    'mongodb+srv://giuliobracci:Grosseto_12@notesapp.4e96h8j.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

// Endpoints for HTML

// Landing page
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
})
// Page after registration
app.get('/add', (req, res) => {
    res.sendFile('public/add.html', { root: __dirname })
})

// Page to displaynotes
app.get('/displaynotes', (req, res) => {
    res.sendFile('public/displaynotes.html', { root: __dirname })
})

// Endpoints for API //

// Registration route

app.post('/register', async (req, res) => {
    let email = req.body.email
    let password = encrypt(req.body.password)
    try {
        const responseDb = await User.create({ email, password })
    } catch (error) {
        if (error.code === 11000) {
            return res.json({
                status: 'error',
                message: 'You are already registered, use login instead',
            })
        }
        return res.json({ status: 'error', message: error })
    }
    return res.json({
        status: 'ok',
        message: 'You are registered succesfully!',
    })
})

// Login route
app.post('/login', (req, res) => {
    const logUser = {
        email: req.body.email,
        password: encrypt(req.body.password),
    }
    // If no user found
    !User.find(logUser)
        ? res.status(404).json({
              succes: false,
              message: 'No user found with the entered credentials',
          })
        : ((session = req.session),
          (session.email = req.body.email),
          res.sendFile('public/displaynotes.html', { root: __dirname }))
})

// Display notes
app.get('/getnotes', async (req, res) => {
    let userNotes = await Note.find({ email: session.email })
    console.log(userNotes)
    let jsonUSerNotes = JSON.stringify(userNotes)
    res.send(jsonUSerNotes)
})

app.post('/addnotes', async (req, res) => {
    newNote = {
        title: req.body.title,
        copy: req.body.copy,
        email: session.email,
    }

    Note.create(newNote)
    let userNotes = await Note.find({ email: session.email })

    res.sendFile('public/displaynotes.html', { root: __dirname })
})

// HELPERS & UTILITIES //

// Encrypt the user password using CryptoJS
function encrypt(password) {
    const ciphertext = CryptoJS.AES.encrypt(password, Key).toString()
    return ciphertext
}

// Decrypt the user password using CryptoJS
function decrypt(password) {
    const bytes = CryptoJS.AES.decrypt(password, Key)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
}
