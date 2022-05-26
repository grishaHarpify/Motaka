const usersRouter = require('express').Router()

// Import Controller
const userController = require('../controllers/users.controller')

// Import middlewares //
// Validation

// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// --- middlewares end --- //

// Routes //
usersRouter.get('/:userId', pathIdValidation, userController.getUserDataWithId)

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
