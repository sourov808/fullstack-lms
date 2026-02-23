import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { EnrollButton } from "@/components/lms/EnrollButton";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch the course
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", resolvedParams.courseId)
    .single();

  if (error || !course) {
    return redirect("/");
  }

  // Count lessons
  const { count: lessonsCount } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", course.id);

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasPurchased = false;

  if (user) {
    // If user is instructor, they implicitly own it
    if (user.id === course.instructor_id) {
      hasPurchased = true;
    } else {
      // Check purchase
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .single();
      
      if (purchase) {
        hasPurchased = true;
      }
    }
  }

  // Check if unpiblished
  if (!course.is_published && user?.id !== course.instructor_id) {
    return redirect("/");
  }


  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
       {!course.is_published && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800">
          <span className="material-symbols-outlined text-amber-600">info</span>
          <p className="text-sm font-medium">
            This course is currently in <strong>Draft</strong> mode. Only you as the instructor can see this page.
          </p>
        </div>
      )}
      {/* Course Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {course.title}
          </h1>
          <p className="text-lg text-slate-500 line-clamp-3">
            {course.description || "No description provided."}
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>{lessonsCount || 0} Lessons</span>
          </div>
          <div className="pt-4 flex items-center gap-x-4">
            <EnrollButton
              courseId={course.id}
              price={course.price || 0}
              hasPurchased={hasPurchased}
            />
          </div>
        </div>
        
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-slate-400">
              No Thumbnail
            </div>
          )}
        </div>
      </div>

      {/* Course Details / Content (Could be expanded later) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4">About This Course</h2>
        <div className="prose prose-slate max-w-none text-slate-600">
          {course.description || "No detailed description available."}
        </div>
      </div>
    </div>
  );
}
