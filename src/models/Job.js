const { Schema, model } = require('mongoose')

const jobSchema = new Schema({
  startDate: { type: String }, // date and time
  duration: { type: Number }, // duration in hour
  salary: {
    currency: { type: String, default: 'AMD' },
    cost: { type: Number }
  },
  address: { type: String },
  category: {
    type: String,
    enum: ['cleaning', 'repairing', 'plumbing', 'petWalking', 'ironing']
  },
  subCategories: [{ type: String }],
  // provider and user 
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['open', 'inProgress', 'finished'],
    default: 'open'
  }

}, {
  collection: 'jobs', strict: false, timestamps: true
})

module.exports = model('Job', jobSchema)
