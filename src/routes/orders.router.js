const ordersRouter = require('express').Router()

// Import Controller
const ordersController = require('../controllers/orders.controller')

// Import middlewares //
const { isProvider, isUser } = require('../middlewares/checkRole')


// ID validation
const { bodyIdValidation } = require('../middlewares/IDValidation')


// --- middlewares end --- //

// Routes //
ordersRouter.post('/',
  bodyIdValidation,
  ordersController.createNewOrder)



module.exports = ordersRouter
