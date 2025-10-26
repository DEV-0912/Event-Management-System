    // If a Bearer token is present, block staff from registering
    try {
      const header = req.headers.authorization || ''
      const token = header.startsWith('Bearer ') ? header.slice(7) : ''
      if (token) {
        const secret = process.env.JWT_SECRET || 'supersecretkey'
        const payload = jwt.verify(token, secret)
        const role = payload?.user?.role || payload?.role
        if (role === 'admin' || role === 'superadmin') {
          return res.status(403).json({ error: 'Admins cannot register for events' })
        }
      }
    } catch {}

// import express from 'express';
import jwt from 'jsonwebtoken';
// import QRCode from 'qrcode';
// import nodemailer from 'nodemailer';
// import { allAsync, getAsync, runAsync } from '../db.js';
// import { authMiddleware, isAdmin } from '../utils/auth.js';

// const router = express.Router();

// function dataURLToBuffer(dataUrl) {
//   try {
//     const [, base64] = dataUrl.split(',');
//     return Buffer.from(base64, 'base64');
//   } catch {
//     return null;
//   }

/**
 * Ensure qrAllowance column exists (lazy migration)
 */
async function ensureQrAllowanceColumn() {
  try {
    await runAsync("ALTER TABLE registrations ADD COLUMN qrAllowance INTEGER DEFAULT 0");
    console.log('[MIGRATION] registrations.qrAllowance added');
  } catch (e) {
    // ignore if exists
  }
}

 

// async function sendEmailWithAttachment(toList, subject, html, attachment) {
//   const user = process.env.EMAIL_USER;
//   const pass = process.env.EMAIL_PASS;
//   if (!user || !pass) return; // optional

//   const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });

 
 
 
//   const to = Array.isArray(toList) ? toList.join(',') : String(toList || '');
//   const attachments = attachment ? [attachment] : [];
//   await transporter.sendMail({ from: user, to, subject, html, attachments });
// }
// }

// async function sendEmailWithQR(to, subject, text, qrDataUrl, event) {
//   const user = process.env.EMAIL_USER;
//   const pass = process.env.EMAIL_PASS;
//   if (!user || !pass) return; // optional

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user, pass }
//   });

 

// // POST /api/registration/event/:eventId/send-attendance
// // Body: { recipients: string[] }
// router.post('/event/:eventId/send-attendance', authMiddleware, isAdmin, async (req, res) => {
//   try {
//     const eventId = Number(req.params.eventId);
//     if (!eventId) return res.status(400).json({ error: 'Invalid eventId' });
//     const rows = await allAsync('SELECT * FROM events WHERE id = ?', [eventId]);
//     const ev = rows[0];
//     if (!ev) return res.status(404).json({ error: 'Event not found' });
//     const me = req.user?.email || '';
//     if (ev.createdBy && ev.createdBy !== me) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     const regs = await allAsync('SELECT * FROM registrations WHERE eventId = ? ORDER BY id ASC', [eventId]);
//     const headers = ['name','email','contact','checkedIn','rollNo'];
//     const lines = [headers.join(',')];
//     for (const r of regs) {
//       let roll = '';
//       try {
//         const ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null;
//         if (ans) {
//           const key = Object.keys(ans).find(k => /roll/i.test(k));
//           if (key) roll = Array.isArray(ans[key]) ? ans[key].join('|') : String(ans[key]);
//         }
//       } catch {}
//       const row = [r.name, r.email, r.contact || '', r.checkedIn ? 'Yes' : 'No', roll]
//         .map(v => {
//           const s = String(v ?? '');
//           return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
//         })
//         .join(',');
//       lines.push(row);
//     }
//     const csv = lines.join('\n');
//     const recipients = Array.isArray(req.body?.recipients) ? req.body.recipients.filter(Boolean) : [];
//     if (recipients.length === 0) return res.status(400).json({ error: 'recipients are required' });
//     const html = `
//       <div style="font-family:Arial,Helvetica,sans-serif;color:#111;padding:8px">
//         <p>Attendance sheet for <strong>${ev.name}</strong></p>
//         <p><strong>Date:</strong> ${ev.date || ''} &nbsp; <strong>Venue:</strong> ${ev.venue || ''}</p>
//         <p>Total registrations: ${regs.length}</p>
//       </div>`;
//     console.log('[ATTENDANCE] send', { eventId, to: recipients, total: regs.length });
//     await sendEmailWithAttachment(
//       recipients,
//       `Attendance - ${ev.name}`,
//       html,
//       { filename: `attendance-${eventId}.csv`, content: csv, contentType: 'text/csv' }
//     );
//     console.log('[ATTENDANCE] sent', { eventId, count: regs.length });
//     res.json({ success: true, count: regs.length });
//   } catch (err) {
//     console.error('[ATTENDANCE] error', err?.stack || err);
//     res.status(500).json({ error: err.message });
//   }
// });

