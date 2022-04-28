const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const User = require('../models/User')

passport.use(new LocalStrategy({
  usernameField: 'phone'
}, async (phone, password, done) => {
  // we will check if user exist in [../controllers/root.controller.js function loginLocal]
  const user = await User.findOne({ phone })

  done(null, user)
}))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  done(null, await User.findOne({ _id: id }))
})
