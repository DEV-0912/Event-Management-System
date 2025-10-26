import express from 'express';
import { allAsync, runAsync, getAsync } from '../db.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';

const router = express.Router();

// POST /api/events → create event
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, date, venue, speaker, food, formSchema, poster, description } = req.body;
    if (!name || !date || !venue) {
      return res.status(400).json({ error: 'name, date and venue are required' });

// GET /api/events/unowned → list events without createdBy (legacy)
router.get('/unowned', authMiddleware, isAdmin, async (_req, res) => {
  try {
    const rows = await allAsync('SELECT * FROM events WHERE createdBy IS NULL ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/claim → set createdBy if not already set
router.post('/:id/claim', authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const rows = await allAsync('SELECT * FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (ev.createdBy && ev.createdBy !== req.user?.email) {
      return res.status(409).json({ error: 'Event already claimed by another admin' });
    }
    await runAsync('UPDATE events SET createdBy = ? WHERE id = ?', [req.user?.email || null, id]);
    const updated = await allAsync('SELECT * FROM events WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id → fetch single event by id (hardened)
router.get('/:id', async (req, res) => {
  try {
    const raw = req.params.id;
    const id = Number.parseInt(raw, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const ev = await getAsync('SELECT * FROM events WHERE id = CAST(? AS INTEGER)', [id]);
    if (!ev) {
      console.warn('[events/:id] not found', { requested: raw, parsed: id });
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(ev);
  } catch (err) {
    console.error('[events/:id] error', err?.stack || err);
    res.status(500).json({ error: err.message });
  }
});
    }
    const createdBy = req.user?.email || null;
    const result = await runAsync(
      'INSERT INTO events (name, date, venue, speaker, food, formSchema, poster, createdBy, description) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, date, venue, speaker || '', food || '', formSchema ? JSON.stringify(formSchema) : null, poster || null, createdBy, description || null]
    );
    const created = await allAsync('SELECT * FROM events WHERE id = ?', [result.id]);
    res.status(201).json(created[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events → list events
router.get('/', async (_req, res) => {
  try {
    const events = await allAsync('SELECT * FROM events ORDER BY date DESC');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/mine → list only events created by current admin
router.get('/mine', authMiddleware, isAdmin, async (req, res) => {
  try {
    const email = req.user?.email || '';
    if (!email) return res.json([]);
    const events = await allAsync('SELECT * FROM events WHERE createdBy = ? ORDER BY date DESC', [email]);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/overview → admin metrics for own events
router.get('/overview', authMiddleware, isAdmin, async (req, res) => {
  try {
    const email = req.user?.email || '';
    if (!email) return res.json({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 });
    const totalEventsRow = await allAsync('SELECT COUNT(*) as c FROM events WHERE createdBy = ?', [email]);
    const regsRow = await allAsync(
      `SELECT COUNT(*) as totalRegs,
              SUM(CASE WHEN r.checkedIn = 1 THEN 1 ELSE 0 END) as totalCheckedIn
         FROM registrations r
         JOIN events e ON e.id = r.eventId
        WHERE e.createdBy = ?`,
      [email]
    );
    const totalEvents = totalEventsRow?.[0]?.c || 0;
    const totalRegistrations = regsRow?.[0]?.totalRegs || 0;
    const totalCheckedIn = regsRow?.[0]?.totalCheckedIn || 0;
    res.json({ totalEvents, totalRegistrations, totalCheckedIn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/unowned → list events without createdBy (legacy)
router.get('/unowned', authMiddleware, isAdmin, async (_req, res) => {
  try {
    const rows = await allAsync('SELECT * FROM events WHERE createdBy IS NULL ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/claim → set createdBy if not already set
router.post('/:id/claim', authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const rows = await allAsync('SELECT * FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (ev.createdBy && ev.createdBy !== req.user?.email) {
      return res.status(409).json({ error: 'Event already claimed by another admin' });
    }
    await runAsync('UPDATE events SET createdBy = ? WHERE id = ?', [req.user?.email || null, id]);
    const updated = await allAsync('SELECT * FROM events WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id → delete event
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      console.warn('[events:delete] invalid id', { raw: req.params.id });
      return res.status(400).json({ error: 'Invalid id' });
    }
    const email = req.user?.email || '';
    console.log('[events:delete] request', { id, by: email });

    // enforce ownership: only the creator can delete this event
    const rows = await allAsync('SELECT * FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) {
      console.warn('[events:delete] not found', { id });
      return res.status(404).json({ error: 'Event not found' });
    }
    if (ev.createdBy && ev.createdBy !== email) {
      console.warn('[events:delete] forbidden - not owner', { id, owner: ev.createdBy, by: email });
      return res.status(403).json({ error: 'Forbidden' });
    }

    await runAsync('DELETE FROM registrations WHERE eventId = ?', [id]);
    const result = await runAsync('DELETE FROM events WHERE id = ?', [id]);
    if (result.changes === 0) {
      console.warn('[events:delete] no rows affected', { id });
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log('[events:delete] success', { id, by: email });
    res.json({ success: true });
  } catch (err) {
    console.error('[events:delete] error', err?.stack || err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
