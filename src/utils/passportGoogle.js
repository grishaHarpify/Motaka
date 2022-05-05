const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const User = require('../models/User')

// After login user data will be in req.user
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CLIENT_URL,
  profileFields: ['id', 'email', 'gender', 'picture.type(large)'],
  passReqToCallback: false,
}, async (accessToken, refreshToken, profile, done) => {
  const user = profile._json

  const userFromDb = await User.findOne({ googleId: user.sub })

  if (!userFromDb) {
    await User.create({
      googleId: user.sub,
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
      // user.picture //
      isEmailVerified: user.email_verified
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
