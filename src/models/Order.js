const { Schema, model } = require('mongoose')

const OrderSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  collection: 'orders', strict: false, timestamps: true
})

module.exports = model('Order', OrderSchema)
