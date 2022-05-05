const { Schema, model } = require('mongoose')

const jobSchema = new Schema({
  startDate: { type: Date },
  duration: { type: String },
  money: { type: String },
  address: { type: String },
  category: {
    type: String,
    enum: ['cleaning', 'repairing', 'plumbing', 'petWalking', 'ironing']
  }
}, {
  collection: 'jobs', strict: false
})

module.exports = model('Job', jobSchema)
