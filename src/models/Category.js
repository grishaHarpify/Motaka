const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
  name: { type: String, required: true },
  subCategories: [{ type: String }]
}, {
  collection: 'categories', strict: false
})

module.exports = model('Category', CategorySchema)
