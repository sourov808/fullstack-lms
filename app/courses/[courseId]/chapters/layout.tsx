import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch Course
  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", resolvedParams.courseId)
    .single();

  if (error || !course) {
    return redirect("/");
  }

  // Fetch Lessons ordered by position
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, is_free, position")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex-1 flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-80 border-r border-slate-200 dark:border-blue-900/50 bg-white dark:bg-slate-950 h-[calc(100vh-130px)] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 dark:border-blue-900/50 flex flex-col gap-y-2">
            <Link href={`/courses/${course.id}`} className="font-semibold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-x-2 transition mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to course
            </Link>
            <h1 className="font-bold text-lg text-slate-900 dark:text-slate-100">{course.title}</h1>
          </div>
          
          <div className="flex flex-col w-full">
            {lessons?.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/courses/${course.id}/chapters/${lesson.id}`}
                className="flex items-center gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium pl-6 py-4 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition border-b border-slate-100 dark:border-blue-900/20"
              >
                <div className="flex items-center gap-x-2 w-full">
                  <CheckCircle className="text-slate-300 dark:text-slate-600 h-5 w-5" />
                  <span className="truncate">{lesson.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 overflow-y-auto h-[calc(100vh-130px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
