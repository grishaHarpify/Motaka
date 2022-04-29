const User = require('../models/User')
const ConfirmCode = require('../models/ConfirmCode')
const bcrypt = require('bcrypt')

async function checkConfirmCode(req, res, next) {
  try {
    // get confirmCode and phone from req.body
    const { confirmCode, phone } = req.body

    // find user in DB
    const user = await User.findOne({ phone })

    // get info about code from DB
    const codeInfo = await ConfirmCode.findOne({ userId: user._id }).populate('userId')
    const { code: hashedCodeFromDb } = codeInfo

    // compare confirmCode and hashedCodeFromDb
    const isMatched = await bcrypt.compare(confirmCode, hashedCodeFromDb)
    if (!isMatched) {
      // Codes do not match
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg: 'User send the wrong confirm code.'
      })
    }

    /* Codes match */
    // Check code valid time
    const now = new Date()

    if (now > codeInfo.validTime) {
      // Code valid time expired
      return res.status(400).json({
        errorType: 'Confirm code error!',
        errorMsg: 'Confirm code valid time is expired.'
      })
    }
    /* User send right code and can change his password(if he/she pass validation). */

    next()
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

module.exports = checkConfirmCode