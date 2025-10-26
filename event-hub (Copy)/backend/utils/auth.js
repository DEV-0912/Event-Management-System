import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    let token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      const raw = req.headers.cookie || ''
      const cookies = Object.fromEntries(raw.split(';').map(s => s.trim()).filter(Boolean).map(p => {
        const i = p.indexOf('=');
        const k = i>=0 ? decodeURIComponent(p.slice(0,i)) : p; 
        const v = i>=0 ? decodeURIComponent(p.slice(i+1)) : '';
        return [k, v]
      }))
      token = cookies['auth_token'] || null
    }
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
  if (role === 'admin') return next()
  return res.status(403).json({ error: 'Forbidden' })
}
