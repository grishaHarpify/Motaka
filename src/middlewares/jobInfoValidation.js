const { body, validationResult } = require('express-validator')

const validateStartDate = body('startDate')
  .not()
  .isEmpty()
  .withMessage('Job start date is required field.')
  .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
  .withMessage('Such date format is not valid. Valid date format is (yyyy-mm-dd).')


const validateStartTime = body('startTime')
  .not()
  .isEmpty()
  .withMessage('Job start time is required field.')
  .matches(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/)
  .withMessage('Job start time must be in format like (hh:mm:ss): Ex. 15:30:00')
  .custom((time, { req }) => {
    const now = new Date()
    const dateAndTimeString = `${req.body.startDate}T${time}`
    const jobStartDate = new Date(dateAndTimeString)

    now.setHours(now.getHours() + 4)

    if (now > jobStartDate) {
      const dateNow = now.toLocaleDateString().split('T')[0]
      const timeNow = now.toLocaleTimeString()
      throw new Error(`Job start date must be after then ${dateNow} ${timeNow}.`)
    }

    return true
  })

const validateDuration = body('duration')
  .not()
  .isEmpty()
  .withMessage('Job duration is required field.')
  .matches(/^(?![0]\b)\d{0,}$/)
  .withMessage('Duration field must be a number that indicates the job duration in hour [Except 0].')


// BEFORE
// const validateSalaryCurrency = body('salary.currency')
//   .not()
//   .isEmpty()
//   .withMessage('Job salary currency is required field.')

const validateSalaryCost = body('salary')
  .not()
  .isEmpty()
  .withMessage('Job salary is required field.')
  .matches(/^(?![0]\b)\d{0,}$/)
  .withMessage('Job salary must be positive number.')

const validateAddress = body('address') // ??
  .not()
  .isEmpty()
  .withMessage('Job address is required field.')

const validateDescription = body('description')
  .trim()
  .not()
  .isEmpty()
  .withMessage('Job description is required field.')

const validateCategory = body('category')
  .not()
  .isEmpty()
  .withMessage('Job category is required field. Allowed job categories: ([cleaning] [repairing] [plumbing] [petWalking] [ironing])')
  .isIn(['cleaning', 'repairing', 'plumbing', 'petWalking', 'ironing'])
  .withMessage('Incorrect job category. Allowed job categories: ([cleaning] [repairing] [plumbing] [petWalking] [ironing])')

const validateSubCategories = body('subCategories') // ??
  .not()
  .isEmpty()
  .withMessage('Job sub categories is required field.')


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
  validateStartTime,
  validateDuration,
  // validateSalaryCurrency,
  validateSalaryCost,
  validateAddress, // ??
  validateDescription,
  validateCategory,
  validateSubCategories, // ??
  jobValidationErrorHandler
}
