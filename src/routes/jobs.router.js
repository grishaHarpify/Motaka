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
  validateSalaryCost,
  validateAddress,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
} = require('../middlewares/jobInfoValidation')

// ID validation
const idValidation = require('../middlewares/IDValidation')

// QueryFilter
const { filterGetAllJobsQuery } = require('../middlewares/filterRequestQuery')

// --- middlewares end --- //

// Routes //
jobsRouter.get('/',
  filterGetAllJobsQuery,
  jobsController.getAllJobs)

// Get job data with id
jobsRouter.get(
  '/:id',
  idValidation,
  jobsController.getJobDataWithId
)

// Create new job [USER]
jobsRouter.post(
  '/',
  isUser,
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateSalaryCost,
  validateAddress,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
  jobsController.createNewJob
)

// Edit job
jobsRouter.patch('/:id', idValidation, verifyJWT, jobsController.editJobWithId)

module.exports = jobsRouter
