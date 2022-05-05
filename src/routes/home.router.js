const homeRouter = require('express').Router()


// Import middlewares //
const verifyJWT = require('../middlewares/verifyJWT')
const { isProvider, isUser } = require('../middlewares/checkRole')

// Validation
const {
  validateStartDate,
  validateDuration,
  jobValidationErrorHandler
} = require('../middlewares/jobInfoValidation')

// --- middlewares end --- //

// Import Controllers
const homeController = require('../controllers/home.controller')


// Routes // 
homeRouter.post('/new_job',
  verifyJWT, isProvider,
  validateStartDate,
  validateDuration,
  jobValidationErrorHandler, homeController.createNewJob)


module.exports = homeRouter
