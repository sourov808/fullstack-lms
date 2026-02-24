"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RealtimeDashboard() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    // We subscribe to all changes to the public.purchases and public.reviews tables
    const channel = supabase
      .channel("dashboard-metrics")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "purchases",
        },
        () => {
          // Triggers Server Actions/Components to re-run on current route
          router.refresh(); 
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        () => {
          router.refresh(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  // This component doesn't render anything, it just provides realtime logic
  return null;
}
