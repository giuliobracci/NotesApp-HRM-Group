const User = require('../models/user')
const CryptoJS = require('crypto-js')

const registerUser = async (req, res) => {
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
}

const loginUser = async (req, res) => {
    console.log(req.body)
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
}

const logoutUser = (req, res) => {
    // remove the req.user property and clear the login session
    req.logout()

    // destroy session data
    req.session = null
    session = null

    // redirect to homepage
    res.redirect('/')
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}
