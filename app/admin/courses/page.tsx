import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  // Authorize User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch Courses
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your published and draft courses.
          </p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90" asChild>
          <Link href="/admin/courses/new">
            <span className="material-symbols-outlined mr-2 text-[20px]">
              add
            </span>
            New Course
          </Link>
        </Button>
      </div>

      {(!courses || courses.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-blue-900/50">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-slate-400">
              video_library
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm text-center">
            Get started by creating your first course. Upload videos, add materials,
            and publish to students.
          </p>
          <Button className="mt-6 border-slate-200 dark:border-blue-900/50" variant="outline" asChild>
            <Link href="/admin/courses/new">Create Course</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-blue-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-900/20">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {course.title}
                  </td>
                  <td className="px-6 py-4">
                    {course.price === 0 || !course.price
                      ? "Free"
                      : `$${course.price.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4">
                    {course.is_published ? (
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-default shadow-none border-green-200 dark:border-green-800/50 font-medium tracking-wide">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-none font-medium tracking-wide cursor-default border-slate-200 dark:border-blue-900/50">
                        Draft
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
                      asChild
                    >
                      <Link href={`/admin/courses/${course.id}`}>
                        <span className="material-symbols-outlined text-lg mr-1.5">
                          edit_square
                        </span>
                        Edit
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
