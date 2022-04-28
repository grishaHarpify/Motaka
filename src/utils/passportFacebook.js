const passport = require('passport')
const { Strategy: FacebookStrategy } = require('passport-facebook')
const User = require('../models/User')

// After login user data will be in req.user
passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: process.env.FB_CLIENT_URL,
  profileFields: ['id', 'email', 'name', 'gender', 'picture.type(large)']
}, async (accessToken, refreshToken, profile, done) => {
  const user = profile._json

  const userFromDb = await User.findOne({ fbId: user.id })

  if (!userFromDb) {
    /* We have also user.picture */
    await User.create({
      fbId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      isEmailVerified: true
    })
  }

  done(null, userFromDb)
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})
