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
const { checkPhoneConfirmCode, checkEmailConfirmCode } = require('../middlewares/checkConfirmCode')

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

// Send code to phone
authRouter.post('/send_code_phone',
  validateLoginPhone,
  validationErrorHandler,
  authController.sendConfirmCodeToPhoneNumber)

// Phone number verification
authRouter.post('/verify_phone',
  validateLoginPhone,
  validationErrorHandler,
  checkPhoneConfirmCode,
  authController.phoneVerification)

// Send code to mail
authRouter.post('/send_code_email',
  validateEmail,
  validationErrorHandler,
  authController.sendConfirmCodeToEmail)

// Email verification
authRouter.post('/verify_email',
  validateEmail,
  validationErrorHandler,
  checkEmailConfirmCode,
  authController.emailVerification)

// Send code and reset password
authRouter.patch('/reset_password',
  checkPhoneConfirmCode,
  validateLoginPhone, // this is not only for login
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  authController.resetPassword)

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
authRouter.post('/set_role',
  verifyJWT,
  validateResetRole,
  validationErrorHandler,
  authController.setActiveRole)

module.exports = authRouter


/**
 * @swagger
 * components:
 *  tags:
 *   - name: Registration and Forgot password
 *   - name: Verification
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
 *   VerifyEmailSchema:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: example@mail.ru
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
 *        - In first user must send the code.
 *        - User send the wrong confirm code.
 *        - Confirm code valid time is expired.
 *        - User have already used this code.
 *        - User phone number (or email) already verified.
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
 *   tags: [Registration and Forgot password]
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

// ===== reset_password =====
/**
 * @swagger
 * /reset_password:
 *  patch:
 *   tags: [Registration and Forgot password]
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

// ===== send_code_phone =====
/**
 * @swagger
 * /send_code_phone:
 *  post:
 *   tags: [Verification]
 *	  description: Send code to user phone number
 *	  requestBody:
 *	   description: User phone number
 *	   required: true
 *	   content:
 *	     application/json:
 *       schema:
 *         properties:
 *           phone:
 *            type: string
 *            example: +374 77 659516
 *
 *	  responses:
 *    200:
 *	    description: Success
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Confirm code was sent on the user phone number.
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
 *
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
 *   tags: [Verification]
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
 *    200:
 *	    description: Phone verified
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: User sent right code and phone number has been verified.
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

// ===== send_code_email =====
/**
 * @swagger
 * /send_code_email:
 *  post:
 *   tags: [Verification]
 *	  description: Send code to user email
 *	  requestBody:
 *	   description: User email
 *	   required: true
 *	   content:
 *	     application/json:
 *       schema:
 *         properties:
 *           email:
 *            type: string
 *            example: example@mail.ru
 *
 *	  responses:
 *    200:
 *	    description: Success
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Confirm code was sent on the user email.
 *
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
 *             "Email is required field.",
 *             "Invalid email format."
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
 *            example: User with such email does not exist.
 *
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

// ===== verify_email =====
/**
 * @swagger
 * /verify_email:
 *  post:
 *   tags: [Verification]
 *	  description: User email verification
 *	  requestBody:
 *	   description: User email and confirm code
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/VerifyEmailSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/VerifyEmailSchema'
 *	  responses:
 *    200:
 *	    description: Email verified
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: User sent right code and email has been verified.
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
 *            example: User with such email does not exist.
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
 *           refreshToken:
 *            type: string
 *            example: eyJhbGciOiJI.yJ1c2VySWQiOiI2Mjd.51IDsaoijdsql7BUXgAw8ryg
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

// ===== login with google =====
/**
 * @swagger
 * /googleLogin:
 *  post:
 *   tags: [Login and select role]
 *	  description: Login with google
 *	  requestBody:
 *	   description: tokenId from google
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      properties:
 *          tokenId:
 *            type: string
 *            example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4ZjM4ODM0NjhmYzY1OWFiYjQ0NzVmMzYzMTNkMjI1ODVjMmQ3Y2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjcyNTk5MzY0MzY1LXRwZjNmNG9rcjEycTRsYThzdTF2cmRoaGQ4Z21zbTJmLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjcyNTk5MzY0MzY1LXRwZjNmNG9rcjEycTRsYThzdTF2cmRoaGQ4Z21zbTJmLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA3MTcyMDg2NjQwODA5MTM0MzI0IiwiZW1haWwiOiJncmlzaGEuaG92aGFueWFuMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJqbjdCX2xpd1V2cTVWVGtfTUNJVkVRIiwibmFtZSI6IkdyaXNoYSBIb3ZoYW55YW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKd0dmMkRUMHFSdFM2RFB0M1p0WlFSeDdUUkJGTTZEdGd4Y3ZGZ089czk2LWMiLCJnaXZlbl9uYW1lIjoiR3Jpc2hhIiwiZmFtaWx5X25hbWUiOiJIb3ZoYW55YW4iLCJsb2NhbGUiOiJydSIsImlhdCI6MTY1MzkxMjcxNiwiZXhwIjoxNjUzOTE2MzE2LCJqdGkiOiIzODgyODhmZDYxMTZmN2Q1YjQ1NzUzMzZjMGQ1NmRjZmI4NTNiMDM1In0.BMc3dH1MgCAt14lwgakEk5T4OB7rB8cnaswuzQ-kGCfahDQQ6yhc815zYe5N4_2XskJ8umMQgln8Hvm9NWE-85QuK1pAhKkDkkxVuw6240b9eOmhK7hVoJrs_wHQs_E5CBR5liSohC8qFZgy6vwei3Xg6T-Nw2pTmH8KS0faApVXjP6sD0IIV_DJUmmGT_HGlGFDEXqNlllTD1tbwYzL8wtlcSAzpJEC9YpDoHs0oL_ofig1RnxYMk5SapnobDngEBwvSE9M8JXDVH8qf72c4QyPZyJwDMq3DEnRbaVLqCe-riu7S25x3-6BVpaa27ONwYGz6BQkEzNFLGIM2TRAuQ
 *	  responses:
 *    200:
 *	    description: Login with google success
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Login with google success.
 *           accessToken:
 *            type: string
 *            example: eyJhbGciOiJI.yJ1c2VySWQiOiI2Mjd.51IDb0V_ql7BUXgAw8ryg
 *           refreshToken:
 *            type: string
 *            example: eyJhbGciOiJI.yJ1c2VySWQiOiI2Mjd.51IDsaoijdsql7BUXgAw8ryg
 *           availableRoles:
 *            type: array
 *            example:
 *              [
 *                "user",
 *                "provider"
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

// ===== login with facebook =====
/**
 * @swagger
 * /facebookLogin:
 *  post:
 *   tags: [Login and select role]
 *	  description: Login with facebook
 *	  requestBody:
 *	   description: accessToken and userId from facebook
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      properties:
 *          accessToken:
 *            type: string
 *            example: EAAHqE9JbimwBALh2GnZCUbDIgDcrF69rUdDjGibF1ITD015ZC6BtZANkOqBApeZCzZBhg8ovPZBU55hdv1DToaZCZAd40fUfVss7c1xevQGWTPCXNDGIExK4Wqhhm4YJDReQ5QWqxpxkI45uI2o1BZBpMZCARzu9h63tM8gIO1bCuAkqETUQimRZAhv37CfeEn2xXHIsuTJ8fYTv3aet1udNs2v
 *          userId:
 *            type: string
 *            example: 785256359114348
 *	  responses:
 *    200:
 *	    description: Login with facebook success
 *	    content:
 *	     application/json:
 *       schema:
 *         properties:
 *           message:
 *            type: string
 *            example: Login with facebook success.
 *           accessToken:
 *            type: string
 *            example: eyJhbGciOiJI.yJ1c2VySWQiOiI2Mjd.51IDb0V_ql7BUXgAw8ryg
 *           refreshToken:
 *            type: string
 *            example: eyJhbGciOiJI.yJ1c2VySWQiOiI2Mjd.51IDsaoijdsql7BUXgAw8ryg
 *           availableRoles:
 *            type: array
 *            example:
 *              [
 *                "user",
 *                "provider"
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

