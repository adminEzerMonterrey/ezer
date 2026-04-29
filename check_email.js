import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('hero_stats').select('value').eq('key', 'admin_email').single();
  console.log("admin_email in DB:", data?.value);
  console.log("error:", error);
}

check();
