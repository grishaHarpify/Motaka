const { body, validationResult } = require('express-validator')

// For login data validation
const validateLoginPhone = body('phone') // check [phone] filed empty or not 
  .trim()
  .not().isEmpty().withMessage('Phone number field cannot be left blank.')
  .matches(/^\+374\s\d{2}\s\d{6}$/)
  .withMessage('Incomplete or incorrect phone number. Phone number must be in format like (+374 xx xxxxxx).')

const isPasswordEmpty = body('password') // check [password] filed empty or not
  .trim()
  .not().isEmpty().withMessage('Password filed cannot be left blank.')

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
  .withMessage('Last name is required field.')
  .matches(/^[A-Za-z]{1,256}$/)
  .withMessage('Last name can contain only small and capital letters.')

const validatePhone = body('phone')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Phone number is required field.')
  .matches(/^\+374\s\d{2}\s\d{6}$/) // +374 xx xxxxxx
  .withMessage('Phone number must be in format like (+374 xx xxxxxx).')

const validateEmail = body('email')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Email is required field.')
  .isEmail()
  .withMessage('Invalid email format.')

const validatePassword = body('password')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Password is required field.')
  .isLength({ min: 8, max: 25 })
  .withMessage('Password must contain from 8 to 25 symbols')
  .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~!@#$%^&*_+=|-\}]).{0,}$/)
  .withMessage('Password must contain minimum one capital letter, minimum one small letter, minimum one number and minimum one special symbol [~!@#$%^&*_+=|-\].')

const validatePasswordConfirm = body('passwordConfirm')
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
      errorType: 'Incorrect data error!',
      errorMsgObject: validationMsg
    })
  }

  next()
}

module.exports = {
  validateLoginPhone,
  isPasswordEmpty,
  validateName,
  validateLastName,
  validatePhone,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validationErrorHandler
}

