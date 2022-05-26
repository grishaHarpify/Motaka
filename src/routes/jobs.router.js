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
jobsRouter.get('/:jobId', pathIdValidation, jobsController.getJobDataWithId)

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


/**
 * @swagger
 * components:
 *  tags:
 *   - name: Jobs
 *  securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *   JobDataSchema:
 *    type: object
 *    properties:
 *      data:
 *        type: object
 *        properties:
 *          salary:
 *            type: object
 *            properties:
 *              currency:
 *                type: string
 *                example: AMD
 *              cost:
 *                type: number
 *                example: 20000
 *          _id:
 *            type: string
 *            example: 6288a9715b7632fee1ed5a71
 *          startDate:
 *            type: string
 *            example: 2022-07-21T12:57:35
 *          duration:
 *            type: number
 *            example: 3
 *          address:
 *            type: string
 *            example: Xanjyan
 *          subCategories:
 *            type: array
 *            example:
 *              [
 *                subCategory1,
 *                subCategory2,
 *                ...
 *              ]
 *          userId:
 *            type: string
 *            example: 627cf6b741804e13edd4ab05
 *          status:
 *            type: enum
 *            example: open
 *
 *   VerifyJwtSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Validation error!
 *     errorMessage:
 *      type: string
 *      example:
 *        - Request must contain authorization header.
 *        - Wrong authorization token.
 *        - Authorization token is not valid.
 *        - Authorization token date is expired.
 */


// ===== jobs/ ===== (get all jobs ???)

// ===== jobs/:jobId =====
/**
 * @swagger
 * /jobs/{jobId}:
 *  get:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   description: Get data about job with given id
 *   parameters:
 *   - name: jobId
 *     in: path
 *     description: Id of the job to get data.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *	     description: Job data
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/JobDataSchema'
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
 *     404:
 *	     description: Not found
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Incorrect ID error!
 *             errorMessage:
 *              type: string
 *              example: Job with such ID does not exist.
 *     409:
 *       description: Conflict. ID does not match rules.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMessage:
 *                type: string
 *            example:
 *              error: ID does not match rules.
 *              errorMessage: ID passed in must be a string of 12 bytes or a string of 24 hex characters.
 *
 *     500:
 *	     description: Server side error
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Server side error!
 *             errorMessage:
 *              type: string
 *              example: ...
 *
 */

// ===== jobs ===== (post a job ???)
/**
 * @swagger
 * /jobs:
 *  post:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   description: Post a job
 *   parameters:
 *   - name: jobId
 *     in: path
 *     description: Id of the job to get data.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *	     description: Job data
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/JobDataSchema'
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *	        $ref: '#/components/schemas/VerifyJwtSchema'
 *     404:
 *	     description: Not found
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Incorrect ID error!
 *             errorMessage:
 *              type: string
 *              example: Job with such ID does not exist.
 *     409:
 *       description: Conflict. ID does not match rules.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMessage:
 *                type: string
 *            example:
 *              error: ID does not match rules.
 *              errorMessage: ID passed in must be a string of 12 bytes or a string of 24 hex characters.
 * 
 *     500:
 *	     description: Server side error
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Server side error!
 *             errorMessage:
 *              type: string
 *              example: ...
 *
 */