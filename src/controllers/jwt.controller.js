const jwt = require('jsonwebtoken')

const UserModel = require('../models/User')

const JWTHandler = require('../services/jwtHandler')

async function getRefreshReturnPair(req, res) {
  try {
    const { refreshToken } = req.body

    let userInfo
    try {
      userInfo = jwt.verify(refreshToken, process.env.JWT_SECRET)
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Token expired
        return res.status(401).json({
          errorType: 'JWT error!',
          errorMessage: 'Refresh token date is expired.'
        })
      }

      // Token invalid
      return res.status(401).json({
        errorType: 'JWT error!',
        errorMessage: 'Refresh token is not valid.'
      })
    }

    // Get userId from token 
    const { userId } = userInfo
    // Check (Argument passed in must be a string of 12 bytes or a string of 24 hex characters)
    if (userId.length === 12 || userId.length === 24) {
      // Id correct
      // Get user data from DB
      const userFromDb = await UserModel.findOne({ _id: userId })

      if (!userFromDb) {
        // in JWT incorrect ID
        return res.status(401).json({
          errorType: 'JWT error!',
          errorMessage: 'Wrong refresh token.'
        })
      }

      // Create new access and refresh tokens
      const accessToken = JWTHandler.createAccessToken(userId)
      const newRefreshToken = JWTHandler.createRefreshToken(userId)

      return res.json({
        accessToken,
        refreshToken: newRefreshToken
      })
    }

    // User id in token incorrect
    res.status(401).json({
      errorType: 'JWT error!',
      errorMessage: 'Wrong refresh token.'
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
  getRefreshReturnPair
}
