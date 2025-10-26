import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import eventsRouter from './routes/events.js';
import registrationsRouter from './routes/registrations.js';
import authRouter from './routes/auth.js';
import adsRouter from './routes/ads.js';
import { initDb, allAsync, runAsync } from './db.js';
import { authMiddleware, isAdmin } from './utils/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6224;
// Optional base path prefix for deployments behind a subpath (e.g., '/ef-be').
// Examples:
//   BASE_PATH=''       -> routes available at '/api/*'
//   BASE_PATH='/ef-be' -> routes available at '/ef-be/api/*'
const normalizeBasePath = (p) => {
  if (!p) return '';
  let s = String(p).trim();
  if (!s.startsWith('/')) s = '/' + s;
  if (s !== '/' && s.endsWith('/')) s = s.slice(0, -1);
  return s === '/' ? '' : s;
};
const BASE_PATH = normalizeBasePath(process.env.BASE_PATH || process.env.API_BASE_PATH || '');
const API_PREFIX = `${BASE_PATH}/api`;

// Permissive CORS (allow all origins). Do NOT use with credentials.
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// Preflight
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// Allow popups/postMessage between different origins (Google login popup)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Request logger for all routes
app.use((req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  const bodyPreview = req.body ? JSON.stringify(req.body).slice(0, 300) : '';
  const q = Object.keys(req.query || {}).length ? `?${new URLSearchParams(req.query).toString()}` : '';
  console.log(`[REQ] ${method} ${originalUrl}${q} body=${bodyPreview}`);
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[RES] ${method} ${originalUrl} -> ${res.statusCode} ${ms}ms`);
  });
  next();
});

initDb();

// Health under both legacy and prefixed paths
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({ status: 'ok' });
});

// Inline admin event routes to guarantee availability even if router wiring differs in deployment
const mountAdminEventRoutes = (base) => {
  // POST {base}/events/:id/qr-toggle  Body: { enabled: boolean }
  app.post(`${base}/events/:id/qr-toggle`, authMiddleware, isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid id' });
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

  // POST {base}/events/:id/reg-toggle  Body: { closed: boolean }
  app.post(`${base}/events/:id/reg-toggle`, authMiddleware, isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid id' });
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

  // POST {base}/events/:id/reg-cap  Body: { enforced: boolean, cap: number }
  app.post(`${base}/events/:id/reg-cap`, authMiddleware, isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid id' });
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
};

// Mount at legacy '/api' and, if applicable, at '{BASE_PATH}/api'
mountAdminEventRoutes('/api');
if (API_PREFIX !== '/api') mountAdminEventRoutes(API_PREFIX);

// Mount routers under legacy '/api/*'
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/registration', registrationsRouter);
app.use('/api/ads', adsRouter);

// Also mount under optional prefixed path '{BASE_PATH}/api/*' when a prefix is set
if (API_PREFIX !== '/api') {
  app.use(`${API_PREFIX}/auth`, authRouter);
  app.use(`${API_PREFIX}/events`, eventsRouter);
  app.use(`${API_PREFIX}/registration`, registrationsRouter);
  app.use(`${API_PREFIX}/ads`, adsRouter);
}

// Static serving (optional for any assets)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  if (BASE_PATH) {
    console.log(`API available at: ${API_PREFIX}`);
  } else {
    console.log(`API available at: /api`);
  }
});
