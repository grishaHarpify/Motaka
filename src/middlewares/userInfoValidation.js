const { body, validationResult } = require('express-validator')

// For login data validation
const isPhoneEmpty = body('phone') // check [phone] filed empty or not 
  .trim()
  .not().isEmpty().withMessage('Phone number cannot be left blank.')

const isPasswordEmpty = body('password') // check [password] filed empty or not
  .trim()
  .not().isEmpty().withMessage('Password cannot be left blank.')

// User data validation 
const validateName = body('name')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Name cannot be empty.')
  .matches(/^[A-Za-z]{1,256}$/)
  .withMessage('Name can contain only small and capital letters.')

const validateLastName = body('lastName')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Last name cannot be empty.')
  .matches(/^[A-Za-z]{1,256}$/)
  .withMessage('Last name can contain only small and capital letters.')

const validatePhone = body('phone')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Phone number cannot be empty.')
  .matches(/^\+374\s\d{2}\s\d{6}$/) // +374 xx xxxxxx
  .withMessage('Phone number must be in format like [+374 xx xxxxxx].')

const validateEmail = body('email')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Email cannot be empty.')
  .isEmail()
  .withMessage('Invalid email format.')

const validatePassword = body('password')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Password cannot be empty.')
  .isLength({ min: 8, max: 25 })
  .withMessage('Password must contain from 8 to 25 symbols')
  .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~!@#$%^&*_+=|-\}]).{0,}$/)
  .withMessage('Password must contain minimum one capital letter, minimum one small letter, minimum one number and minimum one special symbol.')

const validatePasswordConfirm = body('passwordConfirm')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Password confirmation cannot be empty.')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match with password.')
    }
    return true
  })

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
      errorType: 'Validation error!',
      errorMsgObject: validationMsg
    })
  }

  next()
}

module.exports = {
  isPhoneEmpty,
  isPasswordEmpty,
  validateName,
  validateLastName,
  validatePhone,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler
}

