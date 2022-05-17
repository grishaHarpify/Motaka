const usersRouter = require('express').Router()

// Import Controller
const userController = require('../controllers/users.controller')

// Import middlewares //
// Validation

// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// --- middlewares end --- //

// Routes //
usersRouter.get('/:userId', pathIdValidation, userController.getUserDataWithId)

module.exports = usersRouter
