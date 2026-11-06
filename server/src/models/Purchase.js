const mongoose = require('mongoose')
const PurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  amount: Number,
  status: { type: String, default: 'completed' },
  paymentMethod: String,
}, { timestamps: true })
module.exports = mongoose.model('Purchase', PurchaseSchema)