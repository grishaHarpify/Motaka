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
  },
  // status: {
  //   type: String,
  //   enum: ['inProgress', 'finished'],
  // },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    _id: false
  }]

}, {
  collection: 'orders', strict: false, timestamps: true
})

module.exports = model('Order', OrderSchema)
