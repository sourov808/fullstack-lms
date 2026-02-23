"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  course_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function createReview(values: z.infer<typeof reviewSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validatedFields = reviewSchema.parse(values);

  // Check if user already reviewed this course
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", validatedFields.course_id)
    .single();

  if (existingReview) {
    throw new Error("You have already reviewed this course");
  }

  // Check if user has purchased the course (unless it's free)
  const { data: course } = await supabase
    .from("courses")
    .select("price, instructor_id")
    .eq("id", validatedFields.course_id)
    .single();

  if (!course) {
    throw new Error("Course not found");
  }

  // Allow review if course is free, user is instructor, or user has purchased
  const isFree = course.price === 0 || !course.price;
  const isInstructor = user.id === course.instructor_id;
  
  if (!isFree && !isInstructor) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", validatedFields.course_id)
      .single();

    if (!purchase) {
      throw new Error("You must enroll in the course to review it");
    }
  }

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      course_id: validatedFields.course_id,
      rating: validatedFields.rating,
      comment: validatedFields.comment || null,
    })
    .select("id, rating, comment, created_at, user_id")
    .single();

  if (error || !review) {
    console.error("Failed to create review:", error);
    throw new Error("Failed to create review");
  }

  // Fetch user profile separately
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", user.id)
    .single();

  const reviewWithProfile = {
    ...review,
    profiles: profile,
  };

  revalidatePath(`/courses/${validatedFields.course_id}`);
  return { success: true, review: reviewWithProfile };
}

export async function updateReview(reviewId: string, rating: number, comment?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("user_id, course_id")
    .eq("id", reviewId)
    .single();

  if (!existingReview || existingReview.user_id !== user.id) {
    throw new Error("You can only update your own reviews");
  }

  const { error } = await supabase
    .from("reviews")
    .update({
      rating,
      comment: comment || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    console.error("Failed to update review:", error);
    throw new Error("Failed to update review");
  }

  revalidatePath(`/courses/${existingReview.course_id}`);
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("course_id")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .single();

  if (!existingReview) {
    throw new Error("Review not found or you don't have permission to delete it");
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.error("Failed to delete review:", error);
    throw new Error("Failed to delete review");
  }

  revalidatePath(`/courses/${existingReview.course_id}`);
  return { success: true };
}

export async function getCourseReviews(courseId: string) {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, user_id")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }

  if (!reviews || reviews.length === 0) return [];

  // Fetch user profiles separately
  const userIds = reviews.map((r) => r.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
    .in("id", userIds);

  // Merge reviews with profiles
  return reviews.map((review) => ({
    ...review,
    profiles: profiles?.find((p) => p.id === review.user_id) || null,
  }));
}

export async function getCourseRating(courseId: string) {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("course_id", courseId);

  if (error || !reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
  const average = (total / reviews.length).toFixed(1);

  return { average: parseFloat(average), count: reviews.length };
}

export async function getUserReview(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!review) return null;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    ...review,
    profiles: profile || null,
  };
}
