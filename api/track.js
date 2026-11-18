import { createClient } from '@supabase/supabase-js';
import { UAParser } from 'ua-parser-js';

// Safe helper to extract JSON body in Vercel serverless environment
async function getJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      // 10KB payload size limit
      if (raw.length > 10240) {
        resolve(null);
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = await getJsonBody(req);
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const { vid, type, path, referrer, screen, lang, tz, utm, target, seconds, scroll } = body;

    // Basic validation
    if (!vid || typeof vid !== 'string' || !type || !['pageview', 'click', 'leave'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid required fields (vid, type)' });
    }

    // Read geolocation headers injected by Vercel edge network
    const country = req.headers['x-vercel-ip-country']
      ? String(req.headers['x-vercel-ip-country']).slice(0, 10)
      : null;

    let city = null;
    if (req.headers['x-vercel-ip-city']) {
      try {
        city = decodeURIComponent(req.headers['x-vercel-ip-city']).slice(0, 100);
      } catch {
        city = String(req.headers['x-vercel-ip-city']).slice(0, 100);
      }
    }

    // Parse user agent into device, os, browser (via ua-parser-js)
    const rawUa = req.headers['user-agent'] || '';
    const parser = new UAParser(rawUa);
    const uaResult = parser.getResult();

    const device = uaResult.device.type || 'desktop';
    const os = [uaResult.os.name, uaResult.os.version].filter(Boolean).join(' ') || 'Unknown OS';
    const browser = [uaResult.browser.name, uaResult.browser.version].filter(Boolean).join(' ') || 'Unknown Browser';

    // Connect to Supabase using the service role key to insert records
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      // DO NOT store raw IP address - only anonymized/extracted analytics attributes
      await supabase.from('visits').insert({
        vid: String(vid).slice(0, 100),
        type,
        path: path ? String(path).slice(0, 500) : null,
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        screen: screen ? String(screen).slice(0, 50) : null,
        lang: lang ? String(lang).slice(0, 20) : null,
        tz: tz ? String(tz).slice(0, 50) : null,
        utm: utm ? String(utm).slice(0, 500) : null,
        target: target ? String(target).slice(0, 200) : null,
        seconds: typeof seconds === 'number' ? Math.max(0, Math.min(Math.round(seconds), 86400)) : null,
        scroll: typeof scroll === 'number' ? Math.max(0, Math.min(Math.round(scroll), 100)) : null,
        country,
        city,
        device: String(device).slice(0, 50),
        os: String(os).slice(0, 100),
        browser: String(browser).slice(0, 100),
        ua: rawUa ? String(rawUa).slice(0, 500) : null,
      });
    }

    return res.status(204).end();
  } catch (err) {
    console.error('Tracking API error:', err);
    return res.status(204).end();
  }
}
