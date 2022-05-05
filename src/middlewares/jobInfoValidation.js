const { body, validationResult } = require('express-validator')

const validateStartDate = body('startDate')
  .not()
  .isEmpty()
  .withMessage('Job start date is required field.')
  .isDate()
  .withMessage('Such date format is not valid. Valid date format is (yyyy-mm-dd).')

const validateStartTime = body('startTime')
  .not()
  .isEmpty()
  .withMessage('Job start time is required field.')
  .matches(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/)
  .withMessage('Job start time must be in format like (hh:mm:ss): Ex. 15:30:00')
// urish inch validation anel ? 

const validateDuration = body('duration')
  .not()
  .isEmpty()
  .withMessage('Job duration date is required field.')
  .matches(/^\d+\s(minute|hour|day|week)$/)
  .withMessage('Job duration must be in format like (number minute/hour/day/week): Ex. 4 hour, 2 day, 1 week.')

const validateCost = body('cost')
  .not()
  .isEmpty()
  .withMessage('Job cost is required field.')
  .matches(/^\d+\s(AMD)$/)
  .withMessage('Job cost must be in format like (cost AMD): Ex. 2000 AMD.')

const validateAddress = body('address')
  .not()
  .isEmpty()
  .withMessage('Job address is required field.')
// urish inch validation anel ?

const validateCategory = body('category')
  .not()
  .isEmpty()
  .withMessage('Job category is required field. Categories ([cleaning] [repairing] [plumbing] [petWalking] [ironing])')
  .isIn(['cleaning', 'repairing', 'plumbing', 'petWalking', 'ironing'])
  .withMessage('Incorrect job category. Allowed job categories is cleaning, repairing, plumbing, petWalking and ironing.')

const validateSubCategories = body('subCategories')
  .not()
  .isEmpty()
  .withMessage('Job sub categories is required field.')
// ??

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
  validateStartTime, // ??
  validateDuration,
  validateCost,
  validateAddress, // ??
  validateCategory,
  validateSubCategories,
  jobValidationErrorHandler
}
