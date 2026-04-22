import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('events').select('*').limit(1);
  if (error) {
    console.error("ERROR:", error);
  } else {
    if (data && data.length > 0) {
      console.log("COLUMNS IN EVENTS:", Object.keys(data[0]));
    } else {
      console.log("No events found. Can't determine columns from a row.");
    }
  }
}

check();
