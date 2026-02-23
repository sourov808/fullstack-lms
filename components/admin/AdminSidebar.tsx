import Link from "next/link";
import { getUser } from "@/lib/supabase/get-user";

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: "space_dashboard" },
  { name: "All Courses", href: "/admin/courses", icon: "video_library" },
  { name: "Create Course", href: "/admin/courses/new", icon: "add_circle" },
  { name: "Settings", href: "/admin/settings", icon: "settings" },
  { name: "Guide", href: "/admin/guide", icon: "menu_book" },
];

export default async function AdminSidebar() {
  const user = await getUser();

  return (
    <div className="flex flex-col w-64 border-r border-slate-200 bg-white h-full px-4 py-6">
      <div className="mb-8 px-2 flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
        <h2 className="text-xl font-bold tracking-tight">Admin Portal</h2>
      </div>
      
      <nav className="flex-1 space-y-1">
        {adminNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-primary hover:bg-primary/5 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-slate-100 px-2 flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
            {user?.user_metadata?.first_name?.[0] || "A"}
         </div>
         <div className="flex-1 min-w-0">
           <p className="text-sm font-bold text-slate-900 truncate">
             {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
           </p>
           <p className="text-xs text-slate-500 truncate capitalize">
             {user?.user_metadata?.role || "Admin"}
           </p>
         </div>
      </div>
    </div>
  );
}
