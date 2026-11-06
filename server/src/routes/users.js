const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, auth.admin, async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 })
  res.json(users)
})

router.get('/:id', auth, auth.admin, async (req, res) => {
  const u = await User.findById(req.params.id).select('-passwordHash')
  if (!u) return res.status(404).json({ error: 'Not found' })
  res.json(u)
})

router.put('/:id/role', auth, auth.admin, async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' })
  const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash')
  res.json(u)
})

router.put('/:id/status', auth, auth.admin, async (req, res) => {
  const { active } = req.body
  const u = await User.findByIdAndUpdate(req.params.id, { active }, { new: true }).select('-passwordHash')
  res.json(u)
})

module.exports = router