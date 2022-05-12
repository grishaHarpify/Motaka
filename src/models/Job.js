const { Schema, model } = require('mongoose')

const jobSchema = new Schema({
  startDate: { type: Date }, // date and time
  duration: { type: String },
  salary: {
    currency: { type: String, default: 'AMD' },
    cost: { type: Number }
  },
  address: { type: String },
  category: {
    type: String,
    //  poqr root sarqenq vori vra fronty request ani: uxarki category-n stana subCategories
    enum: ['cleaning', 'repairing', 'plumbing', 'petWalking', 'ironing']
  },
  subCategories: [{ type: String }],
  // provider and user 
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  collection: 'jobs', strict: false
})

module.exports = model('Job', jobSchema)
