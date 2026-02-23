import { CourseCard } from "@/components/lms/CourseCard";
import { CategoryCard } from "@/components/lms/CategoryCard";
import { UniversalSearch } from "@/components/layout/UniversalSearch";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: topCourses } = await supabase
    .from("courses")
    .select("id, title, price, thumbnail_url, category, is_published")
    .limit(4)
    .order("created_at", { ascending: false });

  const CATEGORIES = [
    { title: "Development", icon: "code", href: "/courses?category=Development" },
    { title: "Business", icon: "monitoring", href: "/courses?category=Business" },
    { title: "Design", icon: "palette", href: "/courses?category=Design" },
    { title: "Marketing", icon: "campaign", href: "/courses?category=Marketing" },
    { title: "IT & Software", icon: "terminal", href: "/courses?category=IT+%26+Software" },
    { title: "Lifestyle", icon: "psychology", href: "/courses?category=Lifestyle" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const COURSES = (topCourses || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    instructor: "EduStream Instructor",
    rating: 0,
    reviews: 0,
    price: c.price,
    thumbnail: c.thumbnail_url || "",
    isPublished: c.is_published,
  }));

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-16 md:py-24 px-6 overflow-hidden">
        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 text-blue-500/5 rounded-l-full -mr-20 transform -skew-x-12"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded">Learning Reimagined</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
              Unlock Your Potential with <span className="text-primary">Expert-Led</span> Courses
            </h2>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Join over 50 million learners and master new skills from the world&apos;s best instructors in business, design, and tech.
            </p>
            
            {/* Hero Search */}
            <div className="max-w-md">
              <UniversalSearch 
                variant="large" 
                placeholder="What do you want to learn?" 
                helperText="Search 50,000+ courses across all categories"
              />
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span>Popular:</span>
              <a className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 transition-all" href="#">Python</a>
              <a className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 transition-all" href="#">React</a>
              <a className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 transition-all" href="#">UX Design</a>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white h-[400px]">
              <Image
                alt="Students studying together"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL_Ul1OxqBLRh6yHK_cIMaWbJPV_S61INV7Cp82xVaVX-fGom3ex34p8ukT7jaGqa41EKdaWYtnkw_VGYm9fyo3U7g5Sudn__E15XtV0-E3SITXJQ-7nmViDgQtJ9-lagjm0Y4wWNRH2igbbafUQr0E_YwuVyTV3b1tblbpKMVsdNaVomEoYcg5dqBViFDs2mqjxtJJatWdFHo4RnD-2ZeHQ8T9yPEvEqgDRvGpL0liB8iCtUyaPahTdy61kMHQGtSe0NHL58759gM"
                width={500}
                height={500}
              />
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Explore Top Categories</h3>
            <p className="text-slate-500 mt-1">Get started by browsing our most popular topics.</p>
          </div>
          <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* Top Rated Courses Section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold text-slate-900">Top Rated Courses</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-white hover:bg-slate-50">
                <span className="material-symbols-outlined text-slate-600">chevron_left</span>
              </Button>
              <Button variant="outline" size="icon" className="bg-white hover:bg-slate-50">
                <span className="material-symbols-outlined text-slate-600">chevron_right</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {COURSES.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-3xl md:text-4xl font-black mb-6">Become an Instructor</h3>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Top instructors from around the world teach millions of students on EduStream. We provide the tools and platform to teach what you love.
            </p>
            <Button className="px-8 py-6 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg text-lg h-auto">
              Start Teaching Today
            </Button>
          </div>
          <div className="relative z-10">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-[100px] text-white/40">record_voice_over</span>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full translate-x-20 translate-y-20 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}