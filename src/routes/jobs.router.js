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
  validateDescription,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
} = require('../middlewares/jobInfoValidation')

const { isProvider, isUser } = require('../middlewares/checkRole')

// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// QueryFilter
const { getAllJobsQueryFilter } = require('../middlewares/filterRequestQuery')

// Verification
const checkVerification = require('../middlewares/checkVerification')

// --- middlewares end --- //

// Routes //
jobsRouter.get('/',
  isProvider,
  getAllJobsQueryFilter,
  jobsController.getAllJobs)

// Get job data with id
jobsRouter.get('/:jobId',
  pathIdValidation,
  jobsController.getJobDataWithId)

// Verification middlewares
// jobsRouter.use(
//   checkVerification.isPhoneVerified,
//   checkVerification.isEmailVerified)

// Create new job 
jobsRouter.post('/',
  isUser,
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateSalaryCost,
  validateAddress,
  validateDescription,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
  jobsController.createNewJob)

// Edit job
jobsRouter.patch('/:jobId',
  isUser,
  pathIdValidation,
  validateStartDate,
  validateStartTime,
  validateDuration,
  validateSalaryCost,
  validateAddress,
  validateDescription,
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler,
  jobsController.editJobWithId)

// Add new applicant to job
jobsRouter.post('/:jobId/candidate',
  isProvider,
  pathIdValidation,
  jobsController.addJobNewCandidate)

// Cancel job
jobsRouter.delete('/:jobId',
  isUser,
  pathIdValidation,
  jobsController.cancelJob)

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
 *   AllJobsSchema:
 *    type: object
 *    properties:
 *      next:
 *        type: object
 *        properties:
 *          page:
 *            type: number
 *            example: 3
 *          limit:
 *            type: number
 *            example: 15
 *      previous:
 *        type: object
 *        properties:
 *          page:
 *            type: number
 *            example: 1
 *          limit:
 *            type: number
 *            example: 20
 *      data:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            salary:
 *              type: object
 *              properties:
 *                currency:
 *                  type: string
 *                  example: AMD
 *                cost:
 *                  type: number
 *                  example: 20000
 *            _id:
 *              type: string
 *              example: 6288a9715b7632fee1ed5a71
 *            startDate:
 *              type: string
 *              example: 2022-07-21T12:57:35
 *            duration:
 *              type: number
 *              example: 3
 *            address:
 *              type: string
 *              example: Xanjyan
 *            description:
 *              type: string
 *              example: Hi from arpify
 *            category:
 *              type: string
 *              example: petWalking
 *            subCategories:
 *              type: array
 *              example:
 *                [
 *                  subCategory1,
 *                  subCategory2,
 *                  ...
 *                ]
 *            userId:
 *              type: string
 *              example: 627cf6b741804e13edd4ab05
 *            status:
 *              type: enum
 *              example: inProgress
 *
 *   NewJobSchema:
 *    type: object
 *    properties:
 *      startDate:
 *        type: string
 *        example: 2023-03-23
 *      startTime:
 *        type: string
 *        example: 13:13:13
 *      duration:
 *        type: number
 *        example: 3
 *      salary:
 *        type: number
 *        example: 17077
 *      address:
 *        type: string
 *        example: Xanjyan
 *      description:
 *        type: string
 *        example: Hi from arpify
 *      category:
 *        type: string
 *        example: cleaning
 *      subCategories:
 *        type: array
 *        example:
 *          [
 *            subCategory1,
 *            subCategory2,
 *             ...
 *          ]
 *
 *   GetJobDataSchema:
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
 *          description:
 *            type: string
 *            example: Hi from arpify
 *          category:
 *            type: string
 *            example: petWalking
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
 *   NoOpenStatusSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Job status error!
 *     errorMessage:
 *      type: string
 *      example: Job status is no longer open.
 *
 *   JobValidationSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Validation error!
 *     errorMessages:
 *      type: array
 *      example:
 *       [
 *        "Job start date is required field.",
 *        "Job start time must be in format like (hh:mm:ss): Ex. 15:30:00",
 *        "Duration field must be a number that indicates the job duration in hour [Except 0].",
 *        "Job salary is required field.",
 *        "Job category is required field. Allowed job categories: ([cleaning] [repairing] [plumbing] [petWalking] [ironing])"
 *       ]
 *
 *   VerifyJwtSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: JWT error!
 *     errorMessage:
 *      type: string
 *      example:
 *        - Request must contain authorization header.
 *        - Wrong authorization token.
 *        - Authorization token is not valid.
 *        - Authorization token date is expired.
 */


