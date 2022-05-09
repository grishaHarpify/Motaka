const homeRouter = require('express').Router()


// Import middlewares //
const verifyJWT = require('../middlewares/verifyJWT')
const { isProvider, isUser } = require('../middlewares/checkRole')

// Validation
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

// --- middlewares end --- //

// Import Controllers
const homeController = require('../controllers/job.controller')

// Routes // 

// Get job data with id
homeRouter.get('/:jobId',
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
homeRouter.patch('/:jobId',
  verifyJWT,
  homeController.editJobWithId)


module.exports = homeRouter
