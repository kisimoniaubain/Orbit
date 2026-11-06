const mongoose = require('mongoose')
const CodeSchema = new mongoose.Schema({
  email: String,
  code: String,
  purpose: { type: String, default: 'login' },
  expiresAt: Date,
}, { timestamps: true })
module.exports = mongoose.model('VerificationCode', CodeSchema)
