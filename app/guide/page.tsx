import { BookOpen, ShoppingCart, PlayCircle, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuidePage() {
  const sections = [
    {
      title: "Quick Start",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      description: "Learn how to find the perfect course and start your learning journey.",
      steps: [
        "Head over to the 'All Courses' page to browse our catalog.",
        "Use the category filters and search bar to narrow down your interests.",
        "Click on a course to view its details, syllabus, and instructor information."
      ]
    },
    {
      title: "Enrollment & Shopping",
      icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
      description: "How to purchase courses or get them for free.",
      steps: [
        "Add courses you're interested in to your cart.",
        "For paid courses, complete the secure checkout process.",
        "For free courses, simply click 'Get for Free' on the course details page.",
        "Once enrolled, courses will appear instantly in your dashboard."
      ]
    },
    {
      title: "The Learning Experience",
      icon: <PlayCircle className="w-6 h-6 text-purple-500" />,
      description: "Mastering the course player and tracking your progress.",
      steps: [
        "Access your courses from 'My Learning' in the profile menu.",
        "Our video player supports full-screen mode and playback speed controls.",
        "Use the curriculum sidebar to navigate between lessons and chapters.",
        "Some lessons may be available as 'Free Previews' before you enroll."
      ]
    },
    {
      title: "Account Tracking",
      icon: <User className="w-6 h-6 text-amber-500" />,
      description: "Managing your profile and settings.",
      steps: [
        "Update your name, avatar, and password in 'Account Settings'.",
        "View your purchase history and active enrollments.",
        "Instructors have access to an 'Instructor Dashboard' to manage their own content."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Student Guide</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto uppercase tracking-wider font-bold">
            Everything you need to know to excel on EduStream
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>
              <p className="text-slate-500 mb-6 leading-relaxed">
                {section.description}
              </p>
              <ul className="space-y-4">
                {section.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex gap-3 text-sm text-slate-700 leading-snug">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Ready to start?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto font-medium">
              Join thousands of students and start learning today with our world-class courses.
            </p>
            <Link href="/courses">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 px-10 py-6 text-lg font-black rounded-2xl shadow-xl">
                Explore Courses
              </Button>
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
            <p>Still have questions? Feel free to contact our support team or check our FAQ.</p>
        </div>
      </div>
    </div>
  );
}
