import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tables = ["courses", "lessons", "purchases", "user_progress"];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (data && data.length > 0) {
      console.log(`${table} columns:`, Object.keys(data[0]).join(", "));
    } else if (data) {
      console.log(`${table} exists but is empty.`);
    } else {
      console.log(`error/missing table: ${table}`, error?.message);
    }
  }
}

run();
