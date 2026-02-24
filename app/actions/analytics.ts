"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
  const supabase = await createClient();

  // Authorize User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch Total Courses (owned by instructor)
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id")
    .eq("instructor_id", user.id);

  if (coursesError || !courses) {
    return { totalRevenue: 0, activeStudents: 0, totalCourses: 0, avgRating: "0.0" };
  }

  const courseIds = courses.map((c) => c.id);
  const totalCourses = courseIds.length;

  if (totalCourses === 0) {
    return { totalRevenue: 0, activeStudents: 0, totalCourses: 0, avgRating: "0.0" };
  }

  // 2. Fetch Purchases for these courses
  const { data: purchases, error: purchasesError } = await supabase
    .from("purchases")
    .select("id, price, user_id")
    .in("course_id", courseIds);

  let totalRevenue = 0;
  let activeStudents = 0;

  if (!purchasesError && purchases) {
    totalRevenue = purchases.reduce((acc, purchase) => acc + Number(purchase.price), 0);
    const uniqueStudents = new Set(purchases.map(p => p.user_id));
    activeStudents = uniqueStudents.size;
  }

  // 3. Fetch Reviews for these courses
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .in("course_id", courseIds);

  let avgRating = "0.0";
  if (!reviewsError && reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
    avgRating = (totalRating / reviews.length).toFixed(1);
  }

  return {
    totalRevenue,
    activeStudents,
    totalCourses,
    avgRating,
  };
}

export async function getRecentSales() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Call the custom RPC function that securely joins with auth.users
  const { data, error } = await supabase.rpc("get_instructor_recent_sales", {
    org_instructor_id: user.id,
  });

  if (error) {
    console.error("Failed to fetch recent sales:", JSON.stringify(error, null, 2));
    return [];
  }

  return data || [];
}
