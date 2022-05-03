const rootRouter = require('express').Router()
const passport = require('passport')

/* Import middlewares */
// Validation
const {
  validateLoginPhone,
  isPasswordEmpty,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler
} = require('../middlewares/userInfoValidation')
const checkConfirmCode = require('../middlewares/checkConfirmCode')

// IsAuthenticated 
const check = require('../middlewares/isAuthenticated') // Check authentication status

/* --- middlewares end --- */

// Import Controllers
const rootController = require('../controllers/root.controller')

// Restore password routes
rootRouter.post('/forgot_password',
  validateLoginPhone,
  validationErrorHandler, rootController.getPhoneToResetPassword)
rootRouter.patch('/reset_password',
  checkConfirmCode,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler, rootController.resetPassword)
rootRouter.post('/resend_code', rootController.resendConfirmCode)

// Below this middleware routes which is accessible only unauthorized users
rootRouter.use(check.notAuthenticated)

/* Login routes */
// Login with facebook
rootRouter
  .get('/facebook',
    passport.authenticate('facebook', { authType: 'reauthenticate', scope: 'email' }))
  .get('/facebook/verify',
    passport.authenticate('facebook', {
      successMessage: 'Login with facebook success.',
      failureMessage: 'Login with facebook failed.'
    }))

// Login with google
rootRouter
  .get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }))
  .get('/google/verify',
    passport.authenticate('google', {
      successMessage: 'Login with  google success.',
      failureMessage: 'Login with google failed.'
    }))

// Login with phone
rootRouter
  .post('/login',
    validateLoginPhone,
    isPasswordEmpty,
    validationErrorHandler,
    rootController.loginWithPhone)

/* --- login-end --- */


module.exports = rootRouter
