import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      price,
      thumbnail_url,
      category,
      instructor:instructor_id(full_name)
    `)
    .limit(1);

  if (error) {
    console.error("DIAGNOSTICS ERROR:", JSON.stringify(error, null, 2));
    console.error("Code:", error.code);
    console.error("Hint:", error.hint);
    console.error("Message:", error.message);
  } else {
    console.log("Success?", data);
  }
}

run();
