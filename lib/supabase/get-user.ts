import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
             cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
             // The `setAll` method was called from a Server Component.
             // This can be ignored if you have middleware refreshing
             // user sessions.
          }
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch the latest profile data to sync roles and settings since 
    // DB changes won't automatically update the JWT metadata without a re-auth
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      user.user_metadata = { ...user.user_metadata, ...profile };
    }

    return user;
  } catch (error) {
    return null;
  }
}
