const { Schema, model } = require('mongoose')

const jobSchema = new Schema({
  startDate: { type: Date }, // date and time
  duration: { type: String },
  cost: { type: String },
  address: { type: String },
  category: {
    type: String,
    // karanq sarqenq poqr root vor vra fronty request ani uxarki category-n stana subCategories
    enum: ['cleaning', 'repairing', 'plumbing', 'petWalking', 'ironing']
  },
  subCategories: [{ type: String }]
}, {
  collection: 'jobs', strict: false
})

module.exports = model('Job', jobSchema)
