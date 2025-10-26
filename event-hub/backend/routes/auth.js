import express from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    console.log('[AUTH] /google request', { hasCredential: !!credential, ip: req.ip, ua: req.headers['user-agent'] })
    if (!credential) return res.status(400).json({ error: 'credential is required' })
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ error: 'GOOGLE_CLIENT_ID not configured on server' })
    const oAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID)

    const ticket = await oAuthClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) return res.status(401).json({ error: 'Invalid Google token' })

    const emailLc = (payload.email || '').toLowerCase()
    // Super Admins (highest privileges)
    const superSingle = (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase()
    const superList = (process.env.SUPER_ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    const isSuperAdmin = (!!superSingle && emailLc === superSingle) || (superList.length > 0 && superList.includes(emailLc))

    // Admins (normal admin privileges)
    const single = (process.env.ADMIN_EMAIL || '').toLowerCase()
    const list = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    const isAdmin = (!!single && emailLc === single) || (list.length > 0 && list.includes(emailLc))

    const user = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: isSuperAdmin ? 'superadmin' : (isAdmin ? 'admin' : 'student')
    }

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '7d' })
    console.log('[AUTH] success', { email: user.email, role: user.role })
    res.json({ token, user })
  } catch (err) {
    console.error('[AUTH] error', err?.stack || err)
    res.status(401).json({ error: 'Google authentication failed', details: err.message })
  }
})

// Return current user info from token
router.get('/me', (req, res) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(token, JWT_SECRET)
    res.json(payload.user || payload)
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

export default router
