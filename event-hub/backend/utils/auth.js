import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const secret = process.env.JWT_SECRET || 'supersecretkey'
    const payload = jwt.verify(token, secret)
    req.user = payload.user || payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function isAdmin(req, res, next) {
  const role = req.user?.role
  if (role === 'admin' || role === 'superadmin') return next()
  return res.status(403).json({ error: 'Forbidden' })
}
