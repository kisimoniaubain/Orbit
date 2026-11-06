const express = require('express')
const User = require('../models/User')
const Product = require('../models/Product')
const Purchase = require('../models/Purchase')
const Review = require('../models/Review')
const auth = require('../middleware/auth')
const { sendBulkMail } = require('../email')
const router = express.Router()

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char])
}

router.get('/stats', auth, auth.admin, async (req, res) => {
  const [users, products, purchases, reviews] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Purchase.countDocuments(),
    Review.countDocuments(),
  ])
  const published = await Product.countDocuments({ /* no published field yet */ })
  const revenueAgg = await Purchase.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
  const revenue = revenueAgg[0]?.total || 0
  const recentPurchases = await Purchase.find().populate('user', 'name email').populate('product', 'name').sort({ createdAt: -1 }).limit(5)
  const recentUsers = await User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(5)
  res.json({ users, products, published: products, unpublished: 0, purchases, revenue, reviews, recentPurchases, recentUsers })
})

router.post('/notifications/email', auth, auth.admin, async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : ''
  if (!title || title.length > 150 || /[\r\n]/.test(title)) {
    return res.status(400).json({ error: 'Title is required and must be 150 characters or fewer' })
  }
  if (!message || message.length > 10000) {
    return res.status(400).json({ error: 'Message is required and must be 10000 characters or fewer' })
  }

  const users = await User.find({
    active: { $ne: false },
    email: { $type: 'string', $ne: '' },
  }).select('email')
  const allAddresses = [...new Set(users.map(user => user.email.trim().toLowerCase()).filter(Boolean))]
  const recipients = allAddresses.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  const skipped = allAddresses.length - recipients.length
  if (!recipients.length) return res.status(400).json({ error: 'No active users with email addresses were found' })

  const safeTitle = escapeHtml(title)
  const safeMessage = escapeHtml(message).replace(/\r\n|\r|\n/g, '<br>')
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#171717;line-height:1.6"><main style="max-width:600px;margin:32px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px"><p style="color:#00ACC1;font-weight:bold">ORBIT</p><h1 style="font-size:22px">${safeTitle}</h1><p>${safeMessage}</p></main></body></html>`
  const text = `${title}\n\n${message}\n\nORBIT`

  try {
    const result = await sendBulkMail(recipients, title, text, html)
    if (!result.delivered) {
      return res.status(502).json({
        error: 'The email provider did not accept any recipient. Check SMTP configuration and try again.',
        delivered: 0,
        failed: result.failed,
        total: recipients.length,
        skipped,
      })
    }
    res.json({ ...result, total: recipients.length, skipped })
  } catch (error) {
    console.error('Announcement email delivery failed:', error.message)
    res.status(502).json({
      error: 'Email delivery failed. Check the SMTP configuration and try again.',
      delivered: 0,
      failed: recipients.length,
      total: recipients.length,
      skipped,
    })
  }
})

module.exports = router