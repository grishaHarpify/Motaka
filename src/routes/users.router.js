const usersRouter = require('express').Router()

// Import Controller
const userController = require('../controllers/users.controller')

// Import middlewares //
// Data validation
const {
  validateBalanceMoney,
  validationErrorHandler
} = require('../middlewares/userInfoValidation')

// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// Verify JWT
const verifyJWT = require('../middlewares/verifyJWT')

// --- middlewares end --- //

// Routes //
// Get user with header token
usersRouter.get('/me',
  verifyJWT,
  userController.getUserDataWithToken)

usersRouter.patch('/me/balance',
  verifyJWT,
  validateBalanceMoney,
  validationErrorHandler,
  userController.changeUserBalance)

// Get user by id
usersRouter.get('/:userId',
  pathIdValidation,
  userController.getUserDataWithId)



module.exports = usersRouter



/**
 * @swagger
 * components:
 *  tags:
 *   - name: Users
 *  securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *   UserDataSchema:
 *    type: object
 *    properties:
 *      data:
 *        type: object
 *        properties:
 *          role:
 *            type: object
 *            properties:
 *              isProvider:
 *                type: boolean
 *                example: true
 *              isUser:
 *                type: boolean
 *                example: false
 *          _id:
 *            type: string
 *            example: 627bc28ec41bad89e03a45cd
 *          firstName:
 *            type: string
 *            example: Keanu
 *          lastName:
 *            type: string
 *            example: Reeves
 *          email:
 *            type: string
 *            example: example@mail.ru
 *          phone:
 *            type: string
 *            example: +374 77 594859
 *          avatar:
 *            type: string
 *            example: href
 *
 *   MeDataSchema:
 *    type: object
 *    properties:
 *      data:
 *        type: object
 *        properties:
 *          role:
 *            type: object
 *            properties:
 *              isProvider:
 *                type: boolean
 *                example: true
 *              isUser:
 *                type: boolean
 *                example: false
 *          _id:
 *            type: string
 *            example: 627bc28ec41bad89e03a45cd
 *          firstName:
 *            type: string
 *            example: Keanu
 *          lastName:
 *            type: string
 *            example: Reeves
 *          email:
 *            type: string
 *            example: example@mail.ru
 *          phone:
 *            type: string
 *            example: +374 77 594859
 *          balance:
 *            type: number
 *            example: 150000
 *          activeRole:
 *            type: string
 *            example: provider
 *          isEmailVerified:
 *            type: boolean
 *            example: true
 *          isPhoneVerified:
 *            type: boolean
 *            example: false
 *          avatar:
 *            type: string
 *            example: href
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

// ===== users/me =====
/**
 * @swagger
 * /users/me:
 *  get:
 *   tags: [Users]
 *   security:
 *    - access-token: []
 *   description: Get data about user with token
 *   responses:
 *     200:
 *	     description: User data
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/MeDataSchema'
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
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

// ===== users/me/balance =====
/**
 * @swagger
 * /users/me/balance:
 *  patch:
 *   tags: [Users]
 *   security:
 *    - access-token: []
 *   description: Change user balance
 *	  requestBody:
 *	   description: Money to add to balance
 *	   required: true
 *	   content:
 *	    application/json:
  *       schema:
 *         properties:
 *           money:
 *            type: number
 *            example: 15000
 *   responses:
 *     200:
 *	     description: Balance successfully changed
 *	     content:
 *	       application/json:
 *         schema:
 *          properties:
 *            message:
 *              type: string
 *              example: Balance successfully changed.
 *
 *     400:
 *	     description: Bad request
 *	     content:
 *	       application/json:
 *         schema:
 *          properties:
 *            errorType:
 *              type: string
 *              example: Validation error!
 *            errorMessages:
 *              type: array
 *              example:
 *                [
 *                  Money field cannot be left blank.,
 *                  Money must be positive number greater or equal than 500.,
 *                ]
 *
 *     401:
 *	     description: Unauthorized
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/VerifyJwtSchema'
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

// ===== users/:userId =====
/**
 * @swagger
 * /users/{userId}:
 *  get:
 *   tags: [Users]
 *   description: Get data about user with given id
 *   parameters:
 *   - name: userId
 *     in: path
 *     description: Id of the user to get data.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *	     description: User data
 *	     content:
 *	       application/json:
 *         schema:
 *          $ref: '#/components/schemas/UserDataSchema'
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
 *              example: User with such ID does not exist.
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
