const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  icon: String,
}, { timestamps: true })
module.exports = mongoose.model('Category', CategorySchema)