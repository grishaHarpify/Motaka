const { body, validationResult } = require('express-validator')

// For login data validation
const validateLoginPhone = body('phone') // check [phone] filed empty or not
  .not()
  .isEmpty()
  .withMessage('Phone number field cannot be left blank.')
  .matches(/^\+374\s\d{2}\s\d{6}$/)
  .withMessage(
    'Incomplete or incorrect phone number. Phone number must be in format like (+374 xx xxxxxx).'
  )

const isPasswordEmpty = body('password') // check [password] filed empty or not
  .not()
  .isEmpty()
  .withMessage('Password filed cannot be left blank.')

// User data validation
const validateFirstName = body('firstName')
  .not()
  .isEmpty()
  .withMessage('First name is required field.')
  .matches(/^[a-zA-Z\s\.]{2,20}$/)
  .withMessage('First name can contain only small and capital letters.')

const validateLastName = body('lastName')
  .not()
  .isEmpty()
  .withMessage('Last name is required field.')
  .matches(/^[a-zA-Z-]{2,20}$/)
  .withMessage('Last name can contain only small and capital letters.')

const validatePhone = body('phone')
  .not()
  .isEmpty()
  .withMessage('Phone number is required field.')
  .matches(/^\+374\s\d{2}\s\d{6}$/) // +374 xx xxxxxx
  .withMessage(
    'Phone number must be in format like (+374 xx xxxxxx): Ex. +374 77 456789.'
  )

const validateEmail = body('email')
  .not()
  .isEmpty()
  .withMessage('Email is required field.')
  .isEmail()
  .withMessage('Invalid email format.')

const validatePassword = body('password')
  .not()
  .isEmpty()
  .withMessage('Password is required field.')
  .custom((value) => !/\s/.test(value))
  .withMessage('No spaces are allowed in the password.')
  .isLength({ min: 8, max: 25 })
  .withMessage('Password must contain from 8 to 25 symbols')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?=+-])([A-Za-z\d#$@!%&*?=+-]){8,30}$/)
  .withMessage(
    'Password must contain minimum one capital letter, minimum one small letter, minimum one number and minimum one special symbol like [#$@!%&*?=+-].'
  )

const validatePasswordConfirm = body('passwordConfirm').custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match with password.')
    }
    return true
  }
)

// Reset role
const validateRoleUser = body('isUser')
  .not()
  .isEmpty()
  .withMessage('isUser filed must be boolean(true or false).')
  .isBoolean()
  .withMessage('isUser filed must be boolean(true or false).')

const validateRoleProvider = body('isProvider')
  .not()
  .isEmpty()
  .withMessage('isProvider filed must be boolean(true or false).')
  .isBoolean()
  .withMessage('isProvider filed must be boolean(true or false).')

const validateResetRole = body('role')
  .not()
  .isEmpty()
  .withMessage(`You must send role (only 'user' or 'provider').`)
  .isIn(['user', 'provider'])
  .withMessage(`Role can be 'user' or 'provider'.`)

function validationErrorHandler(req, res, next) {
  const valErrors = validationResult(req).errors

  if (valErrors.length > 0) {
    let errorField = '' // to get first error of each field

    const validationMsg = valErrors.reduce((acc, error) => {
      if (error.param === errorField) {
        // in fist time and then error about such field already have in obj
        return acc
      }
      errorField = error.param
      acc[`${error.param}Error`] = error.msg

      return acc
    }, {})

    return res.status(400).json({
      errorType: 'Incorrect data error!',
      errorMsgObject: validationMsg,
    })
  }

  next()
}

module.exports = {
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
}
