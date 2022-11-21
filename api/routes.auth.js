const express = require('express')
const authController = require('../controllers/controller.auth')
const router = express.Router()

// Registration route
router.post('/register', authController.registerUser)
// Login route
router.post('/login', authController.loginUser)
// Logout
router.get('/logout', authController.logoutUser)

module.exports = router
