
function isProvider(req, res, next) {
  if (req.user.activeRole === 'provider') {
    return next()
  }

  res.status(403).json({
    errorType: 'Forbidden!',
    errorMsg: 'The user does not have access to this endpoint.'
  })
}


function isUser(req, res, next) {
  if (req.user.activeRole === 'user') {
    return next()
  }

  res.status(403).json({
    errorType: 'Forbidden!',
    errorMsg: 'The user does not have access to this endpoint.'
  })
}


module.exports = {
  isProvider,
  isUser
}