import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import Image from "next/image";
import { BookOpen, Star } from "lucide-react";
import { EnrollButton } from "@/components/lms/EnrollButton";
import { ReviewsSection } from "@/components/lms/ReviewsSection";
import { getCourseRating } from "@/app/actions/reviews";

const getCachedCourse = cache(async (courseId: string) => {
  const supabase = await createClient();
  return supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();
});

const getCachedLessonsCount = cache(async (courseId: string) => {
  const supabase = await createClient();
  return supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);
});

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch the course (cached)
  const { data: course, error } = await getCachedCourse(resolvedParams.courseId);

  if (error || !course) {
    return redirect("/");
  }

  // Count lessons (cached)
  const { count: lessonsCount } = await getCachedLessonsCount(course.id);

  // Get course rating
  const rating = await getCourseRating(course.id);

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

  // Check if unpublished
  if (!course.is_published && user?.id !== course.instructor_id) {
    return redirect("/");
  }


  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {!course.is_published && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-300">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">info</span>
          <p className="text-sm font-medium">
            This course is currently in <strong>Draft</strong> mode. Only you as the instructor can see this page.
          </p>
        </div>
      )}

      {/* Course Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {course.title}
          </h1>
          
          {/* Rating Display */}
          {rating.count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">{rating.average.toFixed(1)}</span>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">({rating.count} {rating.count === 1 ? "review" : "reviews"})</span>
            </div>
          )}
          
          <p className="text-lg text-slate-500 dark:text-slate-400 line-clamp-3">
            {course.description || "No description provided."}
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
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

        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-slate-400 dark:text-slate-500">
              No Thumbnail
            </div>
          )}
        </div>
      </div>

      {/* Course Details / Content */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About This Course</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          {course.description || "No detailed description available."}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <ReviewsSection
          courseId={course.id}
          hasPurchased={hasPurchased}
          userId={user?.id}
        />
      </div>
    </div>
  );
}
