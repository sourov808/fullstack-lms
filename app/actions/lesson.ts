"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLesson(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Determine the next position based on existing lessons
  const { data: lastLesson } = await supabase
    .from("lessons")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = lastLesson ? lastLesson.position + 1 : 0;

  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      title: "New Lesson",
      content: "",
      video_url: null,
      position: newPosition,
      is_free: false,
    })
    .select()
    .single();

  if (error || !lesson) {
    console.error("Failed to create lesson:", error);
    throw new Error("Failed to create lesson");
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return lesson;
}

export async function updateLesson(
  lessonId: string,
  values: {
    title: string;
    content?: string;
    video_url?: string;
    is_free: boolean;
    position?: number;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: lesson, error } = await supabase
    .from("lessons")
    .update({
      title: values.title,
      content: values.content || null,
      ...(values.video_url !== undefined ? { video_url: values.video_url } : {}),
      is_free: values.is_free,
      ...(values.position !== undefined ? { position: values.position } : {}),
    })
    .eq("id", lessonId)
    .select()
    .single();

  if (error || !lesson) {
    console.error("Failed to update lesson:", error);
    throw new Error("Failed to update lesson");
  }

  revalidatePath(`/admin/courses/${lesson.course_id}`);
  return lesson;
}

export async function reorderLessons(
  courseId: string,
  updates: { id: string; position: number }[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Iterative bulk update
  for (const update of updates) {
    await supabase
      .from("lessons")
      .update({ position: update.position })
      .eq("id", update.id);
  }

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);

  if (error) {
    console.error("Failed to delete lesson:", error);
    throw new Error("Failed to delete lesson");
  }

  // Optionally rebalance positions, though not strictly required if purely using positions for ordering
  revalidatePath(`/admin/courses/${courseId}`);
}
