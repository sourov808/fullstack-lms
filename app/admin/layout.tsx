import { getUser } from "@/lib/supabase/get-user";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Protect Admin Routes
  if (!user) {
    redirect("/login");
  }

  // Ensure only admins can access
  if (user.user_metadata?.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-73px)]">
      {/* Sidebar - Fixed to left side */}
      <aside className="fixed left-0 top-[73px] bottom-0 w-64 hidden md:block bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-blue-900/50 overflow-y-auto">
        <AdminSidebar />
      </aside>

      {/* Main Content Area - with margin to account for fixed sidebar */}
      <main className="flex-1 md:ml-64 min-h-[calc(100vh-73px)] p-6">
        {children}
      </main>
    </div>
  );
}