//   const html = `
//     <div style="font-family:Arial,Helvetica,sans-serif;color:#111;padding:8px">
//       <p>${text}</p>
//       <p><strong>Event:</strong> ${event?.name || ''}</p>
//       <p><strong>Date:</strong> ${event?.date || ''}</p>
//       <p><strong>Venue:</strong> ${event?.venue || ''}</p>
//       <p>Show this QR at entry:</p>
//       <img src="cid:qrcode" alt="QR Code" style="max-width:280px;border:1px solid #e5e7eb;border-radius:8px"/>
//     </div>`;

//   const buf = dataURLToBuffer(qrDataUrl);
//   const attachments = buf ? [{ filename: 'qrcode.png', content: buf, contentType: 'image/png', cid: 'qrcode' }] : [];

//   await transporter.sendMail({ from: user, to, subject, html, attachments });
// }

// // POST /api/registration → register user, generate QR code (QR contains eventId|userId)
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, contact, eventId, answers } = req.body;
//     if (!name || !email || !eventId) {
//       return res.status(400).json({ error: 'name, email and eventId are required' });
//     }

//     // Ensure event exists
//     const event = await getAsync('SELECT * FROM events WHERE id = ?', [eventId]);
//     if (!event) return res.status(404).json({ error: 'Event not found' });

//     // Prevent duplicate registration for same event and email
//     const existing = await getAsync('SELECT id FROM registrations WHERE eventId = ? AND email = ?', [eventId, email]);
//     if (existing) {
//       return res.status(409).json({ error: 'You have already registered for this event.' });
//     }

//     const result = await runAsync(
//       'INSERT INTO registrations (name, email, contact, eventId, checkedIn, answers) VALUES (?,?,?,?,0,?)',
//       [name, email, contact || '', eventId, answers ? JSON.stringify(answers) : null]
//     );

//     const userId = result.id;
//     const payload = `${eventId}|${userId}`;
//     const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 300 });

//     try {
//       await sendEmailWithQR(email, 'Your Event Registration QR', 'Thank you for registering! Keep this email.', qrDataUrl, event);
//     } catch (e) {
//       // ignore email errors
//     }

//     // Store QR code in DB for later viewing
//     await runAsync('UPDATE registrations SET qrCode = ? WHERE id = ?', [qrDataUrl, userId]);
//     const registration = await getAsync('SELECT * FROM registrations WHERE id = ?', [userId]);
//     res.status(201).json({ registration, qr: qrDataUrl, payload });
//   } catch (err) {
//     if (err?.code === 'SQLITE_CONSTRAINT') {
//       return res.status(409).json({ error: 'You have already registered for this event.' });
//     }
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST /api/registration/checkin → scan QR code, mark user as checkedIn
// router.post('/checkin', async (req, res) => {
//   try {
//     const { qr } = req.body;
//     console.log('[CHECKIN] request', { ip: req.ip, qr, ua: req.headers['user-agent'] });
//     if (!qr) return res.status(400).json({ error: 'qr is required' });

