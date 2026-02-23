require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, instructor:instructor_id(full_name)")
    .limit(1);

  if (error) {
    console.error("DIAGNOSTICS ER:", error);
  } else {
    console.log("Success?", data);
  }
}
run();
