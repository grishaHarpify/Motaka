
function authenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
  }

  next()
}

function notAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  }

  next()
}

module.exports = {
  authenticated,
  notAuthenticated
}
