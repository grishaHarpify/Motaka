const bcrypt = require('bcrypt')

const { OAuth2Client } = require('google-auth-library')
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const fetch = require('node-fetch')

const ConfirmCodeModel = require('../models/ConfirmCode')
const UserModel = require('../models/User')

const generateCode = require('../utils/generateCode')
const sendCodeToPhone = require('../utils/sendCodeToPhone')
const sendCodeToEmail = require('../utils/sendCodeToMail')
const putConfirmCodeToDb = require('../utils/putCodeToDb')
const getUserAvailableRoles = require('../services/getAvailableRoles')
const JWTHandler = require('../services/jwtHandler')

async function register(req, res) {
  try {
    const { firstName, lastName, password, phone, email, isUser, isProvider } = req.body

    // isUSer and isProvider validation
    if (!isUser && !isProvider) {
      return res.status(400).json({
        errorType: 'Validation error!',
        errorMessages: ['One of isUser or isProvider fields must be true.']
      })
    }

    // Check if exist user with such phone
    const existingUserPhone = await UserModel.findOne({
      phone,
    })
    const userExistsPhone = existingUserPhone !== null

    if (userExistsPhone) {
      return res.status(409).json({
        message: 'Such phone already registered.',
      })
    }

    // Check if exist user with such mail
    const existingUser = await UserModel.findOne({
      email,
    })
    const userExists = existingUser !== null

    if (userExists) {
      return res.status(409).json({
        message: 'Such email already registered.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Set active role [for default value without set_role]
    const activeRole = isUser ? 'user' : 'provider'
    const newUser = await UserModel.create({
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      email,
      role: {
        isUser: isUser,
        isProvider: isProvider,
      },
      activeRole, // default 'user'
    })

    // Generate code and put in DB
    const code = generateCode()
    sendCodeToPhone(phone, code)
    putConfirmCodeToDb(newUser._id, code)
    console.log('confirmCode --->', code, '<---')

    res.status(201).json({
      message: 'Registration success. Confirm code was sended in user phone number.',
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function sendConfirmCodeToPhoneNumber(req, res) {
  try {
    const { phone } = req.body

    // Check user with such phone exist or not
    const user = await UserModel.findOne({ phone })

    if (!user) {
      // No such user case
      return res.status(404).json({
        errorType: 'Incorrect data error!',
        errorMessage: 'User with such phone number does not exist.',
      })
    }

    // Generate confirmCode, send and put in the DB
    const confirmCode = generateCode()
    sendCodeToPhone(req.body.phone, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

    res.json({
      message: `Confirm code was sent on the user phone number.`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function phoneVerification(req, res) {
  try {
    // const phone = req.body.phone
    const { phone } = req.body

    // change user phone info in DB
    const user = await UserModel.findOne({ phone })

    // Check phone already verified or no
    if (user.isPhoneVerified) {
      return res.status(400).json({
        errorType: 'Verified error!',
        errorMessage: 'User phone number already verified.'
      })
    }

    // Change isPhoneVerified in DB
    user.isPhoneVerified = true
    await user.save()

    // Change confirm code status in DB
    const codeInfo = await ConfirmCodeModel.findOne({
      userId: user._id,
    }).populate('userId')
    codeInfo.isUsed = true
    await codeInfo.save()

    res.json({
      message: 'User sent right code and phone number has been verified.'
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function sendConfirmCodeToEmail(req, res) {
  try {
    const { email } = req.body

    // Check user with such phone exist or not
    const user = await UserModel.findOne({ email })

    if (!user) {
      // No such user case
      return res.status(404).json({
        errorType: 'Incorrect data error!',
        errorMessage: 'User with such email does not exist.',
      })
    }

    // Generate confirmCode, send and put in the DB
    const confirmCode = generateCode()
    sendCodeToEmail(email, confirmCode)
    putConfirmCodeToDb(user._id, confirmCode)
    console.log('confirmCode --->', confirmCode, '<---')

    res.json({
      message: `Confirm code was sent on the user email.`,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function emailVerification(req, res) {
  try {
    // const phone = req.body.phone
    const { email } = req.body

    // change user phone info in DB
    const user = await UserModel.findOne({ email })

    // Check phone already verified or no
    if (user.isEmailVerified) {
      return res.status(400).json({
        errorType: 'Verified error!',
        errorMessage: 'User email already verified.'
      })
    }

    // Change isEmailVerified in DB
    user.isEmailVerified = true
    await user.save()

    // Change confirm code status in DB
    const codeInfo = await ConfirmCodeModel.findOne({
      userId: user._id,
    }).populate('userId')
    codeInfo.isUsed = true
    await codeInfo.save()

    res.json({
      message: 'User sent right code and email has been verified.'
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function resetPassword(req, res) {
  try {
    // Get phone and password from req.body
    const { phone, password } = req.body

    // Here phone number we get from frontend and we now what it is right number //
    // Find user in DB
    const user = await UserModel.findOne({ phone })
    // Change user password
    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword
    await user.save()

    // Change confirm code status in DB 
    const codeInfo = await ConfirmCodeModel.findOne({
      userId: user._id,
    }).populate('userId')
    codeInfo.isUsed = true
    await codeInfo.save()

    // Change phone verified field in db
    user.isPhoneVerified = true
    await user.save()

    res.json({
      message: 'Password was changed successfully.',
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function loginWithPhone(req, res) {
  try {
    const { phone, password } = req.body

    // Search user in DB
    const user = await UserModel.findOne({ phone })
    // Check such username[phone] registered or not
    if (!user) {
      // User with such username[phone] not exist
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMessage: 'User have entered an incorrect phone and/or password.',
      })
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({
        errorType: 'Incorrect data error!',
        errorMessage: 'User have entered an incorrect phone and/or password.',
      })
    }

    // Get available roles
    const availableRoles = getUserAvailableRoles(user)

    // Create JWT.(default role [activeRole])
    const accessToken = JWTHandler.createAccessToken(user._id)
    const refreshToken = JWTHandler.createRefreshToken(user._id)


    res.json({
      message: 'Login success.',
      accessToken,
      refreshToken,
      availableRoles
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function loginWithGoogle(req, res) {
  try {
    const { tokenId } = req.body

    // Get user data from token
    console.log(tokenId)
    const clientObject = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const googleUserData = clientObject.payload
    console.log(tokenId)

    // Get user data from db
    let userFromDb = await UserModel.findOne({ googleId: googleUserData.sub })
    console.log(tokenId)

    // Check user exist in db or no
    if (!userFromDb) {
      // If user registered first time
      userFromDb = await UserModel.create({
        googleId: googleUserData.sub,
        firstName: googleUserData.given_name,
        lastName: googleUserData.family_name,
        email: googleUserData.email,
        isEmailVerified: googleUserData.email_verified,
        avatar: googleUserData.picture,
      })
    }
    console.log(tokenId)


    // Get available roles
    const availableRoles = getUserAvailableRoles(userFromDb)

    // Create JWT.(default role [activeRole])
    const accessToken = JWTHandler.createAccessToken(userFromDb._id)
    const refreshToken = JWTHandler.createRefreshToken(userFromDb._id)

    res.json({
      message: 'Login with google success.',
      accessToken,
      refreshToken,
      availableRoles
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function loginWithFacebook(req, res) {
  try {
    const { accessToken: facebookAccessToken, userId } = req.body

    const requestUrl = `https://graph.facebook.com/${userId}?fields=id,name,email,first_name,last_name,picture&access_token=${facebookAccessToken}`

    // Get user data from facebook
    const requestData = await fetch(requestUrl)
    const fbUserData = await requestData.json()

    // Find user in DB
    let userFromDb = await UserModel.findOne({ fbId: fbUserData.id })

    // Check user exist in db or no
    if (!userFromDb) {
      // If user registered first time
      userFromDb = await UserModel.create({
        fbId: fbUserData.id,
        firstName: fbUserData.first_name,
        lastName: fbUserData.last_name,
        email: fbUserData.email,
        avatar: fbUserData.picture.data.url,
      })
    }

    // Get available roles
    const availableRoles = getUserAvailableRoles(userFromDb)

    // Create JWT.(default role [activeRole])
    const accessToken = JWTHandler.createAccessToken(userFromDb._id)
    const refreshToken = JWTHandler.createRefreshToken(userFromDb._id)

    res.json({
      message: 'Login with facebook success.',
      accessToken,
      refreshToken,
      availableRoles
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
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
      user.role[isRole] = true
      await user.save()

      user.activeRole = role
      await user.save()

      return res.status(201).json({
        message: `The user has create a new role [${role}] for himself and switched to it.`
      })
    }

    // set active role
    user.activeRole = role
    await user.save()

    res.json({
      message: `User active role was changed to [${role}].`,
    })
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
  register,
  sendConfirmCodeToPhoneNumber,
  phoneVerification,
  sendConfirmCodeToEmail,
  emailVerification,
  resetPassword,
  loginWithPhone,
  loginWithGoogle,
  loginWithFacebook,
  setActiveRole,
}
