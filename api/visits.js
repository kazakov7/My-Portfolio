import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // GET only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Require header x-admin-key equal to ADMIN_KEY env var
  const clientKey = req.headers['x-admin-key'];
  const serverKey = process.env.ADMIN_KEY;

  if (!serverKey || !clientKey || clientKey !== serverKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin key' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error: Supabase credentials missing' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Return latest 1000 rows ordered by created_at desc
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ visits: data || [] });
  } catch (err) {
    console.error('Visits API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
