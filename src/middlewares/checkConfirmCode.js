const User = require('../models/User')
const ConfirmCode = require('../models/ConfirmCode')
const bcrypt = require('bcrypt')

async function checkConfirmCode(req, res, next) {
  try {
    // get confirmCode and phone from req.body
    const { confirmCode, phone } = req.body

    // Check we have code or not
    if (!confirmCode) {
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg: 'Please input confirm code.',
      })
    }

    // find user in DB
    const user = await User.findOne({ phone })

    // get info about code from DB
    const codeInfo = await ConfirmCode.findOne({ userId: user._id }).populate(
      'userId'
    )

    // codeInfo === null -> no code in db -> user dont send code
    if (!codeInfo) {
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg:
          'In first you need to send confirm code in your phone number.',
      })
    }

    // compare confirmCode and hashedCodeFromDb
    const { code: hashedCodeFromDb } = codeInfo
    const isMatched = await bcrypt.compare(confirmCode, hashedCodeFromDb)

    if (!isMatched) {
      // Codes does not match
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg: 'User send the wrong confirm code.',
      })
    }

    // Codes match //
    // Check code valid time
    const now = new Date()
    if (now > codeInfo.validTime) {
      // Code valid time expired
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg: 'Confirm code valid time is expired. Please send a new one.',
      })
    }

    // Check isUsed true or false
    if (codeInfo.isUsed) {
      // This code already used
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg:
          'You have already used this code to change/recover your password. Please send a new one.',
      })
    }

    // User send right code //
    next()
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

module.exports = checkConfirmCode
