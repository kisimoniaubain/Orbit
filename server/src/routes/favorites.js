const express = require('express')
const Favorite = require('../models/Favorite')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  const favs = await Favorite.find({ user: req.user.id }).populate('product')
  res.json(favs.map(f => f.product).filter(Boolean))
})

router.post('/:productId', auth, async (req, res) => {
  try {
    await Favorite.create({ user: req.user.id, product: req.params.productId })
  } catch (e) {}
  res.json({ ok: true })
})

router.delete('/:productId', auth, async (req, res) => {
  await Favorite.deleteOne({ user: req.user.id, product: req.params.productId })
  res.json({ ok: true })
})

module.exports = router
