import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CourseSetupClient from "./course-setup-client";

export default async function CourseCurriculumPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Authorize User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", resolvedParams.courseId)
    .single();

  if (error || !course) {
    console.error("Error fetching course", error);
    return redirect("/admin/courses");
  }

  // Fetch Lessons
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", resolvedParams.courseId)
    .order("position", { ascending: true });

  return <CourseSetupClient course={course} lessons={lessons || []} />;
}
