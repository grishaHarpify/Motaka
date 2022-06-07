const { Schema, model } = require('mongoose')

const CommentSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }

}, {
  collection: 'comments', strict: false, timestamps: true
})

module.exports = model('Comment', CommentSchema)
