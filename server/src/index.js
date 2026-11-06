require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null
const Purchase = require('./models/Purchase')
const app = express()
app.use(cors())
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
app.use('/uploads', express.static(uploadDir))
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
})
const upload = multer({ storage })
const auth = require('./middleware/auth')
app.post('/api/upload', auth, auth.admin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  res.json({ url: '/uploads/' + req.file.filename })
})
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orbit'
mongoose.connect(mongoUri).then(() => console.log('Mongo connected')).catch(e => console.error(e))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/favorites', require('./routes/favorites'))
app.use('/api/users', require('./routes/users'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/purchases', require('./routes/purchases'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/admin', require('./routes/admin'))

app.post('/api/create-payment-intent', auth, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe is not configured' })

  try {
    const { productId, amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { productId }
    })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/stripe-webhook', async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Stripe webhook is not configured' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    res.status(400).json({ error: `Webhook error: ${err.message}` })
    return
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const purchase = await Purchase.findOne({ paymentIntentId: paymentIntent.id })
    if (purchase) {
      purchase.status = 'completed'
      await purchase.save()
    }
  }

  res.json({ received: true })
})

app.get('/api/health', (req, res) => res.json({ ok: true }))
const port = process.env.PORT || 5000
app.listen(port, () => console.log('Server on', port))
