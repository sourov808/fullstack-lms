"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully logged out");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className="w-full text-left flex items-center px-2 py-2 text-red-600 hover:bg-slate-50 hover:text-red-700 transition-colors cursor-pointer text-sm font-medium rounded-md"
    >
      <span className="material-symbols-outlined mr-2 text-[18px]">logout</span>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
