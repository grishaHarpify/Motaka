const homeRouter = require('express').Router()

// Import Controller
const homeController = require('../controllers/job.controller')

// Import middlewares //
const verifyJWT = require('../middlewares/verifyJWT')
const { isProvider, isUser } = require('../middlewares/checkRole')

// Job data validation
const {
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateCost,
  validateAddress,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler
} = require('../middlewares/jobInfoValidation')

// ID validation
const idValidation = require('../middlewares/validateId')

// --- middlewares end --- //


// Routes // 
// Get job data with id
homeRouter.get('/:id',
  idValidation,
  // verifyJWT, isUser,
  homeController.getJobDataWithId)

// Create new job [USER]
homeRouter.post('/',
  verifyJWT, isUser,
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateCost,
  validateAddress,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
  homeController.createNewJob)

// Edit job 
homeRouter.patch('/:id',
  idValidation,
  verifyJWT,
  homeController.editJobWithId)


module.exports = homeRouter
