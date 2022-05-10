const jobsRouter = require('express').Router()

// Import Controller
const jobsController = require('../controllers/jobs.controller')

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
jobsRouter.get('/:id',
  idValidation,
  // verifyJWT, isUser,
  jobsController.getJobDataWithId)

// Create new job [USER]
jobsRouter.post('/',
  verifyJWT, isUser,
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateCost,
  validateAddress,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
  jobsController.createNewJob)

// Edit job 
jobsRouter.patch('/:id',
  idValidation,
  verifyJWT,
  jobsController.editJobWithId)


module.exports = jobsRouter
