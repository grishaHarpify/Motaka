
function isProvider(req, res, next) {
  if (req.user.activeRole === 'provider') {
    return next()
  }

  res.status(403).json({
    errorType: 'Forbidden!',
    errorMsg: 'Only users with an active role [provider] have access in this route.'
  })
}


function isUser(req, res, next) {
  if (req.user.activeRole === 'user') {
    return next()
  }

  res.status(403).json({
    errorType: 'Forbidden!',
    errorMsg: 'Only users with an active role [user] have access in this route.'
  })
}


module.exports = {
  isProvider,
  isUser
}