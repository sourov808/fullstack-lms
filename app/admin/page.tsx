import { getDashboardMetrics } from "@/app/actions/analytics";
import { AdminDashboardSkeleton } from "@/components/admin/AdminSkeletons";
import { Suspense } from "react";

async function DashboardContent() {
  const metrics = await getDashboardMetrics();

  const dataCards = [
    { label: "Total Revenue", value: `$${metrics.totalRevenue.toFixed(2)}` },
    { label: "Active Students", value: metrics.activeStudents },
    { label: "Total Courses", value: metrics.totalCourses },
    { label: "Avg Rating", value: metrics.avgRating },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome to your instructor dashboard. Manage courses, students, and settings here.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dataCards.map((metric) => (
          <div key={metric.label} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-start justify-between">
            <h3 className="text-sm font-medium text-slate-500">{metric.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {metric.value}
            </p>
          </div>
        ))}
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
