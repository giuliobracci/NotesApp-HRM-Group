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

// Endpoints for HTML GET requests

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
    // Get the email and password from the req object
    let email = req.body.email
    // Password gets encrypted
    let password = String(
        CryptoJS.SHA3(req.body.password, { outputLength: 224 })
    )
    try {
        // Try to execute the creation of the new user
        const responseDb = await User.create({ email, password })
    } catch (error) {
        // Catch error releated to user already in the database
        if (error.code === 11000) {
            // Return error
            return res.json({
                status: 'error',
                message: 'You are already registered, use login instead',
            })
            // Catch error for db down
        } else if (error.code === 11600 || error.code === 211) {
            return res.json({
                status: 'error',
                message: 'Database under manteniance, please try again later',
            })
        }
        // If other errors come from the db return generic error
        return res.json({ status: 'error', message: error })
    }
    // If all 'ok' create session and return JSON
    session = req.session
    session.email = req.body.email
    return res.json({
        status: 'ok',
        message: 'You are registered succesfully!',
    })
})

// Login route
app.post('/login', async (req, res) => {
    // Get the credentials from the request object
    const logUser = {
        email: req.body.email,
        // We encrypt the password using CryptoJS
        password: String(
            CryptoJS.SHA3(req.body.password, { outputLength: 224 })
        ),
    }
    try {
        // Try to contact the database for checking for user existance
        const responseDb = await User.findOne(logUser)
        // If user record isn't found
        if (responseDb === null) {
            // Return error
            return res.json({
                status: 'error',
                message:
                    'No user found with the entered credentials. Please check your password or email',
            })
        }
    } catch (error) {
        // Catching the error related to db down
        if (error.code === 11600 || error.code === 211) {
            return res.json({
                status: 'error',
                message: 'Database under manteniance, please try again later',
            })
        }
        // For other db-related error send out an error message
        return res.json({ status: 'error', message: error })
    }
    // If the user was found and no errors were detected in the db
    // Store the session and return a positive response
    session = req.session
    session.email = req.body.email
    return res.json({
        status: 'ok',
        message: 'You are logged in!',
    })
})

// Get JSON of all the notes the user has
app.get('/getnotes', async (req, res) => {
    // Db query to find all the notes the user has based on his mail
    // For future updates use the 'ID' instead of the email
    let userNotes = await Note.find({ email: session.email })

    // Stringify the JSON object
    let jsonUserNotes = JSON.stringify(userNotes)

    // Return the JSON
    res.send(jsonUserNotes)
})
// POST request for adding a new note
app.post('/addnotes', async (req, res) => {
    // Extract the note data from the request object
    let title = req.body.title
    let copy = req.body.copy
    let email = session.email

    // Check for empty title and description
    let checkNoTitleAndCopy =
        title === '' ||
        title === null ||
        (title === undefined && copy === '') ||
        copy === null ||
        copy === undefined
            ? true
            : false
    // If no title and copy found return error message
    if (checkNoTitleAndCopy === true) {
        return res.json({
            status: 'error',
            message:
                'Please fill both the title and the description form to create a new note',
        })
    }

    // Check for empty title
    let checkNoTitle =
        title === '' || title === null || title === undefined ? true : false

    // If no title return error message
    if (checkNoTitle === true) {
        return res.json({
            status: 'error',
            message: 'Please fill the title to create a new note',
        })
    }

    // Check for empty copy
    let checkNoCopy =
        copy === '' || copy === null || copy === undefined ? true : false

    // If no copy return error message
    if (checkNoCopy === true) {
        return res.json({
            status: 'error',
            message: 'Please fill the description to create a new note',
        })
    }

    // Try to create the note in the database
    try {
        await (resultDb = Note.create({ title, copy, email }))
    } catch (error) {
        // If the error code is releated to db down return message
        if (error.code === 11600 || error.code === 211) {
            return res.json({
                status: 'error',
                message: 'Database under manteniance, please try again later',
            })
        } // For other db releated errors render an error message
        return res.json({
            status: 'error',
            message:
                'There was an error creating your note. Please try again later or login again',
        })
    }

    // No errors found return 'ok' response with the note created
    return res.json({ status: 'ok', title: title, copy: copy })
})
