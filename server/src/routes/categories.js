const express = require('express')
const Category = require('../models/Category')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', async (req, res) => {
  const cats = await Category.find().sort({ name: 1 })
  res.json(cats)
})

router.post('/', auth, auth.admin, async (req, res) => {
  const { name, slug, description, icon } = req.body
  const s = slug || (name || '').toLowerCase().replace(/\s+/g, '-')
  const c = await Category.create({ name, slug: s, description, icon })
  res.status(201).json(c)
})

router.put('/:id', auth, auth.admin, async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(c)
})

router.delete('/:id', auth, auth.admin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router