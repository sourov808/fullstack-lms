import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary">error</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="font-bold">
            <Link href="/">
              <span className="material-symbols-outlined mr-2 text-[18px]">home</span>
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="font-bold">
            <Link href="/courses">
              <span className="material-symbols-outlined mr-2 text-[18px]">school</span>
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
