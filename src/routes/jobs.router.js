const jobsRouter = require('express').Router()

// Import Controller
const jobsController = require('../controllers/jobs.controller')

// Import middlewares //

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


const { isProvider, isUser } = require('../middlewares/checkRole')

// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// QueryFilter
const { getAllJobsQueryFilter } = require('../middlewares/filterRequestQuery')

// --- middlewares end --- //

// Routes //
jobsRouter.get('/',
  isProvider,
  getAllJobsQueryFilter,
  jobsController.getAllJobs)

// Get job data with id
jobsRouter.get(
  '/:jobId',
  pathIdValidation,
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
jobsRouter.patch('/:jobId',
  isUser,
  pathIdValidation,
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateSalaryCost,
  validateAddress,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
  jobsController.editJobWithId)

// Add new applicant to job
jobsRouter.post('/:jobId/candidate', isProvider, pathIdValidation, jobsController.addJobNewCandidate)

// Cancel job
jobsRouter.delete('/:jobId', isUser, pathIdValidation, jobsController.cancelJob)

module.exports = jobsRouter
