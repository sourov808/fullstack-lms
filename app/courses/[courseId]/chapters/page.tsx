import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ChaptersRedirectPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Find first lesson by position
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", resolvedParams.courseId)
    .order("position", { ascending: true })
    .limit(1)
    .single();

  if (!lesson) {
    // No lessons exist
    return redirect(`/courses/${resolvedParams.courseId}`);
  }

  return redirect(`/courses/${resolvedParams.courseId}/chapters/${lesson.id}`);
}
