const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ConfirmCode = require('../models/ConfirmCode')
const User = require('../models/User')
const generateCode = require('../utils/generateCode')
const sendCodeToPhone = require('../utils/sendCodeToPhone') // well use before [because no money]
const putConfirmCodeToDb = require('../utils/putCodeToDb')

async function register(req, res) {
  try {
    const { firstName, lastName, password, phone, email, isUser, isProvider } = req.body

    // Check if exist user with such phone
    const existingUserPhone = await User.findOne({
      phone,
    })
    const usernameExistsPhone = existingUserPhone !== null

    if (usernameExistsPhone) {
      return res.status(400).json({
        message: 'This phone already registered.',
      })
    }

    // Check if exist user with such mail
    const existingUser = await User.findOne({
      email,
    })
    const usernameExists = existingUser !== null

    if (usernameExists) {
      return res.status(400).json({
        message: 'This email already registered.',
      })
    }

    if (!isUser && !isProvider) {
      return res.status(400).json({
        message: 'One of isUser or isProvider fields must be true.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Set active role [for default value without set_role]
    const activeRole = isProvider ? 'provider' : 'user'
    const newUser = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      email,
      role: {
        isUser: isUser,
        isProvider: isProvider,
      },
      activeRole, // default 'provider'
    })

    // Generate code and put in DB
    const code = generateCode()
    sendCodeToPhone(phone, code)
    putConfirmCodeToDb(newUser._id, code)
    console.log('confirmCode --->', code, '<---')

    res.status(201).json({
      message:
        'Registration success. Confirm code was sended in your phone number.',
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

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
      message: `Password recovery code was send on the user's phone.`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

async function resetPassword(req, res) {
  try {
    // Get phone and password from req.body
    const { phone, password } = req.body

    // Here phone number we get from frontend and we now what it is right number //
    // Find user in DB
    const user = await User.findOne({ phone })
    // Change user password
    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    await user.save()

    // Change confirm code status in DB
    const codeInfo = await ConfirmCode.findOne({ userId: user._id }).populate(
      'userId'
    )
    codeInfo.isUsed = true
    await codeInfo.save()

    res.status(201).json({
      message: 'Password was changed successfully.',
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
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
      message: `A new confirm code has been sent to phone number ${phone}.`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
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

    // Get available roles
    const availableRoles = []
    if (user.role.isUser) {
      availableRoles.push('user')
    }
    if (user.role.isProvider) {
      availableRoles.push('provider')
    }

    // Create JWT.(default role [activeRole])
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({ message: 'Login success.', accessToken, availableRoles })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

async function setActiveRole(req, res) {
  try {
    const { role } = req.body

    // Get user and check role available or not
    const user = req.user
    const isRole = `is${role.charAt(0).toUpperCase() + role.slice(1)}` // isRole = isUser \ isProvider

    if (!user.role[isRole]) {
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMsg: 'The user is not registered with such role.',
      })
    }

    // set active role
    user.activeRole = role
    await user.save()

    res.json({
      message: `User active role was changed to ${role}.`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

module.exports = {
  getPhoneToResetPassword,
  resetPassword,
  resendConfirmCode,
  register,
  loginWithPhone,
  setActiveRole,
}
