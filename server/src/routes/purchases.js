const express = require('express')
const Purchase = require('../models/Purchase')
const auth = require('../middleware/auth')
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null
const router = express.Router()

router.get('/', auth, auth.admin, async (req, res) => {
  const list = await Purchase.find().populate('user', 'name email').populate('product', 'name price').sort({ createdAt: -1 }).limit(200)
  res.json(list)
})

router.get('/mine', auth, async (req, res) => {
  const list = await Purchase.find({ user: req.user.id }).populate('product', 'name image').sort({ createdAt: -1 })
  res.json(list)
})
router.get('/:id', auth, auth.admin, async (req, res) => {
  const p = await Purchase.findById(req.params.id).populate('user', 'name email').populate('product', 'name price')
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

router.post('/', auth, async (req, res) => {
  try {
    const { productId, productName, amount } = req.body

    if (!stripe) {
      const p = await Purchase.create({
        user: req.user.id,
        product: productId,
        productName,
        amount,
        paymentMethod: 'manual',
        status: 'completed'
      })

      return res.status(201).json({ ...p._doc, clientSecret: null })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { productId }
    })

    const p = await Purchase.create({
      user: req.user.id,
      product: productId,
      productName,
      amount,
      paymentMethod: 'stripe',
      status: 'pending',
      paymentIntentId: paymentIntent.id
    })

    res.status(201).json({ ...p._doc, clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router