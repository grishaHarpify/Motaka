const categoriesRouter = require('express').Router()

// Import Controller
const categoriesController = require('../controllers/categories.controller')

// Import middlewares //
// Validation


// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// --- middlewares end --- //

// Routes //
categoriesRouter.get('/', categoriesController.getAllCategories)
categoriesRouter.get('/:categoryId', pathIdValidation, categoriesController.getCategoryDataWithId)

module.exports = categoriesRouter


/**
 * @swagger
 * components:
 *  tags:
 *   - name: Categories
 *  securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:

 *   ConfirmCodeValidationSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Confirm code error!
 *     errorMessage:
 *      type: string
 *      example:
 *        - Request body must contain confirm code.
 *        - In first user must send the code to your phone number.
 *        - User send the wrong confirm code.
 *        - Confirm code valid time is expired.
 *        - User have already used this code to change/recover your password.
 *
 *   PasswordValidationSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Validation error!
 *     errorMessages:
 *      type: array
 *      example:
 *       [
 *        "Password is required field.",
 *        "No spaces are allowed in the password.",
 *        "Password must contain from 8 to 25 symbols.",
 *        "Password must contain minimum one capital letter, minimum one small letter, minimum one number and minimum one special symbol like [#$@!%&*?=+-].",
 *        "Password confirmation does not match with password."
 *       ]
 *
 *   ForgotPasswordSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 94 785868
 *
 *   ResetPasswordSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 77 630905
 *     confirmCode:
 *      type: string
 *      example: 158694
 *     password:
 *      type: string
 *      example: Aa7777777++
 *     passwordConfirm:
 *      type: string
 *      example: Aa7777777++
 *
 *   LoginSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 94 785868
 *     password:
 *      type: string
 *      example: Aa7777777++
 *
 *   LoginValidationSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Validation error!
 *     errorMessages:
 *      type: array
 *      example:
 *       [
 *        "Phone number field cannot be left blank.",
 *        "Incomplete or incorrect phone number. Phone number must be in format like (+374 xx xxxxxx).",
 *        "Password filed cannot be left blank."
 *       ]
 *
 *   IncorrectLoginDataSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Incorrect data error!
 *     errorMessage:
 *      type: string
 *      example: User have entered an incorrect phone and/or password.
 *
 *   ResetRoleSchema:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Validation error!
 *     errorMessages:
 *      type: array
 *      example:
 *       [
 *        "User must send role (only 'user' or 'provider').",
 *        "Role can be only 'user' or 'provider'."
 *       ]
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


// ===== categories =====
/**
 * @swagger
 * /categories:
 *  get:
 *   tags: [Categories]
 *	  description: Get categories
 *	  responses:
 *    200:
 *	    description: Categories in data array
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           count:
 *            type: number
 *            example: Categories count
 *           data:
 *            type: array
 *            example:
 *              [
 *                {'hi'}
 *              ]
 *    500:
 *	    description: Server side error
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           errorType:
 *            type: string
 *            example: Server side error!
 *           errorMessage:
 *            type: string
 *            example: ...
 *
 */

// ===== categories/:categoryId =====
/**
 * @swagger
 * /categories/{categoryId}:
 *  get:
 *   tags: [Categories]
 *   description: Get data about category with given id
 *   parameters:
 *   - name: categoryId
 *     in: path
 *     description: Id of the category to get data.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *       description: Comments received successfully.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              _id: 
 *                type: string
 *                example: 627bc0d775b8d002007772a1
 *              name:
 *                type: string
 *                example: petWalking
 *              subCategories:
 *                type: array
 *                items: string
 *                example: 
 *                  [
 *                    "dogWalking",
 *                    "catWalking"
 *                  ]
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
 *              example: Category with such ID does not exist.
 *     409:
 *       description: Conflict. ID does not match rules.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: ID does not match rules.
 *              errorMes: ID passed in must be a string of 12 bytes or a string of 24 hex characters.
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

