const Note = require('../models/note')

const displayNotes = async (req, res) => {
    // Db query to find all the notes the user has based on his mail
    // For future updates use the 'ID' instead of the email
    let userNotes = await Note.find({ email: session.email })

    // Stringify the JSON object
    let jsonUserNotes = JSON.stringify(userNotes)

    // Return the JSON
    res.send(jsonUserNotes)
}

const addNote = async (req, res) => {
    // Extract the note data from the request object
    let title = req.body.title
    let copy = req.body.copy
    let email = session.email
    let resultDb = ''

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
        resultDb = await Note.create({ title, copy, email })
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
    return res.json({
        status: 'ok',
        _id: resultDb._id,
        title: title,
        copy: copy,
    })
}

const modifyNote = async (req, res) => {
    let { id } = req.params

    let notefind = await Note.findByIdAndUpdate(
        id,
        {
            title: req.body.title,
            copy: req.body.copy,
        },
        function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                return res.json({ status: 'ok', message: 'Note updated!' })
            }
        }
    ).clone()
}

module.exports = {
    displayNotes,
    addNote,
    modifyNote,
}
