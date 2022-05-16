const userRouter = require('express').Router()

// Import Controller
const userController = require('../controllers/user.controller')

// Import middlewares //
// Validation


// --- middlewares end --- //

// Routes //
userRouter.patch('/rating', userController.userRating)

module.exports = userRouter
