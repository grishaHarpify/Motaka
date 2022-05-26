const categoriesRouter = require('express').Router()

// Import Controller
const categoriesController = require('../controllers/categories.controller')

// Import middlewares //
// Validation


// ID validation
const { pathIdValidation } = require('../middlewares/IDValidation')

// --- middlewares end --- //

// Routes //
categoriesRouter.get('/',
  categoriesController.getAllCategories)

categoriesRouter.get('/:categoryId',
  pathIdValidation,
  categoriesController.getCategoryDataWithId)

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
 *   CategoryDataSchema:
 *    type: object
 *    properties:
 *      data:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            example: 627bc0d775b8d002007772a1
 *          name:
 *            type: string
 *            example: cleaning
 *          subCategories:
 *            type: array
 *            example:
 *              [
 *                subCategory1,
 *                subCategory2,
 *                ...
 *              ]
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


// ===== categories =====
/**
 * @swagger
 * /categories:
 *  get:
 *   tags: [Categories]
 *	  description: Get categories
 *	  responses:
 *    200:
 *	    description: All categories
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
 *                {
 *                  id: categoryId,
 *                  name: cleaning,
 *                  subCategories: ['subCat', 'subCat2']
 *                },
 *                ...
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
 *       description: Category data
 *       content:
 *         application/json:
 *          schema:
 *           $ref: '#/components/schemas/CategoryDataSchema'
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

