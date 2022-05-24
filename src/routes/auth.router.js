const authRouter = require('express').Router()

// Import Controller
const authController = require('../controllers/auth.controller')

// Import middlewares //
// Validation
const {
  validateLoginPhone,
  isPasswordEmpty,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateResetRole,
  validateRoleUser,
  validateRoleProvider,
  validationErrorHandler,
} = require('../middlewares/userInfoValidation')

// Check confirm code right or no
const checkConfirmCode = require('../middlewares/checkConfirmCode')

// VerifyJWT
const verifyJWT = require('../middlewares/verifyJWT')

// --- middlewares end --- //

// Routes //
// Register
authRouter.post(
  '/register',
  validateRoleProvider,
  validateRoleUser,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.register
)

// Phone number verification
authRouter.post(
  '/verify_phone',
  checkConfirmCode,
  authController.phoneVerification
)

// Send phone to get code to change password
authRouter.post(
  '/forgot_password',
  validateLoginPhone,
  validationErrorHandler,
  authController.getPhoneToResetPassword
)

// Send code and reset password
authRouter.patch(
  '/reset_password',
  checkConfirmCode,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.resetPassword
)

// Resend confirm code
authRouter.post('/resend_code', authController.resendConfirmCode)

// Login with phone
authRouter.post(
  '/login',
  validateLoginPhone,
  isPasswordEmpty,
  validationErrorHandler,
  authController.loginWithPhone
)

// Google login
authRouter.post('/googleLogin', authController.loginWithGoogle)

//Facebook login
authRouter.post('/facebookLogin', authController.loginWithFacebook)

// Set user active role (select page)
authRouter.post(
  '/set_role',
  verifyJWT,
  validateResetRole,
  validationErrorHandler,
  authController.setActiveRole
)

module.exports = authRouter


/**
 * @swagger
 * components:
 *  tags:
 *   - name: Registration and authentication
 *  securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *  schemas:
 *   RegistrationSchema:
 *    type: object
 *    properties:
 *     firstName:
 *      type: string
 *      example: Keanu
 *     lastName:
 *      type: string
 *      example: Reeves
 *     phone:
 *      type: string
 *      example: +374 94 785868
 *     email:
 *      type: string
 *      example: example@mail.ru
 *     password:
 *      type: string
 *      example: Aa7777777++
 *     passwordConfirm:
 *      type: string
 *      example: Aa7777777++
 *     isUser:
 *      type: boolean
 *      example: true
 *     isProvider:
 *      type: boolean
 *      example: false
 *   RegistrationValidationErrors:
 *    type: object
 *    properties:
 *     errorType:
 *      type: string
 *      example: Validation error!
 *     errorMessages:
 *      type: array
 *      example:
 *       [
 *        "First name is required field.",
 *        "Invalid email format.",
 *        "Password must contain from 8 to 25 symbols.",
 *        "Password confirmation does not match with password.",
 *        "isUser filed must be boolean(true or false).",
 *        "One of isUser or isProvider fields must be true."
 *       ]
 *   VerifyPhoneSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 77 630905
 *     confirmCode:
 *      type: string
 *      example: 154896
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
 *   ForgotPasswordSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 94 785868
 *   LoginSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 94 785868
 *     password:
 *      type: string
 *      example: Aa7777777++
 *   LoginValidationErrors:
 *    type: object
 *    properties:
 *     errors:
 *      type: array
 *      items:
 *       type: string
 *    example:
 *     {
 *      "errors": [
 *       "email is not valid",
 *       "password must contain from 6 to 32 symbols"
 *      ]
 *     }
 *   LoginResponseSchema:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *     access-token:
 *      type: string
 *     refresh-token:
 *      type: string
 *    example:
 *     {
 *      "message": "Login successfully completed",
 *      "access-token": "",
 *      "refresh-token": ""
 *     }
 */


// ===== register =====
/**
 * @swagger
 * /register:
 *  post:
 *   tags: [Registration and authentication]
 *	  description: New user registration
 *	  requestBody:
 *	   description: User's personal data
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/RegistrationSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/RegistrationSchema'
 *	  responses:
 *    201:
 *	    description: Created
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Registration success. Confirm code was sended in user phone number.
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/RegistrationValidationErrors'
 *    409:
 *	    description: Conflict
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Such phone/email already registered.
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

// ===== verify_phone =====
/**
 * @swagger
 * /verify_phone:
 *  post:
 *   tags: [Registration and authentication]
 *	  description: User phone number verification
 *	  requestBody:
 *	   description: User phone number and confirm code
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/VerifyPhoneSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/VerifyPhoneSchema'
 *	  responses:
 *    201:
 *	    description: Phone verified
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: User send right code and phone number has been verified.
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/ConfirmCodeValidationSchema'
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

// ===== forgot_password =====
/**
 * @swagger
 * /forgot_password:
 *  post:
 *   tags: [Registration and authentication]
 *	  description: Forgot password 
 *	  requestBody:
 *	   description: User phone number
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/ForgotPasswordSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/ForgotPasswordSchema'
 *	  responses:
 *    200:
 *	    description: Created
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Registration success. Confirm code was sended in user phone number.
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *         type: object
 *         properties:
 *          errorType:
 *           type: string
 *           example: Validation error!
 *          errorMessages:
 *           type: array
 *           example:
 *            [
 *             "Phone number field cannot be left blank.",
 *             "Incomplete or incorrect phone number. Phone number must be in format like (+374 xx xxxxxx)."
 *            ]  
 *    409:
 *	    description: Conflict
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Such phone/email already registered.
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





