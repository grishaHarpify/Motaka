// we already dont use this

const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function getUserDataFromJWT(req, res, next) {
  try {
    const token = req.headers.confirm_code_token // get jwt from header

    // get info about user from token
    let userInfo
    try {
      userInfo = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
      // if we in this block it's mean token expired 
      return res.status(401).json({
        errorType: 'JWT error!',
        errorMsg: 'JWT expired.'
      })
    }

    // get userId from token and get user data from DB
    const { userId } = userInfo
    const userFromDb = await User.findOne({ _id: userId })

    // put user data into [req.user]
    req.user = userFromDb

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

module.exports = getUserDataFromJWT
