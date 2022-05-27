


function isPhoneVerified(req, res, next) {
  if (req.user.isPhoneVerified) {
    return next()
  }

  res.status(403).json({
    errorType: 'Forbidden!',
    errorMessage: 'Only users with a verified phone number have access in this route.'
  })
}

function isEmailVerified(req, res, next) {
  if (req.user.isEmailVerified) {
    return next()
  }

  res.status(403).json({
    errorType: 'Forbidden!',
    errorMessage: 'Only users with a verified email have access in this route.'
  })
}


module.exports = {
  isPhoneVerified,
  isEmailVerified
}