// ===== jobs/ ===== 
/**
 * @swagger
 * /jobs:
 *  get:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   parameters:
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *          example: 2
 *        description: Jobs count that needed to skip
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          example: 15
 *        description: Jobs count in one page
 *      - in: query
 *        name: salcost[gte]
 *        schema:
 *          type: integer
 *          example: 10000
 *        description: Jobs minimal cost
 *      - in: query
 *        name: salcost[lte]
 *        schema:
 *          type: integer
 *          example: 25000
 *        description: Jobs maximal cost
 *      - in: query
 *        name: caties
 *        schema:
 *          type: string
 *          example: petWalking,cleaning
 *        description: Jobs categories
 *      - in: query
 *        name: date[gte]
 *        schema:
 *          type: string
 *          example: 2022-05-05
 *        description: Jobs startDate must be after ...
 *      - in: query
 *        name: date[lte]
 *        schema:
 *          type: string
 *          example: 2023-05-05
 *        description: Jobs startDate must be before ...
 *      - in: query
 *        name: dur
 *        schema:
 *          type: string
 *          example: 1,5
 *        description: Job duration from 0 to 6 ( 0 indicates ALL ).
 *
 *   description: All jobs with advanced search
 *   responses:
 *     200:
 *	     description: All jobs
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/AllJobsSchema'
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

// ===== jobs/:jobId ===== get
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
 *          $ref: '#/components/schemas/GetJobDataSchema'
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

// ========== Must be verified ==========
// ===== jobs ===== post
/**
 * @swagger
 * /jobs:
 *  post:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   description: Post a new job
 *	  requestBody:
 *	   description: New job data
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/NewJobSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/NewJobSchema'
 *   responses:
 *     201:
 *	     description: Job successfully created
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             message:
 *              type: string
 *              example: Job successfully created.
 *             jobId:
 *              type: string
 *              example: 627f8488fc247861eb2a4467
 *     400:
 *	     description: Bad request
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/JobValidationSchema'
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
 *     403:
 *	     description: Forbidden
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Forbidden!
 *             errorMessage:
 *              type: string
 *              example:
 *                - Only users with a verified phone number have access in this route.
 *                - Only users with a verified email have access in this route.
 *                - Only users with an active role [user] have access in this route.
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

// ===== jobs/:jobId ===== patch
/**
 * @swagger
 * /jobs/{jobId}:
 *  patch:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   description: Edit existing job data
 *	  requestBody:
 *	   description: Job new data
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/NewJobSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/NewJobSchema'
 *   parameters:
 *   - name: jobId
 *     in: path
 *     description: Id of the job what need to edit.
 *     required: true
 *     type: id
 *
 *   responses:
 *     200:
 *	     description: Job successfully edited.
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             message:
 *              type: string
 *              example: Job successfully edited.

 *     400:
 *	     description: Bad request
 *	     content:
 *	       application/json:
 *         schema:
 *          oneOf:
 *           - $ref: '#/components/schemas/JobValidationSchema'
 *           - $ref: '#/components/schemas/NoOpenStatusSchema'
 *
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
 *
 *     403:
 *	     description: Forbidden
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Forbidden!
 *             errorMessage:
 *              type: string
 *              example:
 *                - Only users with a verified phone number have access in this route.
 *                - Only users with a verified email have access in this route.
 *                - Only users with an active role [user] have access in this route.
 *                - The user is not the creator of this job.
 *
 *
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

// ===== jobs/:jobId/candidate ===== post
/**
 * @swagger
 * /jobs/{jobId}/candidate:
 *  post:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   description: Become new candidate on job
 *   parameters:
 *   - name: jobId
 *     in: path
 *     description: Id of the job in which needed to add new candidate.
 *     required: true
 *     type: id
 *
 *   responses:
 *     200:
 *	     description: Candidate successfully added
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             message:
 *              type: string
 *              example: Provider [ID] have been successfully added to the list of candidates for this job [ID].
 *
 *     400:
 *	     description: Bad request
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Incorrect status error!
 *             errorMessage:
 *              type: string
 *              example: This job [Id] is not open. Service provider cannot become candidate for a job that is not open.
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
 *
 *     403:
 *	     description: Forbidden
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Forbidden!
 *             errorMessage:
 *              type: string
 *              example:
 *                - Only users with a verified phone number have access in this route.
 *                - Only users with a verified email have access in this route.
 *                - Only users with an active role [provider] have access in this route.
 *                - Service provider cannot become a job candidate if he/she is the creator of that job.
 *                - Service provider cannot become a same job candidate more then one time.
 *
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

// ===== jobs/:jobId ===== patch
/**
 * @swagger
 * /jobs/{jobId}:
 *  delete:
 *   tags: [Jobs]
 *   security:
 *    - access-token: []
 *   description: Cancel job
 *   parameters:
 *   - name: jobId
 *     in: path
 *     description: Id of the job what need to cancel.
 *     required: true
 *     type: id
 *
 *   responses:
 *     200:
 *	     description: Job successfully canceled.
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             message:
 *              type: string
 *              example: 
 *                - Job already canceled.
 *                - Job [ID] was canceled.
 *
 *     400:
 *	     description: Bad request
 *	     content:
 *	       application/json:
 *         schema:
 *          oneOf:
 *           - $ref: '#/components/schemas/JobValidationSchema'
 *           - $ref: '#/components/schemas/NoOpenStatusSchema'
 *
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
 *
 *     403:
 *	     description: Forbidden
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             errorType:
 *              type: string
 *              example: Forbidden!
 *             errorMessage:
 *              type: string
 *              example: 
 *                - Only users with a verified phone number have access in this route.
 *                - Only users with a verified email have access in this route.
 *                - Only users with an active role [user] have access in this route.
 *                - Job creator ID and logged in user ID does not match. The creator of this work is not logged in user.
 *
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
 * 
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



