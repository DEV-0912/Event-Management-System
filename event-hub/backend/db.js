import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DATABASE_URL || 'eventhub.sqlite';
const dbPath = path.resolve(__dirname, dbFile);

sqlite3.verbose();
export const db = new sqlite3.Database(dbPath);

export function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      venue TEXT NOT NULL,
      speaker TEXT,
      food TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      contact TEXT,
      eventId INTEGER NOT NULL,
      checkedIn INTEGER DEFAULT 0,
      FOREIGN KEY(eventId) REFERENCES events(id)
    );`);

    // Ads table for admin-managed advertisements
    db.run(`CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      image TEXT, -- data URL or hosted URL
      link TEXT,
      active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now'))
    );`);

    // Migration: ensure additional columns exist on registrations
    db.all(`PRAGMA table_info(registrations)`, (err, rows) => {
      if (err) return; // ignore silently
      const hasQr = Array.isArray(rows) && rows.some(r => r.name === 'qrCode');
      const hasAnswers = Array.isArray(rows) && rows.some(r => r.name === 'answers');
      const hasCheckedInAt = Array.isArray(rows) && rows.some(r => r.name === 'checkedInAt');
      if (!hasQr) {
        db.run(`ALTER TABLE registrations ADD COLUMN qrCode TEXT`, () => {});
      }
      if (!hasAnswers) {
        db.run(`ALTER TABLE registrations ADD COLUMN answers TEXT`, () => {});
      }
      if (!hasCheckedInAt) {
        db.run(`ALTER TABLE registrations ADD COLUMN checkedInAt TEXT`, () => {});
      }
    });

    // Cleanup duplicates before adding unique index (keep earliest id per event+email)
    db.run(
      `DELETE FROM registrations
       WHERE id NOT IN (
         SELECT MIN(id) FROM registrations GROUP BY eventId, email
       )`
    );

    // Migration: unique index to prevent duplicate registration per event per email
    db.run(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_email
       ON registrations (eventId, email)`
    );

    // Migration: ensure formSchema on events
    db.all(`PRAGMA table_info(events)`, (err, rows) => {
      if (err) return;
      const hasFormSchema = Array.isArray(rows) && rows.some(r => r.name === 'formSchema');
      const hasPoster = Array.isArray(rows) && rows.some(r => r.name === 'poster');
      const hasCreatedBy = Array.isArray(rows) && rows.some(r => r.name === 'createdBy');
      const hasDescription = Array.isArray(rows) && rows.some(r => r.name === 'description');
      const hasQrEnabled = Array.isArray(rows) && rows.some(r => r.name === 'qrEnabled');
      const hasArchived = Array.isArray(rows) && rows.some(r => r.name === 'archived');
      const hasStartAt = Array.isArray(rows) && rows.some(r => r.name === 'startAt');
      const hasEndAt = Array.isArray(rows) && rows.some(r => r.name === 'endAt');
      const hasRegCap = Array.isArray(rows) && rows.some(r => r.name === 'regCap');
      const hasRegCapEnforced = Array.isArray(rows) && rows.some(r => r.name === 'regCapEnforced');
      const hasAllowAfterStart = Array.isArray(rows) && rows.some(r => r.name === 'allowAfterStart');
      if (!hasFormSchema) {
        db.run(`ALTER TABLE events ADD COLUMN formSchema TEXT`, () => {});
      }
      if (!hasPoster) {
        db.run(`ALTER TABLE events ADD COLUMN poster TEXT`, () => {});
      }
      if (!hasCreatedBy) {
        db.run(`ALTER TABLE events ADD COLUMN createdBy TEXT`, () => {});
      }
      if (!hasDescription) {
        db.run(`ALTER TABLE events ADD COLUMN description TEXT`, () => {});
      }
      if (!hasQrEnabled) {
        db.run(`ALTER TABLE events ADD COLUMN qrEnabled INTEGER DEFAULT 0`, () => {});
      }
      if (!hasArchived) {
        db.run(`ALTER TABLE events ADD COLUMN archived INTEGER DEFAULT 0`, () => {});
      }
      if (!hasStartAt) {
        db.run(`ALTER TABLE events ADD COLUMN startAt TEXT`, () => {});
      }
      if (!hasEndAt) {
        db.run(`ALTER TABLE events ADD COLUMN endAt TEXT`, () => {});
      }
      if (!hasRegCap) {
        db.run(`ALTER TABLE events ADD COLUMN regCap INTEGER`, () => {});
      }
      if (!hasRegCapEnforced) {
        db.run(`ALTER TABLE events ADD COLUMN regCapEnforced INTEGER DEFAULT 0`, () => {});
      }
      if (!hasAllowAfterStart) {
        db.run(`ALTER TABLE events ADD COLUMN allowAfterStart INTEGER DEFAULT 0`, () => {});
      }
    });

    // QR logs: track all QR generation attempts
    db.run(`CREATE TABLE IF NOT EXISTS qr_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      regId INTEGER,
      userEmail TEXT,
      status TEXT,
      detail TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );`);

    // Audit logs: track admin actions
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actorEmail TEXT,
      action TEXT,
      targetType TEXT,
      targetId INTEGER,
      meta TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );`);
  });
}

export function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