//     const [eventIdStr, userIdStr] = qr.split('|');
//     const eventId = Number(eventIdStr);
//     const userId = Number(userIdStr);

//     if (!eventId || !userId) return res.status(400).json({ error: 'Invalid QR payload' });

//     const reg = await getAsync('SELECT * FROM registrations WHERE id = ? AND eventId = ?', [userId, eventId]);
//     if (!reg) return res.status(404).json({ error: 'Registration not found' });

//     await runAsync('UPDATE registrations SET checkedIn = 1 WHERE id = ?', [userId]);
//     const updated = await getAsync('SELECT * FROM registrations WHERE id = ?', [userId]);
//     console.log('[CHECKIN] success', { eventId, userId, email: updated?.email, checkedIn: updated?.checkedIn });
//     res.json({ success: true, registration: updated });
//   } catch (err) {
//     console.error('[CHECKIN] error', err?.stack || err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Helper: list registrations for an event (not required but useful)
// router.get('/event/:eventId', async (req, res) => {
//   try {
//     const eventId = Number(req.params.eventId);
//     const regs = await allAsync('SELECT * FROM registrations WHERE eventId = ?', [eventId]);
//     res.json(regs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/registration/mine → get current user's registrations with event details
// router.get('/mine', authMiddleware, async (req, res) => {
//   try {
//     const email = req.user?.email;
//     if (!email) return res.status(401).json({ error: 'Unauthorized' });
//     const rows = await allAsync(
//       `SELECT r.*, e.name as eventName, e.date as eventDate, e.venue as eventVenue, e.speaker as eventSpeaker, e.food as eventFood
//        FROM registrations r
//        JOIN events e ON e.id = r.eventId
//        WHERE r.email = ?
//        ORDER BY e.date DESC`,
//       [email]
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from 'express';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { allAsync, getAsync, runAsync } from '../db.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';
import { getDeptCodeFromEmail, getDeptCodeFromRoll } from '../utils/department.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * Ensure qrCount column exists (lazy migration)
 */
async function ensureQrCountColumn() {
  try {
    await runAsync("ALTER TABLE registrations ADD COLUMN qrCount INTEGER DEFAULT 0");
    console.log('[MIGRATION] registrations.qrCount added');
  } catch (e) {
    // ignore if exists
  }
}

/**
 * Build signed, expiring QR payload
 */
function buildSignedQrPayload(eventId, regId, ttlMs = 10000) {
  const exp = Date.now() + Math.max(1000, ttlMs);
  const secret = process.env.QR_SECRET || (process.env.JWT_SECRET || 'eventhub_dev_secret');
  const data = `${eventId}|${regId}|${exp}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest('hex').slice(0, 32);
  return { payload: `${data}|${sig}`, exp };
}

/**
 * Convert data URL to Buffer
 */
function dataURLToBuffer(dataUrl) {
  try {
    const [, base64] = dataUrl.split(',');
    const buf = Buffer.from(base64, 'base64');
    console.log('[DATAURL->BUFFER] success, size:', buf.length);
    return buf;
  } catch (err) {
    console.error('[DATAURL->BUFFER] error', err);
    return null;
  }
}

/**
 * Send email with optional attachment
 */
async function sendEmailWithAttachment(toList, subject, html, attachment) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn('[EMAIL] credentials not set, skipping email');
    return;
  }

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const to = Array.isArray(toList) ? toList.join(',') : String(toList || '');
  const attachments = attachment ? [attachment] : [];

  console.log('[EMAIL] sending', { to, subject, attachments });
  try {
    const info = await transporter.sendMail({ from: user, to, subject, html, attachments });
    console.log('[EMAIL] sent', info.messageId);
  } catch (err) {
    console.error('[EMAIL] error', err);
  }
}

/**
 * Send email with QR code embedded
 */
async function sendEmailWithQR(to, subject, text, qrDataUrl, event) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn('[EMAIL-QR] credentials not set, skipping email');
    return;
  }

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;padding:8px">
      <p>${text}</p>
      <p><strong>Event:</strong> ${event?.name || ''}</p>
      <p><strong>Date:</strong> ${event?.date || ''}</p>
      <p><strong>Venue:</strong> ${event?.venue || ''}</p>
      <p>Show this QR at entry:</p>
      <img src="cid:qrcode" alt="QR Code" style="max-width:280px;border:1px solid #e5e7eb;border-radius:8px"/>
    </div>`;

  const buf = dataURLToBuffer(qrDataUrl);
  const attachments = buf ? [{ filename: 'qrcode.png', content: buf, contentType: 'image/png', cid: 'qrcode' }] : [];

  console.log('[EMAIL-QR] sending', { to, subject, qrSize: buf?.length || 0 });
  try {
    const info = await transporter.sendMail({ from: user, to, subject, html, attachments });
    console.log('[EMAIL-QR] sent', info.messageId);
  } catch (err) {
    console.error('[EMAIL-QR] error', err);
  }
}

