const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const VerificationCode = require('../models/VerificationCode')
const auth = require('../middleware/auth')
const { sendMail, loginCodeEmail, welcomeEmail } = require('../email')

const router = express.Router()

function generateCode() { return String(Math.floor(100000 + Math.random() * 900000)) }
function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}
function findUserByEmail(email) {
  const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return User.findOne({ email: { $regex: `^${escapedEmail}$`, $options: 'i' } })
}
async function sendWelcomeEmailTo(user, context) {
  const welcome = welcomeEmail({ name: user.name })
  try {
    await sendMail(user.email, welcome.subject, welcome.text, welcome.html, [])
    return true
  } catch (error) {
    console.error(`${context} welcome email delivery failed:`, error.message)
    return false
  }
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail || !password) return res.status(400).json({ error: 'Missing fields' })
  const exists = await findUserByEmail(normalizedEmail)
  if (exists) return res.status(409).json({ error: 'Email in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email: normalizedEmail, passwordHash, role: 'user' })
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'devsecret')
  const emailSent = await sendWelcomeEmailTo(user, 'Registration')
  const emailWarning = emailSent ? undefined : 'Your account was created, but the welcome email could not be delivered.'
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    emailSent,
    emailWarning,
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = await findUserByEmail(normalizedEmail)
  if (!user) return res.status(401).json({ error: 'No account found with this email' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Incorrect password' })
  const code = generateCode()
  await VerificationCode.deleteMany({ email: user.email, purpose: 'login' })
  await VerificationCode.create({ email: user.email, code, purpose: 'login', expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
  const emailContent = loginCodeEmail({ name: user.name, email: user.email, code })
  try {
    await sendMail(user.email, 'Your ORBIT login verification code', emailContent.text, emailContent.html, [])
  } catch (error) {
    console.error('Login verification email failed:', error.message)
    return res.status(502).json({ error: 'Could not send the verification email. Please try again.' })
  }
  res.json({ requiresVerification: true, email: user.email })
})

router.post('/verify-login', async (req, res) => {
  const { email, code } = req.body
  const rec = await VerificationCode.findOne({ email, code, purpose: 'login' })
  if (!rec) return res.status(401).json({ error: 'Invalid or expired code' })
  if (rec.expiresAt < new Date()) { await VerificationCode.deleteOne({ _id: rec._id }); return res.status(401).json({ error: 'Code expired' }) }
  await VerificationCode.deleteOne({ _id: rec._id })
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'User not found' })
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'devsecret')
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } })
})

router.post('/google', async (req, res) => {
  const { name, email, picture } = req.body
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return res.status(400).json({ error: 'Missing email' })
  let user = await findUserByEmail(normalizedEmail)
  const isNewUser = !user
  if (!user) {
    user = await User.create({ name, email: normalizedEmail, passwordHash: '', role: 'user', avatarUrl: picture })
  } else {
    if (picture) user.avatarUrl = picture
    if (name) user.name = name
    await user.save()
  }
  // OTP verification
  const code = generateCode()
  await VerificationCode.deleteMany({ email: user.email, purpose: 'login' })
  await VerificationCode.create({ email: user.email, code, purpose: 'login', expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
  const emailContent = loginCodeEmail({ name: user.name, email: user.email, code })
  try {
    await sendMail(user.email, 'Your ORBIT login verification code', emailContent.text, emailContent.html, [])
  } catch (error) {
    console.error('Google sign-in verification email failed:', error.message)
    return res.status(502).json({ error: 'Could not send the verification email. Please try again.' })
  }
  const welcomeEmailSent = isNewUser ? await sendWelcomeEmailTo(user, 'Google registration') : undefined
  res.json({ requiresVerification: true, email: user.email, welcomeEmailSent })
})

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } })
})

router.put('/profile', auth, async (req, res) => {
  const { name, avatarUrl } = req.body
  const user = await User.findByIdAndUpdate(req.user.id, { name, avatarUrl }, { new: true })
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } })
})

module.exports = router
