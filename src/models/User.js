const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  fbId: { type: String },
  googleId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  role: {
    isProvider: { type: Boolean, default: false },
    isUser: { type: Boolean, default: false }
  },
  password: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false }
}, {
  collection: 'users', strict: false
})

module.exports = model('User', userSchema)