import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UnauthorizedProps {
  message?: string;
  redirectHref?: string;
  redirectLabel?: string;
}

export default function Unauthorized({
  message = "You don&apos;t have permission to access this page.",
  redirectHref = "/",
  redirectLabel = "Back to Home",
}: UnauthorizedProps) {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-amber-600">lock</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4">Access Denied</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-4">Unauthorized Access</h2>
        <p className="text-slate-500 mb-8">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="font-bold">
            <Link href={redirectHref}>
              <span className="material-symbols-outlined mr-2 text-[18px]">arrow_back</span>
              {redirectLabel}
            </Link>
          </Button>
          <Button variant="outline" asChild className="font-bold">
            <Link href="/dashboard">
              <span className="material-symbols-outlined mr-2 text-[18px]">dashboard</span>
              My Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
