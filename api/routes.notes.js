const express = require('express')
const noteController = require('../controllers/controller.notes')
const router = express.Router()
const path = require('path')

// Get JSON of all the notes the user has
router.get('/getnotes', noteController.displayNotes)

// POST request for adding a new note
router.post('/addnotes', noteController.addNote)

router.put('/notes/:id', noteController.modifyNote)
module.exports = router
