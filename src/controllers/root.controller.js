const ConfirmCode = require('../models/ConfirmCode')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateCode = require('../utils/generateCode')
const sendCodeToPhone = require('../utils/sendCodeToPhone') // well use before [because no money]
const putConfirmCodeToDb = require('../utils/putCodeToDb')


async function getPhoneToResetPassword(req, res) {
  try {
    const { phone } = req.body

    // Check user with such phone exist or not
    const user = await User.findOne({ phone })

    if (!user) {
      // No such user case
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'User with such phone number not found.',
      })
    }

    // Generate confirmCode, send and put in the DB
    const confirmCode = generateCode()
    sendCodeToPhone(req.body.phone, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

    res.json({
      message: `Password recovery code was send on the user's phone.`
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

async function resetPassword(req, res) {
  try {
    // Get phone and password from req.body
    const { phone, password } = req.body

    /* Here phone number we get from frontend and we now what it is right number */
    // Find user in DB
    const user = await User.findOne({ phone })
    // Change user password 
    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    await user.save()

    // Change confirm code status in DB
    const codeInfo = await ConfirmCode.findOne({ userId: user._id }).populate('userId')
    codeInfo.isUsed = true
    await codeInfo.save()

    res.json({
      message: 'Password was changed successfully.'
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

async function resendConfirmCode(req, res) {
  try {
    const { phone } = req.body

    // Find user
    const user = await User.findOne({ phone })

    // Generate confirmCode, send and put in the DB
    const confirmCode = generateCode()
    sendCodeToPhone(phone, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

    res.json({
      message: `A new confirm code has been sent to phone number ${phone}.`
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

async function loginWithPhone(req, res) {
  try {
    const { phone, password } = req.body

    // Search user in DB
    const user = await User.findOne({ phone })
    // Check such username[phone] registered or not
    if (!user) {
      // User with such username[phone] not exist
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'You have entered an incorrect phone and/or password.',
      })
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'You have entered an incorrect phone and/or password.',
      })
    }

    // Data is ok. Create JWT. 
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ message: 'Login success.', accessToken })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

module.exports = {
  getPhoneToResetPassword,
  resetPassword,
  resendConfirmCode,
  loginWithPhone
}
