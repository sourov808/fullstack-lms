import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LessonFormClient } from "./lesson-form-client";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", resolvedParams.lessonId)
    .single();

  if (error || !lesson) {
    return redirect(`/admin/courses/${resolvedParams.courseId}`);
  }

  return (
    <LessonFormClient
      initialData={lesson}
      courseId={resolvedParams.courseId}
      lessonId={resolvedParams.lessonId}
    />
  );
}
