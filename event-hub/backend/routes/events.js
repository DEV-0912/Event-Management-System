import express from 'express';
import { allAsync, runAsync } from '../db.js';
import { authMiddleware, isAdmin, isSuperAdmin } from '../utils/auth.js';

const router = express.Router();

// POST /api/events → create event
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, date, venue, speaker, food, formSchema, poster, description } = req.body;
    if (!name || !date || !venue) {
      return res.status(400).json({ error: 'name, date and venue are required' });

// Superadmin: list all events
router.get('/all', authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const events = await allAsync('SELECT * FROM events ORDER BY date DESC');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: toggle registration QR availability per event
// POST /api/events/:id/qr-toggle  Body: { enabled: boolean }
router.post('/:id/qr-toggle', authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    // Ensure column exists
    try { await runAsync("ALTER TABLE events ADD COLUMN regQrEnabled INTEGER DEFAULT 0"); } catch {}

    const rows = await allAsync('SELECT createdBy FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    const me = (req.user?.email || '').toLowerCase();
    const role = req.user?.role;
    if (!(role === 'superadmin' || (ev.createdBy && me === String(ev.createdBy).toLowerCase()))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const enabled = req.body?.enabled === true || String(req.body?.enabled) === 'true' ? 1 : 0;
    await runAsync('UPDATE events SET regQrEnabled = ? WHERE id = ?', [enabled, id]);
    res.json({ success: true, regQrEnabled: enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: toggle registration open/closed for an event
// POST /api/events/:id/reg-toggle  Body: { closed: boolean }
router.post('/:id/reg-toggle', authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    // Add column if missing
    try { await runAsync("ALTER TABLE events ADD COLUMN regClosed INTEGER DEFAULT 0"); } catch {}

    const rows = await allAsync('SELECT createdBy FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    const me = (req.user?.email || '').toLowerCase();
    const role = req.user?.role;
    if (!(role === 'superadmin' || (ev.createdBy && me === String(ev.createdBy).toLowerCase()))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const closed = req.body?.closed === true || String(req.body?.closed) === 'true' ? 1 : 0;
    await runAsync('UPDATE events SET regClosed = ? WHERE id = ?', [closed, id]);
    res.json({ success: true, regClosed: closed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: set or clear registration capacity for an event
// POST /api/events/:id/reg-cap  Body: { enforced: boolean, cap: number }
router.post('/:id/reg-cap', authMiddleware, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    // Add columns if missing
    try { await runAsync("ALTER TABLE events ADD COLUMN regCapEnforced INTEGER DEFAULT 0"); } catch {}
    try { await runAsync("ALTER TABLE events ADD COLUMN regCap INTEGER DEFAULT 0"); } catch {}

    const rows = await allAsync('SELECT createdBy FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    const me = (req.user?.email || '').toLowerCase();
    const role = req.user?.role;
    if (!(role === 'superadmin' || (ev.createdBy && me === String(ev.createdBy).toLowerCase()))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const enforced = req.body?.enforced === true || String(req.body?.enforced) === 'true' ? 1 : 0;
    const capNum = Math.max(0, Number(req.body?.cap || 0)) | 0;
    await runAsync('UPDATE events SET regCapEnforced = ?, regCap = ? WHERE id = ?', [enforced, capNum, id]);
    res.json({ success: true, regCapEnforced: enforced, regCap: capNum });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Superadmin: per-admin overview stats
router.get('/overview/all', authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const rows = await allAsync(`
      SELECT 
        COALESCE(e.createdBy, '') as adminEmail,
        COUNT(DISTINCT e.id) as totalEvents,
        COUNT(r.id) as totalRegistrations,
        SUM(CASE WHEN r.checkedIn = 1 THEN 1 ELSE 0 END) as totalCheckedIn
      FROM events e
      LEFT JOIN registrations r ON r.eventId = e.id
      GROUP BY e.createdBy
      ORDER BY totalEvents DESC
    `);
    res.json(rows);
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
    }
    // Ensure required registration fields: Roll Number and Payment ID
    let schemaArr = [];
    try {
      if (Array.isArray(formSchema)) schemaArr = formSchema;
      else if (typeof formSchema === 'string' && formSchema.trim()) schemaArr = JSON.parse(formSchema);
    } catch {}
    const hasRoll = schemaArr.some(f => /roll/i.test(String(f?.label||'')));
    const hasPayment = schemaArr.some(f => /payment/i.test(String(f?.label||'')));
    if (!hasRoll) schemaArr.push({ id: (schemaArr.length+1), label: 'Roll Number', type: 'text', required: true });
    if (!hasPayment) schemaArr.push({ id: (schemaArr.length+1), label: 'Payment ID', type: 'text', required: true });

    const createdBy = req.user?.email || null;
    const result = await runAsync(
      'INSERT INTO events (name, date, venue, speaker, food, formSchema, poster, createdBy, description) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, date, venue, speaker || '', food || '', schemaArr.length ? JSON.stringify(schemaArr) : null, poster || null, createdBy, description || null]
    );
    // Optionally set registration capacity at creation
    try { await runAsync("ALTER TABLE events ADD COLUMN regCapEnforced INTEGER DEFAULT 0"); } catch {}
    try { await runAsync("ALTER TABLE events ADD COLUMN regCap INTEGER DEFAULT 0"); } catch {}
    if (req.body) {
      const enforced = req.body?.regCapEnforced === true || String(req.body?.regCapEnforced) === 'true' ? 1 : 0;
      const capNum = Math.max(0, Number(req.body?.regCap || 0)) | 0;
      if (enforced || capNum > 0) {
        await runAsync('UPDATE events SET regCapEnforced = ?, regCap = ? WHERE id = ?', [enforced, capNum, result.id]);
      }
    }
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
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const email = req.user?.email || '';
    const role = req.user?.role;

    // enforce ownership: only the creator can delete this event
    const rows = await allAsync('SELECT * FROM events WHERE id = ?', [id]);
    const ev = rows[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (role !== 'superadmin' && ev.createdBy && ev.createdBy !== email) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await runAsync('DELETE FROM registrations WHERE eventId = ?', [id]);
    const result = await runAsync('DELETE FROM events WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
