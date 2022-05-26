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
authRouter.post('/register',
  validateRoleProvider,
  validateRoleUser,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.register)

// Phone number verification
authRouter.post('/verify_phone',
  checkConfirmCode,
  authController.phoneVerification)

// Send phone to get code to change password
authRouter.post('/forgot_password',
  validateLoginPhone,
  validationErrorHandler,
  authController.getPhoneToResetPassword)

// Send code and reset password
authRouter.patch('/reset_password',
  checkConfirmCode,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.resetPassword)

// Resend confirm code
authRouter.post('/resend_code',
  authController.resendConfirmCode)

// Login with phone
authRouter.post('/login',
  validateLoginPhone,
  isPasswordEmpty,
  validationErrorHandler,
  authController.loginWithPhone)

// Google login
authRouter.post('/googleLogin',
  authController.loginWithGoogle)

//Facebook login
authRouter.post('/facebookLogin',
  authController.loginWithFacebook)

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
 *   - name: Forgot password
 *   - name: Login and select role
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
 *      example: +374 77 630905
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
 *
 *   RegistrationValidationSchema:
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
 *
 *   VerifyPhoneSchema:
 *    type: object
 *    properties:
 *     phone:
 *      type: string
 *      example: +374 77 630905
 *     confirmCode:
 *      type: string
 *      example: 154896
 *
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
 *   ResetRoleValidationSchema:
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
 *      example: JWT error!
 *     errorMessage:
 *      type: string
 *      example:
 *        - Request must contain authorization header.
 *        - Wrong authorization token.
 *        - Authorization token is not valid.
 *        - Authorization token date is expired.
 */


// ===== register =====
/**
 * @swagger
 * /register:
 *  post:
 *   tags: [Registration and authentication]
 *	  description: New user registration
 *	  requestBody:
 *	   description: User personal data
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
 *	       $ref: '#/components/schemas/RegistrationValidationSchema'
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
 *    404:
 *	    description: Not found
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           errorType:
 *            type: string
 *            example: Incorrect data error!
 *           errorMessage:
 *            type: string
 *            example: User with such phone number does not exist.
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
 *   tags: [Forgot password]
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
 *	    description: Code was sended to the user phone number
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Password recovery code was sended on the user phone number.
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
 *    404:
 *	    description: Not found
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           errorType:
 *            type: string
 *            example: Incorrect data error!
 *           errorMessage:
 *            type: string
 *            example: User with such phone number does not exist.
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

// ===== reset_password =====
/**
 * @swagger
 * /reset_password:
 *  patch:
 *   tags: [Forgot password]
 *	  description: Reset password
 *	  requestBody:
 *	   description: User phone, confirmCode and new password
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/ResetPasswordSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/ResetPasswordSchema'
 *	  responses:
 *    200:
 *	    description: Password was changed successfully.
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Password was changed successfully.
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *         oneOf:
 *           - $ref: '#/components/schemas/ConfirmCodeValidationSchema'
 *           - $ref: '#/components/schemas/PasswordValidationSchema'
 *    404:
 *	    description: Not found
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           errorType:
 *            type: string
 *            example: Incorrect data error!
 *           errorMessage:
 *            type: string
 *            example: User with such phone number does not exist.
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

// ===== resend_code =====
/**
 * @swagger
 * /resend_code:
 *  post:
 *   tags: [Forgot password]
 *	  description: Resend code to the user phone number
 *	  requestBody:
 *	   description: User phone number
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *         properties:
 *           phone:
 *            type: string
 *            example: +374 77 630905
 *
 *	  responses:
 *    200:
 *	    description: A new code has been sent
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: A new confirm code has been sent to phone number.
 *    404:
 *	    description: Not found
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           errorType:
 *            type: string
 *            example: Incorrect data error!
 *           errorMessage:
 *            type: string
 *            example: User with such phone number does not exist.
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

// ===== login =====
/**
 * @swagger
 * /login:
 *  post:
 *   tags: [Login and select role]
 *	  description: Login
 *	  requestBody:
 *	   description: User phone and password
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/LoginSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/LoginSchema'
 *	  responses:
 *    200:
 *	    description: Login success
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Login success.
 *           accessToken:
 *            type: string
 *            example: eyJhbGciOiJI.yJ1c2VySWQiOiI2Mjd.51IDb0V_ql7BUXgAw8ryg
 *           availableRoles:
 *            type: array
 *            example:
 *              [
 *                "user",
 *                "provider"
 *              ]
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *         oneOf:
 *           - $ref: '#/components/schemas/LoginValidationSchema'
 *           - $ref: '#/components/schemas/IncorrectLoginDataSchema'
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

// ===== set_role =====
/**
 * @swagger
 * /set_role:
 *  post:
 *   tags: [Login and select role]
 *   security:
 *    - access-token: []
 *	  description: Change user active role
 *	  requestBody:
 *	   description: The role the user wants to switch to
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *         properties:
 *           role:
 *            type: string
 *            example: user
 *	  responses:
 *    200:
 *	    description: User active role was changed
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: User active role was changed to <roleName>.
 *    201:
 *	    description:  The user has create a new role
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: The user has create a new role <roleName> for himself and switched to it.
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/ResetRoleValidationSchema'
 *    401:
 *	    description: Unauthorized
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/VerifyJwtSchema'
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

