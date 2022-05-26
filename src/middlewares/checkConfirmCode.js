const UserModel = require('../models/User')
const ConfirmCodeModel = require('../models/ConfirmCode')
const bcrypt = require('bcrypt')

async function checkPhoneConfirmCode(req, res, next) {
  try {
    // get confirmCode and phone from req.body
    const { confirmCode, phone } = req.body

    // Check we have code or not
    if (!confirmCode) {
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: `Request body must contain confirm code.`,
      })
    }

    // find user in DB
    const user = await UserModel.findOne({ phone })

    if (!user) {
      return res.status(404).json({
        errorType: 'Incorrect data error!',
        errorMessage: 'User with such phone number does not exist.',
      })
    }

    // get info about code from DB
    const codeInfo = await ConfirmCodeModel.findOne({ userId: user._id }).populate('userId')

    // codeInfo === null -> no code in db -> user dont send code
    if (!codeInfo) {
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'In first user must send the code to your phone number.',
      })
    }

    // compare confirmCode and hashedCodeFromDb
    const { code: hashedCodeFromDb } = codeInfo
    const isMatched = await bcrypt.compare(confirmCode, hashedCodeFromDb)

    if (!isMatched) {
      // Codes does not match
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'User send the wrong confirm code.',
      })
    }

    // Codes match //
    // Check code valid time
    const now = new Date()
    if (now > codeInfo.validTime) {
      // Code valid time expired
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'Confirm code valid time is expired.',
      })
    }

    // Check isUsed true or false
    if (codeInfo.isUsed) {
      // This code already used
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'User have already used this code.',
      })
    }

    // User send right code //
    next()
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function checkEmailConfirmCode(req, res, next) {
  try {
    // get confirmCode and phone from req.body
    const { confirmCode, email } = req.body

    // Check we have code or not
    if (!confirmCode) {
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: `Request body must contain confirm code.`,
      })
    }

    // find user in DB
    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        errorType: 'Incorrect data error!',
        errorMessage: 'User with such email does not exist.',
      })
    }

    // get info about code from DB
    const codeInfo = await ConfirmCodeModel.findOne({ userId: user._id }).populate('userId')

    // codeInfo === null -> no code in db -> user dont send code
    if (!codeInfo) {
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'In first user must send the code to your email.',
      })
    }

    // compare confirmCode and hashedCodeFromDb
    const { code: hashedCodeFromDb } = codeInfo
    const isMatched = await bcrypt.compare(confirmCode, hashedCodeFromDb)

    if (!isMatched) {
      // Codes does not match
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'User send the wrong confirm code.',
      })
    }

    // Codes match //
    // Check code valid time
    const now = new Date()
    if (now > codeInfo.validTime) {
      // Code valid time expired
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'Confirm code valid time is expired.',
      })
    }

    // Check isUsed true or false
    if (codeInfo.isUsed) {
      // This code already used
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMessage: 'User have already used this code.',
      })
    }

    // User send right code //
    next()
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}



module.exports = {
  checkPhoneConfirmCode,
  checkEmailConfirmCode
}
