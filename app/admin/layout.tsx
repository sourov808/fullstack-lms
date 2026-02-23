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
  // For dev purposes, if role is missing, we might redirect, but we'll enforce 'admin'
  if (user.user_metadata?.role !== "admin") {
    redirect("/dashboard"); // Redirect non-admins to student dashboard
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-73px)]">
      {/* Sidebar - Fixed to left side */}
      <aside className="fixed left-0 top-[73px] bottom-0 w-64 hidden md:block">
        <AdminSidebar />
      </aside>

      {/* Main Content Area - with margin to account for fixed sidebar */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
