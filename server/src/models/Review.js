const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: Number,
  comment: String,
  status: { type: String, default: 'pending' },
}, { timestamps: true })
module.exports = mongoose.model('Review', ReviewSchema)