/**
 * Register a user for an event and generate QR code
 */
router.post('/', async (req, res) => {
  try {
    console.log('[REGISTER] request body:', req.body);
    const { name, email, contact, eventId, answers } = req.body;

    if (!name || !email || !eventId) {
      console.warn('[REGISTER] missing required fields');
      return res.status(400).json({ error: 'name, email and eventId are required' });
    }

    // If a Bearer token is present, block staff from registering
    try {
      const header = req.headers.authorization || ''
      const token = header.startsWith('Bearer ') ? header.slice(7) : ''
      if (token) {
        const secret = process.env.JWT_SECRET || 'supersecretkey'
        const payload = jwt.verify(token, secret)
        const role = payload?.user?.role || payload?.role
        if (role === 'admin' || role === 'superadmin') {
          return res.status(403).json({ error: 'Admins cannot register for events' })
        }
      }
    } catch {}

    // Check if event exists
    const event = await getAsync('SELECT * FROM events WHERE id = ?', [eventId]);
    if (!event) {
      console.warn('[REGISTER] event not found:', eventId);
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log('[REGISTER] event found:', event);

    // Check duplicate registration
    const existing = await getAsync('SELECT id FROM registrations WHERE eventId = ? AND email = ?', [eventId, email]);
    if (existing) {
      console.warn('[REGISTER] already registered:', email);
      return res.status(409).json({ error: 'You have already registered for this event.' });
    }

    // Registration window enforcement
    try {
      const now = Date.now();
      const start = event?.startAt ? new Date(event.startAt).getTime() : (event?.date ? new Date(event.date).getTime() : NaN);
      const regCloseAt = event?.regCloseAt ? new Date(event.regCloseAt).getTime() : NaN;
      const manualClosed = Number(event?.regClosed || 0) === 1;
      const started = Number.isFinite(start) && now >= start;
      const deadlinePassed = Number.isFinite(regCloseAt) && now > regCloseAt;
      const allowAfterStart = Number(event?.allowAfterStart || 0) === 1;

      // Check manual close
      if (manualClosed) {
        return res.status(403).json({ error: 'Registration closed: Registration closed by admin' });
      }

      // Check deadline
      if (deadlinePassed) {
        return res.status(403).json({ error: 'Registration closed: Registration deadline passed' });
      }

      // Check if event started (unless allowAfterStart is enabled)
      if (started && !allowAfterStart) {
        return res.status(403).json({ error: 'Registration closed: Event already started' });
      }

      // Check registration cap
      const regCapEnforced = Number(event?.regCapEnforced || 0) === 1;
      const regCap = Number(event?.regCap || 0);
      if (regCapEnforced && regCap > 0) {
        const countResult = await getAsync('SELECT COUNT(*) as count FROM registrations WHERE eventId = ?', [eventId]);
        const currentCount = countResult?.count || 0;
        if (currentCount >= regCap) {
          return res.status(403).json({ error: 'Registration closed: Registration capacity reached' });
        }
      }
    } catch {}

    // If event form schema asks for Roll/Payment, enforce them in answers
    try {
      const schema = event?.formSchema ? (typeof event.formSchema === 'string' ? JSON.parse(event.formSchema) : event.formSchema) : []
      const requiresRoll = Array.isArray(schema) && schema.some(f => /roll/i.test(String(f?.label || '')))
      const requiresPayment = Array.isArray(schema) && schema.some(f => /payment/i.test(String(f?.label || '')))
      const ans = answers ? (typeof answers === 'string' ? JSON.parse(answers) : answers) : null
      if (requiresRoll) {
        const hasRoll = ans && Object.keys(ans).some(k => /roll/i.test(k) && String(ans[k] ?? '').trim().length > 0)
        if (!hasRoll) return res.status(400).json({ error: 'Roll number is required for this event' })
      }
      if (requiresPayment) {
        const hasPayment = ans && Object.keys(ans).some(k => /payment/i.test(k) && String(ans[k] ?? '').trim().length > 0)
        if (!hasPayment) return res.status(400).json({ error: 'Payment ID is required for this event' })
      }
    } catch {}

    // Insert registration
    const result = await runAsync(
      'INSERT INTO registrations (name, email, contact, eventId, checkedIn, answers) VALUES (?,?,?,?,0,?)',
      [name, email, contact || '', eventId, answers ? JSON.stringify(answers) : null]
    );
    console.log('[REGISTER] new registration ID:', result.id);

    const payload = `${eventId}|${result.id}`;
    const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 300 });
    console.log('[REGISTER] QR generated, length:', qrDataUrl.length);

    // Optional: send email with QR (disabled by default)
    if (String(process.env.SEND_QR_EMAIL || 'false').toLowerCase() === 'true') {
      await sendEmailWithQR(email, 'Your Event Registration QR', 'Thank you for registering! Keep this email.', qrDataUrl, event);
    }

    // Store QR in DB
    await runAsync('UPDATE registrations SET qrCode = ? WHERE id = ?', [qrDataUrl, result.id]);
    const registration = await getAsync('SELECT * FROM registrations WHERE id = ?', [result.id]);
    console.log('[REGISTER] final registration saved:', registration);

    res.status(201).json({ registration, qr: qrDataUrl, payload });
  } catch (err) {
    console.error('[REGISTER] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: list registrations (optionally by dept and/or eventId)
 * GET /api/registration/admin?dept=66&eventId=123
 */
router.get('/admin', authMiddleware, isAdmin, async (req, res) => {
  try {
    const dept = (req.query?.dept || '').trim();
    const eventId = req.query?.eventId ? Number(req.query.eventId) : null;
    const params = [];
    let sql = `SELECT r.*, e.name as eventName, e.date as eventDate, e.venue as eventVenue
               FROM registrations r JOIN events e ON e.id = r.eventId`;
    if (eventId) {
      sql += ' WHERE r.eventId = ?';
      params.push(eventId);
    }
    sql += ' ORDER BY e.date DESC, r.id DESC';
    const rows = await allAsync(sql, params);
    const out = dept ? rows.filter(r => {
      // Try roll first
      let roll = '';
      try {
        const ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null;
        if (ans) {
          const key = Object.keys(ans).find(k => /roll/i.test(k));
          if (key) roll = Array.isArray(ans[key]) ? ans[key].join('|') : String(ans[key]);
        }
      } catch {}
      const code = getDeptCodeFromRoll(roll) || getDeptCodeFromEmail(r.email);
      return code === dept;
    }) : rows;
    res.json(out);
  } catch (err) {
    console.error('[ADMIN LIST] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Check-in user by scanning QR
 */
router.post('/checkin', async (req, res) => {
  try {
    console.log('[CHECKIN] request body:', req.body);
    const { qr } = req.body;
    if (!qr) return res.status(400).json({ error: 'qr is required' });

    const parts = String(qr).split('|');
    let eventId = 0;
    let userId = 0;

    if (parts.length === 2) {
      // Legacy payload: eventId|registrationId (no expiry)
      const [eventIdStr, userIdStr] = parts;
      eventId = Number(eventIdStr);
      userId = Number(userIdStr);
    } else if (parts.length === 4) {
      // New payload: eventId|registrationId|exp|sig
      const [eventIdStr, userIdStr, expStr, sig] = parts;
      eventId = Number(eventIdStr);
      userId = Number(userIdStr);
      const exp = Number(expStr);
      if (!exp || Date.now() > exp) {
        return res.status(410).json({ error: 'QR expired' });
      }
      const secret = process.env.QR_SECRET || (process.env.JWT_SECRET || 'eventhub_dev_secret');
      const data = `${eventId}|${userId}|${exp}`;
      const expected = crypto.createHmac('sha256', secret).update(data).digest('hex').slice(0, 32);
      if (sig !== expected) {
        return res.status(400).json({ error: 'Invalid QR signature' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid QR payload' });
    }

    console.log('[CHECKIN] parsed QR:', { eventId, userId });

    const reg = await getAsync('SELECT * FROM registrations WHERE id = ? AND eventId = ?', [userId, eventId]);
    if (!reg) return res.status(404).json({ error: 'Registration not found' });

    await runAsync("UPDATE registrations SET checkedIn = 1, checkedInAt = datetime('now') WHERE id = ?", [userId]);
    const updated = await getAsync('SELECT * FROM registrations WHERE id = ?', [userId]);
    console.log('[CHECKIN] updated registration:', updated);

    res.json({ success: true, registration: updated });
  } catch (err) {
    console.error('[CHECKIN] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Generate a short-lived QR for a registration (owner only)
 * POST /api/registration/:id/generate-qr
 */
router.post('/:id/generate-qr', authMiddleware, async (req, res) => {
  try {
    await ensureQrCountColumn();
    await ensureQrAllowanceColumn();
    const regId = Number(req.params.id);
    if (!regId) return res.status(400).json({ error: 'Invalid registration id' });

    const reg = await getAsync('SELECT * FROM registrations WHERE id = ?', [regId]);
    if (!reg) return res.status(404).json({ error: 'Registration not found' });

    const email = (req.user?.email || '').toLowerCase();
    if (!email || email !== String(reg.email).toLowerCase()) {
      await runAsync('INSERT INTO qr_logs (eventId, regId, userEmail, status, detail) VALUES (?,?,?,?,?)', [reg.eventId, reg.id, email, 'denied', 'not_owner']);
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Fetch event (ensure exists); no toggle enforcement
    const ev = await getAsync('SELECT * FROM events WHERE id = ?', [reg.eventId]);
    if (!ev) {
      await runAsync('INSERT INTO qr_logs (eventId, regId, userEmail, status, detail) VALUES (?,?,?,?,?)', [reg.eventId, reg.id, email, 'denied', 'event_not_found']);
      return res.status(404).json({ error: 'Event not found' });
    }

    const currentCount = Number(reg.qrCount || 0);
    const allowance = Number(reg.qrAllowance || 0);
    const maxAllowed = 2 + Math.max(0, allowance);
    if (currentCount >= maxAllowed) {
      await runAsync('INSERT INTO qr_logs (eventId, regId, userEmail, status, detail) VALUES (?,?,?,?,?)', [reg.eventId, reg.id, email, 'denied', 'limit_reached']);
      return res.status(429).json({ error: 'QR generation limit reached' });
    }

    const { payload, exp } = buildSignedQrPayload(reg.eventId, reg.id, 10000);
    const dataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 300 });

    await runAsync('UPDATE registrations SET qrCount = ? WHERE id = ?', [currentCount + 1, regId]);
    await runAsync('INSERT INTO qr_logs (eventId, regId, userEmail, status, detail) VALUES (?,?,?,?,?)', [reg.eventId, reg.id, email, 'generated', 'ok']);

    res.json({ dataUrl, payload, expiresAt: exp, remaining: Math.max(0, maxAllowed - (currentCount + 1)), limit: maxAllowed });
  } catch (err) {
    console.error('[GENERATE-QR] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: grant extra QR attempts (+2) for a specific registration
 * POST /api/registration/:id/qr-grant
 */
router.post('/:id/qr-grant', authMiddleware, isAdmin, async (req, res) => {
  try {
    await ensureQrAllowanceColumn();
    const regId = Number(req.params.id);
    if (!regId) return res.status(400).json({ error: 'Invalid registration id' });
    const reg = await getAsync('SELECT r.*, e.createdBy as owner FROM registrations r JOIN events e ON e.id = r.eventId WHERE r.id = ?', [regId]);
    if (!reg) return res.status(404).json({ error: 'Registration not found' });
    const me = (req.user?.email || '').toLowerCase();
    const role = req.user?.role;
    const owner = String(reg.owner || '').toLowerCase();
    if (!(role === 'superadmin' || (owner && me === owner))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Allow grant only once (+2 attempts maximum)
    const currentAllowance = Number(reg.qrAllowance || 0);
    if (currentAllowance >= 2) {
      return res.status(409).json({ error: 'QR allowance already granted' });
    }
    const nextAllowance = currentAllowance + 2;
    await runAsync('UPDATE registrations SET qrAllowance = ? WHERE id = ?', [nextAllowance, regId]);
    await runAsync('INSERT INTO audit_logs (actorEmail, action, targetType, targetId, meta) VALUES (?,?,?,?,?)', [me, 'qr_grant', 'registration', regId, JSON.stringify({ delta: 2, eventId: reg.eventId })]);
    res.json({ success: true, qrAllowance: nextAllowance });
  } catch (err) {
    console.error('[QR-GRANT] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: reset QR attempts to 0 for a registration (owner admin or superadmin)
 */
router.post('/:id/qr-reset', authMiddleware, async (req, res) => {
  try {
    const regId = Number(req.params.id);
    if (!regId) return res.status(400).json({ error: 'Invalid registration id' });
    const reg = await getAsync('SELECT r.*, e.createdBy as owner FROM registrations r JOIN events e ON e.id = r.eventId WHERE r.id = ?', [regId]);
    if (!reg) return res.status(404).json({ error: 'Registration not found' });

    const role = req.user?.role;
    const me = (req.user?.email || '').toLowerCase();
    const owner = String(reg.owner || '').toLowerCase();
    if (!(role === 'superadmin' || (owner && me === owner))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await runAsync('UPDATE registrations SET qrCount = 0 WHERE id = ?', [regId]);
    await runAsync('INSERT INTO audit_logs (actorEmail, action, targetType, targetId, meta) VALUES (?,?,?,?,?)', [me, 'qr_reset', 'registration', regId, JSON.stringify({ eventId: reg.eventId })]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: generate QR code data URL for a given registration link
 * POST /api/registration/qr
 * Body: { url: string }
 */
router.post('/qr', authMiddleware, isAdmin, async (req, res) => {
  try {
    const url = String(req.body?.url || '').trim();
    if (!url) return res.status(400).json({ error: 'url is required' });
    const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 300 });
    res.json({ dataUrl });
  } catch (err) {
    console.error('[QR GENERATE] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Send attendance CSV to recipients
 */
router.post('/event/:eventId/send-attendance', authMiddleware, isAdmin, async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    console.log('[ATTENDANCE] sending for eventId:', eventId);

    const ev = (await allAsync('SELECT * FROM events WHERE id = ?', [eventId]))[0];
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    console.log('[ATTENDANCE] event data:', ev);

    // Only checked-in attendees, order by check-in time
    const regs = await allAsync("SELECT * FROM registrations WHERE eventId = ? AND checkedIn = 1 ORDER BY datetime(checkedInAt) ASC, id ASC", [eventId]);
    console.log('[ATTENDANCE] total checked-in:', regs.length);

    // Build CSV
    const headers = ['name', 'email', 'contact', 'checkedInAt', 'rollNo'];
    const lines = [headers.join(',')];

    for (const r of regs) {
      let roll = '';
      try {
        const ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null;
        if (ans) {
          const key = Object.keys(ans).find(k => /roll/i.test(k));
          if (key) roll = Array.isArray(ans[key]) ? ans[key].join('|') : String(ans[key]);
        }
      } catch {}
      const row = [r.name, r.email, r.contact || '', r.checkedInAt || '', roll]
        .map(v => {
          const s = String(v ?? '');
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
        })
        .join(',');
      lines.push(row);
    }
    const csv = lines.join('\n');
    console.log('[ATTENDANCE] CSV content:\n', csv);

    // Use admin-provided recipients; still only the checked-in data is exported in CSV
    const recipients = Array.isArray(req.body?.recipients)
      ? Array.from(new Set(req.body.recipients.map(e => String(e).trim()).filter(e => e && e.includes('@'))))
      : [];
    if (recipients.length === 0) return res.status(400).json({ error: 'recipients are required' });
    console.log('[ATTENDANCE] recipients (admin-provided):', recipients);

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;padding:8px">
        <p>Attendance sheet for <strong>${ev.name}</strong></p>
        <p><strong>Date:</strong> ${ev.date || ''} &nbsp; <strong>Venue:</strong> ${ev.venue || ''}</p>
        <p>Total checked-in: ${regs.length}</p>
      </div>`;

    await sendEmailWithAttachment(
      recipients,
      `Attendance - ${ev.name}`,
      html,
      { filename: `attendance-${eventId}.csv`, content: csv, contentType: 'text/csv' }
    );

    console.log('[ATTENDANCE] email sent successfully');
    res.json({ success: true, count: regs.length });
  } catch (err) {
    console.error('[ATTENDANCE] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * List registrations for an event
 */
router.get('/event/:eventId', async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const regs = await allAsync('SELECT * FROM registrations WHERE eventId = ?', [eventId]);
    const dept = (req.query?.dept || '').trim();
    const filtered = dept ? regs.filter(r => {
      let roll = '';
      try {
        const ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null;
        if (ans) {
          const key = Object.keys(ans).find(k => /roll/i.test(k));
          if (key) roll = Array.isArray(ans[key]) ? ans[key].join('|') : String(ans[key]);
        }
      } catch {}
      const code = getDeptCodeFromRoll(roll) || getDeptCodeFromEmail(r.email);
      return code === dept;
    }) : regs;
    console.log('[LIST] registrations for eventId', eventId, 'dept:', dept || 'ALL', 'total:', filtered.length);
    res.json(filtered);
  } catch (err) {
    console.error('[LIST] error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get current user's registrations
 */
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'Unauthorized' });

    const rows = await allAsync(
      `SELECT r.*, e.name as eventName, e.date as eventDate, e.endAt as eventEndAt, e.venue as eventVenue, e.speaker as eventSpeaker, e.food as eventFood
       FROM registrations r
       JOIN events e ON e.id = r.eventId
       WHERE r.email = ?
       ORDER BY e.date DESC`,
      [email]
    );
    console.log('[MINE] registrations for', email, rows.length);
    res.json(rows);
  } catch (err) {
    console.error('[MINE] error', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
