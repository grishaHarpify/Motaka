


function isPhoneVerified(req, res, next) {
  console.log(req.user)


  next()
}

function isEmailVerified(req, res, next) {
  console.log(req.user)


  next()
}


module.exports = {
  isPhoneVerified,
  isEmailVerified
}
