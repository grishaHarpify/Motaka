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

// PhoneVerification code
authRouter.post(
  '/phone_verification_code',
  checkConfirmCode,
  authController.phoneVerificationCode
)

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
