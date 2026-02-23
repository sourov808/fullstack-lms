import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "@/components/lms/VideoPlayer";
import { MarkCompleteButton } from "@/components/lms/MarkCompleteButton";

export default async function LessonIdPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Fetch lesson
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", resolvedParams.lessonId)
    .single();

  if (lessonError || !lesson) return redirect(`/courses/${resolvedParams.courseId}`);

  // Fetch course for instructor check
  const { data: course } = await supabase
    .from("courses")
    .select("instructor_id")
    .eq("id", resolvedParams.courseId)
    .single();

  if (!course) return redirect("/");

  // Authorization check
  let isAuthorized = lesson.is_free || user.id === course.instructor_id;

  if (!isAuthorized) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", resolvedParams.courseId)
      .single();
    if (purchase) isAuthorized = true;
  }

  if (!isAuthorized) return redirect(`/courses/${resolvedParams.courseId}`);

  // Fetch all lessons for navigation
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, title, position")
    .eq("course_id", resolvedParams.courseId)
    .order("position", { ascending: true });

  const currentIndex = allLessons?.findIndex((l) => l.id === resolvedParams.lessonId) ?? -1;
  const nextLesson = allLessons && currentIndex >= 0 ? allLessons[currentIndex + 1] : null;

  // Fetch current progress for this lesson
  const { data: progressRow } = await supabase
    .from("user_progress")
    .select("is_completed")
    .eq("user_id", user.id)
    .eq("lesson_id", resolvedParams.lessonId)
    .single();

  const isCompleted = progressRow?.is_completed || false;

  return (
    <div className="flex flex-col max-w-4xl mx-auto pb-20 p-6 space-y-4">
      {/* Video Player */}
      {lesson.video_url ? (
        <VideoPlayer url={lesson.video_url} />
      ) : (
        <div className="aspect-video w-full flex items-center justify-center bg-slate-800 text-slate-200 rounded-xl shadow-sm">
          <p className="text-lg font-medium">No video for this lesson.</p>
        </div>
      )}

      {/* Lesson Header with Mark Complete */}
      <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Lesson {(currentIndex ?? 0) + 1} of {allLessons?.length ?? 1}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{lesson.title}</h2>
        </div>
        <MarkCompleteButton
          lessonId={lesson.id}
          courseId={resolvedParams.courseId}
          nextLessonId={nextLesson?.id || null}
          initialCompleted={isCompleted}
        />
      </div>

      {/* Lesson Content */}
      {lesson.content && (
        <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-slate-700 prose max-w-none">
          {lesson.content}
        </div>
      )}

      {/* Next Lesson Navigation */}
      {nextLesson && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Up Next</div>
            <div className="font-semibold text-slate-700 text-sm mt-0.5">{nextLesson.title}</div>
          </div>
          <a
            href={`/courses/${resolvedParams.courseId}/chapters/${nextLesson.id}`}
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Next
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
      )}
    </div>
  );
}
