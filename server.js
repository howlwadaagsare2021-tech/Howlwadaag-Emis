const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const { Pool } = require('pg');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const NAME_HINTS = ['magac', 'name', 'magaca', 'student name', 'full name'];
const EMIS_HINTS = ['emis', 'lambarka emis', 'emis number', 'emis no', 'emis id'];

function normalizeHeader(h) {
  return String(h || '').toLowerCase().trim();
}

function guessColumn(headers, hints, exclude) {
  for (const h of headers) {
    if (h === exclude) continue;
    if (hints.includes(normalizeHeader(h))) return h;
  }
  for (const h of headers) {
    if (h === exclude) continue;
    if (hints.some(hint => normalizeHeader(h).includes(hint))) return h;
  }
  return null;
}

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      emis TEXT,
      extra JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}
ensureTable().catch(err => console.error('Table init error:', err));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Lightweight list for client-side autocomplete (id, name, emis only)
app.get('/api/students/index', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, emis FROM students ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Full record for one student
app.get('/api/students/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload xlsx/csv - replaces the whole roster
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rowsData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    if (!rowsData.length) return res.status(400).json({ error: 'Faylku waa madhan yahay' });

    const headers = Object.keys(rowsData[0]);
    let nameKey = guessColumn(headers, NAME_HINTS, null);
    let emisKey = guessColumn(headers, EMIS_HINTS, nameKey);
    if (!nameKey) nameKey = headers[0];
    if (!emisKey) emisKey = headers.find(h => h !== nameKey) || headers[0];

    const records = rowsData.map(r => {
      const extra = {};
      headers.forEach(h => {
        if (h !== nameKey && h !== emisKey) extra[h] = r[h];
      });
      return {
        name: String(r[nameKey] || '').trim(),
        emis: String(r[emisKey] || '').trim(),
        extra
      };
    }).filter(r => r.name);

    if (!records.length) {
      return res.status(400).json({ error: 'Lama helin saf xog ah oo leh magac' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('TRUNCATE TABLE students RESTART IDENTITY');
      for (const r of records) {
        await client.query(
          'INSERT INTO students (name, emis, extra) VALUES ($1, $2, $3)',
          [r.name, r.emis, JSON.stringify(r.extra)]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    res.json({ ok: true, count: records.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Faylka lama akhrin karin' });
  }
});

// Clear the roster
app.delete('/api/students', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE students RESTART IDENTITY');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('EMIS backend running on port ' + PORT));
