const jwt = require('jsonwebtoken')


function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '5h'
  })
}

function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}


module.exports = {
  createAccessToken,
  createRefreshToken
}
