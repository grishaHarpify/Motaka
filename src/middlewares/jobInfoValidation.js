const { body, validationResult } = require('express-validator')

const validateStartDate = body('startDate')
  .not()
  .isEmpty()
  .withMessage('Job start date is required field.')
  .isDate()
  .withMessage('Such date format is not valid.')

// const validateStartTime = body('startTime')
//   .not()
//   .isEmpty()
//   .withMessage('Job start time is required field.')
//   .

const validateDuration = body('duration')
  .not()
  .isEmpty()
  .withMessage('Job duration date is required field.') // ???
  .matches(/^\d+\s(minute|hour|day|week)$/)
  .withMessage('Job duration must be in format like (number minute/hour/day/week): Ex. 4 hour, 2 day, 1 week.')




function jobValidationErrorHandler(req, res, next) {
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
  validateStartDate,
  validateDuration,
  jobValidationErrorHandler
}
