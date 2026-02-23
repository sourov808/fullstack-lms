import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase env variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function probeTable(table) {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error) {
    if (error.code === 'PGRST205' || error.message.includes("does not exist")) {
      console.log(`❌ Table '${table}' does not exist.`);
    } else if (error.code === '42501') {
      console.log(`🔒 Table '${table}' exists but RLS blocked access (which means it's real!).`);
    } else {
      console.log(`⚠️ Table '${table}' returned error:`, error.message);
    }
  } else {
    // try to get column names!
    const singleDataRow = data[0]; 
    const columns = singleDataRow ? Object.keys(singleDataRow).join(', ') : 'no rows';
    console.log(`✅ Table '${table}' exists! Columns: ${columns}`);
  }
}

async function run() {
  console.log("Probing for LMS tables...");
  const tables = [
    "purchases",
    "enrollments",
    "user_courses",
    "orders",
    "payments",
    "transactions",
    "reviews",
    "ratings",
    "course_reviews",
    "user_progress",
    "students"
  ];
  for (const t of tables) {
    await probeTable(t);
  }
}

run();
