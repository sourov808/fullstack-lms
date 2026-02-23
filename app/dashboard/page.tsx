import { getUser } from "@/lib/supabase/get-user";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role === "admin") redirect("/admin");

  const supabase = await createClient();

  // Fetch enrolled courses via purchases
  const { data: purchases } = await supabase
    .from("purchases")
    .select(`course:course_id(id, title, price, thumbnail_url, category)`)
    .eq("user_id", user.id);

  const courses = (purchases || []).map((p: any) => {
    const c = Array.isArray(p.course) ? p.course[0] : p.course;
    return { id: c?.id, title: c?.title, thumbnail: c?.thumbnail_url || "", category: c?.category };
  }).filter(Boolean);

  // Fetch lesson counts & progress for each enrolled course
  const progressData: Record<string, { completed: number; total: number; percentage: number }> = {};
  
  for (const course of courses) {
    if (!course.id) continue;
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", course.id);

    const total = lessons?.length || 0;
    const lessonIds = lessons?.map((l) => l.id) || [];
    
    let completed = 0;
    if (lessonIds.length > 0) {
      const { data: progressRows } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .in("lesson_id", lessonIds)
        .eq("user_id", user.id)
        .eq("is_completed", true);
      completed = progressRows?.length || 0;
    }
    
    progressData[course.id] = {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  const totalCompleted = Object.values(progressData).reduce((a, b) => a + b.completed, 0);
  const totalLessons = Object.values(progressData).reduce((a, b) => a + b.total, 0);
  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "Student";

  return (
    <div className="flex-1 bg-slate-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {firstName}! 👋</h1>
          <p className="text-slate-500 mt-1">Ready to continue learning?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "menu_book", label: "Enrolled Courses", value: courses.length, color: "bg-primary/10 text-primary" },
            { icon: "verified", label: "Completed Lessons", value: totalCompleted, color: "bg-blue-500/10 text-blue-500" },
            { icon: "military_tech", label: "Progress", value: `${totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0}%`, color: "bg-amber-500/10 text-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`size-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enrolled Courses with progress */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
            <Link href="/courses" className="text-primary hover:underline text-sm font-medium">Browse More →</Link>
          </div>
          
          {courses.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">school</span>
              <h3 className="text-lg font-bold text-slate-700">No courses yet</h3>
              <p className="text-slate-500 mt-1 mb-4">Start learning by enrolling in your first course.</p>
              <Link href="/courses" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const p = progressData[course.id] || { completed: 0, total: 0, percentage: 0 };
                const fallback = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}/chapters`}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <Image
                        src={course.thumbnail || fallback}
                        alt={course.title || "Course"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {p.percentage === 100 && (
                        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
                          <div className="text-white text-center">
                            <span className="material-symbols-outlined text-4xl">verified</span>
                            <div className="text-sm font-bold mt-1">Completed!</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{p.completed} / {p.total} lessons</span>
                          <span className="font-semibold text-primary">{p.percentage}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{
                              width: `${p.percentage}%`,
                              background: p.percentage === 100
                                ? "linear-gradient(90deg, #16a34a, #22c55e)"
                                : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 capitalize">{course.category || "Course"}</span>
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">play_circle</span>
                          {p.completed > 0 ? "Continue" : "Start"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}