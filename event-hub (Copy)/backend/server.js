import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';
import eventsRouter from './routes/events.js';
import registrationsRouter from './routes/registrations.js';
import authRouter from './routes/auth.js';
import adsRouter from './routes/ads.js';
import { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6224;

// CORS with credentials for cookie-based auth
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser tools
    if (ORIGINS.length === 0) return cb(null, true); // fallback to allow all if not configured
    cb(null, ORIGINS.includes(origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(compression());

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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/registration', registrationsRouter);
app.use('/api/ads', adsRouter);

// Static serving (optional for any assets)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: '7d', immutable: true }));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
