import { CourseCard } from "@/components/lms/CourseCard";
import { UniversalSearch } from "@/components/layout/UniversalSearch";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();

  // Extract filters
  const selectedCategory = typeof resolvedParams.category === "string" ? resolvedParams.category : null;
  const searchQuery = typeof resolvedParams.q === "string" ? resolvedParams.q : null;

  // Build Query
  let query = supabase
    .from("courses")
    .select(`
      id,
      title,
      price,
      thumbnail_url,
      category,
      is_published
    `)
    .order("created_at", { ascending: false });

  if (selectedCategory && selectedCategory !== "All") {
    query = query.eq("category", selectedCategory);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data: courses, error } = await query;

  if (error) {
    console.error("Error fetching courses", error);
  }

  // Map to CourseCard expected props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedCourses = (courses || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    instructor: Array.isArray(c.instructor) ? c.instructor[0]?.full_name : c.instructor?.full_name || "Instructor",
    rating: 0, // Mocked for now
    reviews: 0, // Mocked for now
    price: c.price,
    thumbnail: c.thumbnail_url || "",
    isPublished: c.is_published,
  }));

  const CATEGORIES = ["All", "Development", "Business", "Design", "Marketing", "IT & Software"];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Explore Courses</h1>
          
          <div className="flex gap-4 mb-6">
            <UniversalSearch 
              variant="large" 
              placeholder="Search for courses..." 
              className="max-w-lg" 
              helperText="Filter by title in real-time"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((tag) => {
              const isActive = selectedCategory === tag || (!selectedCategory && tag === "All");
              
              // Build the href for the category badge
              let href = `/courses`;
              const params = new URLSearchParams();
              if (tag !== "All") params.set("category", tag);
              if (searchQuery) params.set("q", searchQuery);
              
              if (params.toString()) {
                href += `?${params.toString()}`;
              }

              return (
                <Link key={tag} href={href}>
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className={`px-4 py-2 cursor-pointer transition-colors border rounded-full font-medium ${
                      isActive 
                        ? "bg-primary text-white border-primary hover:bg-primary/90" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {tag}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mappedCourses.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No courses found matching your criteria.
            </div>
          )}
          {mappedCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}