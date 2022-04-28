const { Schema, model } = require('mongoose')

const confirmCodeSchema = new Schema({
  code: { type: String, required: true },
  validTime: { type: Date },
  isUsed: { type: Boolean, default: false },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  collection: 'confirmCodes', strict: false
})

module.exports = model('ConfirmCode', confirmCodeSchema)
