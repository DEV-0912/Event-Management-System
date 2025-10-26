import express from 'express'
import { allAsync, runAsync } from '../db.js'
import { authMiddleware, isSuperAdmin } from '../utils/auth.js'

const router = express.Router()

// GET /api/ads -> public list of active ads
router.get('/', async (_req, res) => {
  try {
    const ads = await allAsync('SELECT * FROM ads WHERE active = 1 ORDER BY createdAt DESC')
    res.json(ads)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/ads/all -> superadmin list of all ads
router.get('/all', authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const ads = await allAsync('SELECT * FROM ads ORDER BY createdAt DESC')
    res.json(ads)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ads -> superadmin create ad { title, image(dataURL or URL), link, active }
router.post('/', authMiddleware, isSuperAdmin, async (req, res) => {
  try {
    const { title, image, link, active } = req.body
    if (!image) return res.status(400).json({ error: 'image is required' })
    const result = await runAsync(
      'INSERT INTO ads (title, image, link, active) VALUES (?,?,?,?)',
      [title || '', image, link || '', active ? 1 : 0]
    )
    const rows = await allAsync('SELECT * FROM ads WHERE id = ?', [result.id])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/ads/:id -> superadmin delete
router.delete('/:id', authMiddleware, isSuperAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid id' })
    const out = await runAsync('DELETE FROM ads WHERE id = ?', [id])
    if (out.changes === 0) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
