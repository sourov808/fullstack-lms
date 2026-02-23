import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UnauthorizedProps {
  message?: string;
  redirectHref?: string;
  redirectLabel?: string;
}

/**
 * Unauthorized Component
 * 
 * Displays an access denied page when users try to access restricted content.
 * 
 * @param message - Custom message to display (default: "You don't have permission to access this page.")
 * @param redirectHref - URL to redirect to (default: "/")
 * @param redirectLabel - Label for the redirect button (default: "Back to Home")
 * 
 * @example
 * // In a server component
 * import Unauthorized from "@/components/lms/Unauthorized";
 * 
 * if (!user) {
 *   return <Unauthorized message="Please log in to continue." redirectHref="/login" redirectLabel="Log In" />;
 * }
 * 
 * @example
 * // For admin-only pages
 * if (user.user_metadata?.role !== "admin") {
 *   return <Unauthorized message="Admin access required." redirectHref="/dashboard" redirectLabel="Go to Dashboard" />;
 * }
 */
export default function Unauthorized({
  message = "You don't have permission to access this page.",
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
