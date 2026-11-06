const jwt = require('jsonwebtoken')
module.exports = function auth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'devsecret'); next() }
  catch { res.status(401).json({ error: 'Invalid token' }) }
}
module.exports.admin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  next()
}
