const rootRouter = require('express').Router()
const passport = require('passport')

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
const checkConfirmCode = require('../middlewares/checkConfirmCode')

// VerifyJWT
const verifyJWT = require('../middlewares/verifyJWT')

// IsAuthenticated
// const check = require('../middlewares/isAuthenticated') // Check authentication status

// --- middlewares end --- //

// Import Controllers
const rootController = require('../controllers/root.controller')


// Routes //
// Send phone to get code to change password
rootRouter.post(
  '/forgot_password',
  validateLoginPhone,
  validationErrorHandler,
  rootController.getPhoneToResetPassword
)

// Send code and reset password
rootRouter.patch(
  '/reset_password',
  checkConfirmCode,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler,
  rootController.resetPassword
)

// Resend confirm code
rootRouter.post('/resend_code', rootController.resendConfirmCode)

// PhoneVerification code
rootRouter.post(
  '/phone_verification_code',
  checkConfirmCode,
  rootController.phoneVerificationCode
)

// Register
rootRouter.post(
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
  rootController.register
)

// Login with facebook
rootRouter
  .get('/facebook',
    passport.authenticate('facebook', {
      authType: 'reauthenticate',
      scope: 'email',
    }))
  .get('/facebook/verify',
    passport.authenticate('facebook', {
      successMessage: 'Login with facebook success.',
      failureMessage: 'Login with facebook failed.',
    }))

// Login with google
rootRouter
  .get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
  )
  .get('/google/verify',
    passport.authenticate('google', {
      successMessage: 'Login with  google success.',
      failureMessage: 'Login with google failed.',
    })
  )

// Login with phone
rootRouter.post(
  '/login',
  validateLoginPhone,
  isPasswordEmpty,
  validationErrorHandler,
  rootController.loginWithPhone
)

// Set user active role (select page)
rootRouter.post(
  '/set_role',
  verifyJWT,
  validateResetRole,
  validationErrorHandler,
  rootController.setActiveRole
)

module.exports = rootRouter
