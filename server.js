import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { UAParser } from 'ua-parser-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = (process.env.ADMIN_KEY || 'Seoul77##').trim();
const DATA_DIR = path.join(__dirname, 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read visits
function getVisits() {
  try {
    if (fs.existsSync(VISITS_FILE)) {
      const content = fs.readFileSync(VISITS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading visits:', e);
  }
  return [];
}

// Helper to save visits
function saveVisits(visits) {
  try {
    fs.writeFileSync(VISITS_FILE, JSON.stringify(visits.slice(0, 5000), null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving visits:', e);
  }
}

// Seed initial realistic analytics if visits file is empty
if (!fs.existsSync(VISITS_FILE) || getVisits().length === 0) {
  const now = Date.now();
  const seedData = [
    {
      id: 'v-101',
      created_at: new Date(now - 1000 * 60 * 15).toISOString(),
      vid: 'kr_seoul_recruiter_01',
      type: 'pageview',
      path: '/',
      referrer: 'https://linkedin.com/',
      screen: '1920x1080',
      lang: 'ko-KR',
      tz: 'Asia/Seoul',
      country: 'KR',
      city: 'Seoul',
      device: 'desktop',
      os: 'macOS 15.1',
      browser: 'Chrome 131',
      seconds: 145,
      scroll: 85
    },
    {
      id: 'v-102',
      created_at: new Date(now - 1000 * 60 * 12).toISOString(),
      vid: 'kr_seoul_recruiter_01',
      type: 'click',
      path: '/',
      target: 'project_aurora',
      referrer: 'https://linkedin.com/',
      country: 'KR',
      city: 'Seoul',
      device: 'desktop',
      os: 'macOS 15.1',
      browser: 'Chrome 131',
      seconds: 90,
      scroll: 92
    },
    {
      id: 'v-103',
      created_at: new Date(now - 1000 * 60 * 10).toISOString(),
      vid: 'kr_seoul_recruiter_01',
      type: 'click',
      path: '/',
      target: 'download_resume_pdf',
      country: 'KR',
      city: 'Seoul',
      device: 'desktop',
      os: 'macOS 15.1',
      browser: 'Chrome 131',
      seconds: 120,
      scroll: 95
    },
    {
      id: 'v-104',
      created_at: new Date(now - 1000 * 60 * 45).toISOString(),
      vid: 'uz_tashkent_engineer_02',
      type: 'pageview',
      path: '/',
      referrer: 'https://t.me/',
      screen: '390x844',
      lang: 'uz-UZ',
      tz: 'Asia/Tashkent',
      country: 'UZ',
      city: 'Tashkent',
      device: 'mobile',
      os: 'iOS 18.0',
      browser: 'Mobile Safari',
      seconds: 210,
      scroll: 100
    },
    {
      id: 'v-105',
      created_at: new Date(now - 1000 * 60 * 42).toISOString(),
      vid: 'uz_tashkent_engineer_02',
      type: 'click',
      path: '/',
      target: 'project_emilia',
      country: 'UZ',
      city: 'Tashkent',
      device: 'mobile',
      os: 'iOS 18.0',
      browser: 'Mobile Safari',
      seconds: 180,
      scroll: 100
    },
    {
      id: 'v-106',
      created_at: new Date(now - 1000 * 60 * 120).toISOString(),
      vid: 'us_sf_techlead_03',
      type: 'pageview',
      path: '/',
      referrer: 'https://github.com/kazakov7',
      screen: '2560x1440',
      lang: 'en-US',
      tz: 'America/Los_Angeles',
      country: 'US',
      city: 'San Francisco',
      device: 'desktop',
      os: 'macOS 14.6',
      browser: 'Chrome 130',
      seconds: 320,
      scroll: 90
    },
    {
      id: 'v-107',
      created_at: new Date(now - 1000 * 60 * 115).toISOString(),
      vid: 'us_sf_techlead_03',
      type: 'click',
      path: '/',
      target: 'project_floralens',
      country: 'US',
      city: 'San Francisco',
      device: 'desktop',
      os: 'macOS 14.6',
      browser: 'Chrome 130',
      seconds: 250,
      scroll: 95
    },
    {
      id: 'v-108',
      created_at: new Date(now - 1000 * 60 * 110).toISOString(),
      vid: 'us_sf_techlead_03',
      type: 'click',
      path: '/',
      target: 'project_topik_rag',
      country: 'US',
      city: 'San Francisco',
      device: 'desktop',
      os: 'macOS 14.6',
      browser: 'Chrome 130',
      seconds: 290,
      scroll: 98
    },
    {
      id: 'v-109',
      created_at: new Date(now - 1000 * 60 * 240).toISOString(),
      vid: 'kr_gangnam_dev_04',
      type: 'pageview',
      path: '/',
      referrer: 'direct',
      screen: '1440x900',
      lang: 'ko-KR',
      tz: 'Asia/Seoul',
      country: 'KR',
      city: 'Seoul',
      device: 'desktop',
      os: 'Windows 11',
      browser: 'Edge 131',
      seconds: 185,
      scroll: 80
    },
    {
      id: 'v-110',
      created_at: new Date(now - 1000 * 60 * 360).toISOString(),
      vid: 'de_berlin_recruiter_05',
      type: 'pageview',
      path: '/',
      referrer: 'https://linkedin.com/',
      screen: '1536x864',
      lang: 'de-DE',
      tz: 'Europe/Berlin',
      country: 'DE',
      city: 'Berlin',
      device: 'desktop',
      os: 'Windows 11',
      browser: 'Firefox 132',
      seconds: 95,
      scroll: 60
    }
  ];
  saveVisits(seedData);
}

app.use(express.json());

// Track API (POST /api/track)
app.post('/api/track', (req, res) => {
  try {
    const body = req.body || {};
    const { vid, type, path, referrer, screen, lang, tz, utm, target, seconds, scroll } = body;

    if (!vid || !type) {
      return res.status(400).json({ error: 'Missing vid or type' });
    }

    const rawUa = req.headers['user-agent'] || '';
    const parser = new UAParser(rawUa);
    const uaResult = parser.getResult();

    const device = uaResult.device.type || 'desktop';
    const os = [uaResult.os.name, uaResult.os.version].filter(Boolean).join(' ') || 'Unknown OS';
    const browser = [uaResult.browser.name, uaResult.browser.version].filter(Boolean).join(' ') || 'Unknown Browser';

    let country = req.headers['cf-ipcountry'] || req.headers['x-country'] || null;
    let city = null;

    if (!country) {
      const clientTz = tz || '';
      if (clientTz.includes('Seoul')) { country = 'KR'; city = 'Seoul'; }
      else if (clientTz.includes('Tashkent') || clientTz.includes('Samarkand')) { country = 'UZ'; city = 'Tashkent'; }
      else if (clientTz.includes('Tokyo')) { country = 'JP'; city = 'Tokyo'; }
      else if (clientTz.includes('America/')) { country = 'US'; city = 'New York'; }
      else if (clientTz.includes('London')) { country = 'GB'; city = 'London'; }
      else if (clientTz.includes('Berlin')) { country = 'DE'; city = 'Berlin'; }
    }

    const newEvent = {
      id: 'v_' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      vid: String(vid).slice(0, 100),
      type,
      path: path ? String(path).slice(0, 500) : '/',
      referrer: referrer ? String(referrer).slice(0, 500) : null,
      screen: screen ? String(screen).slice(0, 50) : null,
      lang: lang ? String(lang).slice(0, 20) : null,
      tz: tz ? String(tz).slice(0, 50) : null,
      utm: utm ? String(utm).slice(0, 500) : null,
      target: target ? String(target).slice(0, 200) : null,
      seconds: typeof seconds === 'number' ? Math.max(0, Math.min(Math.round(seconds), 86400)) : 0,
      scroll: typeof scroll === 'number' ? Math.max(0, Math.min(Math.round(scroll), 100)) : 0,
      country,
      city,
      device: String(device).slice(0, 50),
      os: String(os).slice(0, 100),
      browser: String(browser).slice(0, 100),
      ua: String(rawUa).slice(0, 300)
    };

    const currentVisits = getVisits();
    currentVisits.unshift(newEvent);
    saveVisits(currentVisits);

    return res.status(204).end();
  } catch (err) {
    console.error('Tracking error:', err);
    return res.status(204).end();
  }
});

// Visits API for Admin Dashboard (GET /api/visits)
app.get('/api/visits', (req, res) => {
  const clientKey = req.headers['x-admin-key'];

  if (!clientKey || clientKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Invalid Admin Key. Access denied.' });
  }

  const visits = getVisits();
  return res.json({ visits });
});

// Serve frontend static assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback for all routes (including /admin)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Kevin Portfolio Server listening on port ${PORT}`);
  console.log(`Admin Key configured.`);
});
