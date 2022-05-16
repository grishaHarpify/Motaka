const usersRouter = require('express').Router()

// Import Controller
const userController = require('../controllers/users.controller')

// Import middlewares //
// Validation

// ID validation
const idValidation = require('../middlewares/IDValidation')

// --- middlewares end --- //

// Routes //
usersRouter.get('/:userId', idValidation, userController.getUserDataWithId)

module.exports = usersRouter
