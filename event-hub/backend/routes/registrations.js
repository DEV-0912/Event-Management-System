// import express from 'express';
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
import { allAsync, getAsync, runAsync } from '../db.js';
import { authMiddleware, isAdmin } from '../utils/auth.js';
import { getDeptCodeFromEmail } from '../utils/department.js';

const router = express.Router();

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

    // Insert registration
    const result = await runAsync(
      'INSERT INTO registrations (name, email, contact, eventId, checkedIn, answers) VALUES (?,?,?,?,0,?)',
      [name, email, contact || '', eventId, answers ? JSON.stringify(answers) : null]
    );
    console.log('[REGISTER] new registration ID:', result.id);

    const payload = `${eventId}|${result.id}`;
    const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 300 });
    console.log('[REGISTER] QR generated, length:', qrDataUrl.length);

    // Send email with QR
    await sendEmailWithQR(email, 'Your Event Registration QR', 'Thank you for registering! Keep this email.', qrDataUrl, event);

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
    const out = dept ? rows.filter(r => getDeptCodeFromEmail(r.email) === dept) : rows;
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

    const [eventIdStr, userIdStr] = qr.split('|');
    const eventId = Number(eventIdStr);
    const userId = Number(userIdStr);
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
    const filtered = dept ? regs.filter(r => getDeptCodeFromEmail(r.email) === dept) : regs;
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
      `SELECT r.*, e.name as eventName, e.date as eventDate, e.venue as eventVenue, e.speaker as eventSpeaker, e.food as eventFood
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
