
const jwt = require('jsonwebtoken')
const JWTHandler = require('../services/jwtHandler')


function getRefreshReturnPair(req, res) {
  try {
    const { refreshToken } = req.body

    // Get user id from jwt
    const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET)

    // Create new access and refresh tokens
    const accessToken = JWTHandler.createAccessToken(userId)
    const newRefreshToken = JWTHandler.createRefreshToken(userId)

    res.json({
      accessToken,
      refreshToken: newRefreshToken
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
