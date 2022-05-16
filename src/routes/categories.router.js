const categoriesRouter = require('express').Router()

// Import Controller
const categoriesController = require('../controllers/categories.controller')

// Import middlewares //
// Validation


// ID validation
const idValidation = require('../middlewares/IDValidation')

// --- middlewares end --- //

// Routes //
categoriesRouter.get('/', categoriesController.getAllCategories)
categoriesRouter.get('/:categoryId', idValidation, categoriesController.getCategoryDataWithId)

module.exports = categoriesRouter
