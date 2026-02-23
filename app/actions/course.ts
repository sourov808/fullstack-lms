"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createCourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  category: z.string().optional().default("Development"),
  price: z.coerce.number().min(0).default(0),
  thumbnail: z.any().optional(),
  is_published: z.boolean().default(false),
});

export async function createCourse(values: z.infer<typeof createCourseSchema>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedFields = createCourseSchema.parse(values);

  const { data: course, error } = await supabase
    .from("courses")
    .insert({
      instructor_id: user.id,
      title: validatedFields.title,
      description: validatedFields.description || null,
      category: validatedFields.category,
      thumbnail_url: typeof validatedFields.thumbnail === "string" ? validatedFields.thumbnail : null,
      price: validatedFields.price,
      is_published: validatedFields.is_published,
    })
    .select()
    .single();

  if (error || !course) {
    console.error("Failed to create course", error);
    throw new Error("Failed to create course");
  }

  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${course.id}`);
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("courses")
    .update({ is_published: isPublished })
    .eq("id", courseId)
    .eq("instructor_id", user.id);

  if (error) {
    console.error("Failed to update course publish state:", error);
    throw new Error("Failed to update course");
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin");
  revalidatePath("/courses");
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("instructor_id", user.id);

  if (error) {
    console.error("Failed to delete course:", error);
    throw new Error("Failed to delete course");
  }

  revalidatePath("/admin");
  revalidatePath("/courses");
  return { success: true };
}

export async function updateCoursePrice(courseId: string, price: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("courses")
    .update({ price })
    .eq("id", courseId)
    .eq("instructor_id", user.id);

  if (error) {
    console.error("Failed to update course price:", error);
    throw new Error("Failed to update course price");
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin");
  revalidatePath("/courses");
  return { success: true };
}

export async function getCourseSuggestions(query: string) {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, title")
    .ilike("title", `%${query}%`)
    .eq("is_published", true)
    .limit(5);

  if (error) {
    console.error("Error fetching course suggestions:", error);
    return [];
  }

  return data || [];
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existing) return { success: true, alreadyEnrolled: true };

  const { error } = await supabase
    .from("purchases")
    .insert({ user_id: user.id, course_id: courseId });

  if (error) throw new Error("Failed to enroll");

  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/dashboard");
  return { success: true, alreadyEnrolled: false };
}

export async function updateLessonProgress(lessonId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, lesson_id: lessonId, is_completed: isCompleted, updated_at: new Date().toISOString() },
      { onConflict: "user_id,lesson_id" }
    );

  if (error) throw new Error("Failed to update progress");

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getCourseProgress(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { completed: 0, total: 0, percentage: 0 };

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId);

  if (!lessons || lessons.length === 0) return { completed: 0, total: 0, percentage: 0 };

  const lessonIds = lessons.map((l) => l.id);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .in("lesson_id", lessonIds)
    .eq("user_id", user.id)
    .eq("is_completed", true);

  const completed = progress?.length || 0;
  const total = lessons.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}
