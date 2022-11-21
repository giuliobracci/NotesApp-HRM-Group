const express = require('express')
const moongose = require('mongoose')
const path = require('path')
const Key = '4352538'
const oneDay = 1000 * 60 * 60 * 24
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const authRoutes = require('./api/routes.auth')
const noteRoutes = require('./api/routes.notes.js')

// Database Connection
moongose.connect(
    'mongodb+srv://giuliobracci:Grosseto_12@notesapp.4e96h8j.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

var session = null
const app = (module.exports = express())
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/client/public/'))
app.use(cookieParser())
app.use(
    sessions({
        secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
)

app.use(authRoutes)
app.use(noteRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

// Endpoints for HTML GET requests

// Landing page
app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './client/public/pages'),
    })
})
// Page after registration
app.get('/add', (req, res) => {
    res.sendFile('add.html', {
        root: path.join(__dirname, './client/public/pages'),
    })
})

// Page to displaynotes
app.get('/displaynotes', (req, res) => {
    res.sendFile('displaynotes.html', {
        root: path.join(__dirname, './client/public/pages'),
    })
})
