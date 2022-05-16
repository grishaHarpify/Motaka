const categoriesRouter = require('express').Router()

// Import Controller
const categoriesController = require('../controllers/categories.controller')

// Import middlewares //
// Validation


// --- middlewares end --- //

// Routes //
categoriesRouter.get('/', categoriesController.getAllCategories)


module.exports = categoriesRouter
