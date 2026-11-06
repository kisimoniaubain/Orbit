const express = require('express')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', async (req, res) => {
  const { q, category, price, sort, includeUnpublished } = req.query
  const filter = {}
  if (includeUnpublished !== '1') filter.published = { $ne: false }
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }]
  if (category && category !== 'all') filter.categoryId = category
  if (price && price !== 'all') filter.priceType = price
  let query = Product.find(filter)
  if (sort === 'Newest') query = query.sort({ updatedAt: -1 })
  if (sort === 'Price Low to High') query = query.sort({ price: 1 })
  if (sort === 'Price High to Low') query = query.sort({ price: -1 })
  const products = await query.limit(200)
  res.json(products)
})

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id).catch(() => null) || await Product.findOne({ id: req.params.id })
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

router.post('/', auth, auth.admin, async (req, res) => {
  const p = await Product.create(req.body)
  res.status(201).json(p)
})

router.put('/:id', auth, auth.admin, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(p)
})

router.delete('/:id', auth, auth.admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
