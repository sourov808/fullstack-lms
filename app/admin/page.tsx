import { getDashboardMetrics, getRecentSales } from "@/app/actions/analytics";
import { AdminDashboardSkeleton } from "@/components/admin/AdminSkeletons";
import { DashboardChart } from "@/components/admin/DashboardChart";
import { RealtimeDashboard } from "@/components/admin/RealtimeDashboard";
import { Suspense } from "react";

async function DashboardContent() {
  const metrics = await getDashboardMetrics();
  const recentSales = await getRecentSales();

  const dataCards = [
    { label: "Total Revenue", value: `$${metrics.totalRevenue.toFixed(2)}` },
    { label: "Active Students", value: metrics.activeStudents },
    { label: "Total Courses", value: metrics.totalCourses },
    { label: "Avg Rating", value: metrics.avgRating },
  ];

  return (
    <div className="space-y-6 relative">
      <RealtimeDashboard />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome to your instructor dashboard. Manage courses, students, and settings here.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dataCards.map((metric) => (
          <div key={metric.label} className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm flex flex-col items-start justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mt-6">
        <div className="md:col-span-4 lg:col-span-5 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Revenue Overview</h2>
          <DashboardChart />
        </div>
        <div className="md:col-span-3 lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Sales</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">You made {recentSales.length} sales recently.</p>
          
          <div className="space-y-4 mt-6">
             {recentSales.map((sale: {
                purchase_id: string;
                price: number;
                created_at: string;
                user_id: string;
                user_email: string;
                user_first_name: string | null;
                user_last_name: string | null;
                course_title: string;
             }) => (
                <div key={sale.purchase_id} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-medium">
                     {sale.user_first_name?.[0] || sale.user_email?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div className="flex-1 w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                       {sale.user_first_name ? `${sale.user_first_name} ${sale.user_last_name || ''}` : sale.user_email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sale.user_email}</p>
                  </div>
                  <div className="font-medium text-sm text-slate-900 dark:text-white">+${sale.price}</div>
                </div>
             ))}
             {recentSales.length === 0 && (
                <p className="text-sm text-slate-500 italic">No recent sales found.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
