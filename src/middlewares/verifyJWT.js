const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Get user data from JWT
async function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader) {
      // Authorization header is not empty
      const token = authHeader.split(' ')[1] // get token from [ Authorization (Bearer token) ]

      // Get info about user from token
      let userInfo
      try {
        userInfo = jwt.verify(token, process.env.JWT_SECRET)
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          // Token expired
          return res.status(401).json({
            errorType: 'JWT error!',
            errorMsg: 'Authorization token date is expired.'
          })
        }

        // Token invalid
        return res.status(401).json({
          errorType: 'JWT error!',
          errorMsg: 'Authorization token is not valid.'
        })
      }

      // Get userId from token 
      const { userId } = userInfo
      // Check (Argument passed in must be a string of 12 bytes or a string of 24 hex characters)
      if (userId.length === 12 || userId.length === 24) {
        // Id correct
        // Get user data from DB
        const userFromDb = await User.findOne({ _id: userId })

        if (!userFromDb) {
          // in JWT incorrect ID
          return res.status(401).json({
            errorType: 'JWT error!',
            errorMsg: 'Wrong authorization token.'
          })
        }

        // put user data into [req.user]
        req.user = userFromDb

        return next()
      }

      // User id in token incorrect
      res.status(401).json({
        errorType: 'JWT error!',
        errorMsg: 'Wrong authorization token.'
      })
    } else {
      // Authorization header is empty
      return res.status(401).json({
        errorType: 'JWT error!',
        errorMsg: 'Request must contain authorization header.'
      })
    }

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

module.exports = verifyJWT
