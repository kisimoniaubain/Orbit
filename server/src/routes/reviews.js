const express = require('express')
const Review = require('../models/Review')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, auth.admin, async (req, res) => {
  const list = await Review.find().populate('user', 'name email').populate('product', 'name').sort({ createdAt: -1 })
  res.json(list)
})

router.put('/:id', auth, auth.admin, async (req, res) => {
  const r = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(r)
})

router.delete('/:id', auth, auth.admin, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router