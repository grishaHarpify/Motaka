const jwtRouter = require('express').Router()

// Import Controller
const jwtController = require('../controllers/jwt.controller')



jwtRouter.post('/refresh',
  jwtController.getRefreshReturnPair)

module.exports = jwtRouter

/**
 * @swagger
 * components:
 *  tags:
 *   - name: JWT
 *  securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *   test:
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
 */

/**
 * @swagger
 * /jwt/refresh:
 *  post:
 *   tags: [JWT]
 *   description: Send refresh token and get new access and refresh tokens
 *	  requestBody:
 *	   description: Refresh token
 *	   required: true
 *	   content:
 *	     application/json:
 *       schema:
 *         properties:
 *           refreshToken:
 *             type: string
 *             example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXCJ9.eyJ1c2VySWQiOiI2MjkY2E2MWU4MTEzNmY1YjU3OTcyOGYiLCJpYXQiOjE2NTM2NTcxMjYsImV4cCI6MTY1NDI2MTkyNn0.SgGPtXMCc68oU1oeuBJVyLK-4DPCqfEZJbX_IM5T-g 
 *
 *   responses:
 *     201:
 *	     description: New access and refresh tokens
 *	     content:
 *	       application/json:
 *         schema:
 *           properties:
 *             accessToken:
 *              type: string
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX9.eyJ1c2VySWQiOiI2Y2E2MWU4MTEzNmY1YjU3OTcyOGYiLCJpYXQiOjE2NTM2NTc0OTEsImV4cCI6MTY1MzY3NTQ5MX0.0iT8aLZV-dG3cL673S3GyroKYH3uDQaU-6NZtKG
 *             refreshToken:
 *              type: string
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV9.eyJ1c2VySWQiOiI2MkwY2E2MWU4MTEzNmY1YjU3OTcyOGYiLCJpYXQiOjE2NTM2NTc0OTEsImV4cCI6MTY1NDI2MjI5MX0.knt7zINga4Z3QxNl0KdrTyBaOSI6Udf-s9HCE6s
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
 *              example: Only users with an active role [user] have access in this route.
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
