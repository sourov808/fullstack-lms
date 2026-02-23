import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UniversalSearch } from "./UniversalSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUser } from "@/lib/supabase/get-user";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { CartButton } from "@/components/lms/CartButton";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between gap-8 h-[73px]">
      <div className="flex items-center gap-8 flex-1">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase hidden sm:block">
            EduStream
          </h1>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl">
          <UniversalSearch />
        </div>
      </div>

      {/* Navigation Links & CTAs */}
      <nav className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/courses" className="hover:text-primary transition-colors">
            All Courses
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              My Learning
            </Link>
          )}
          {user?.user_metadata?.role === "admin" && (
            <Link href="/admin" className="hover:text-primary transition-colors">
              Instructor Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
             <>
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer hover:bg-slate-100 p-0 ml-2">
                     <Avatar className="h-10 w-10 border border-slate-200">
                       <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                       <AvatarFallback className="bg-primary/10 text-primary font-bold">
                         {user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                       </AvatarFallback>
                     </Avatar>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56" align="end" forceMount>
                   <DropdownMenuLabel className="font-normal border-b border-slate-100 pb-2 mb-2">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none text-slate-900">
                         {user.user_metadata?.first_name 
                           ? `${user.user_metadata?.first_name} ${user.user_metadata?.last_name || ""}` 
                           : "Student"}
                       </p>
                       <p className="text-xs leading-none text-slate-500">
                         {user.email}
                       </p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuItem asChild className="lg:hidden cursor-pointer py-2 text-slate-900 font-bold border-b border-slate-50 mb-1">
                     <Link href="/courses" className="flex items-center">
                       <span className="material-symbols-outlined mr-2 text-[18px]">library_books</span>
                       All Courses
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-2">
                     <Link href="/dashboard" className="flex items-center">
                       <span className="material-symbols-outlined mr-2 text-[18px]">dashboard</span>
                       My Learning
                     </Link>
                   </DropdownMenuItem>

                   {user.user_metadata?.role === "admin" && (
                     <DropdownMenuItem asChild className="cursor-pointer py-2">
                       <Link href="/admin" className="flex items-center">
                         <span className="material-symbols-outlined mr-2 text-[18px]">admin_panel_settings</span>
                         Instructor Dashboard
                       </Link>
                     </DropdownMenuItem>
                   )}

                   <DropdownMenuItem asChild className="cursor-pointer py-2">
                     <Link href="#" className="flex items-center">
                       <span className="material-symbols-outlined mr-2 text-[18px]">settings</span>
                       Account Settings
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="p-0">
                     <div className="w-full">
                       <LogoutButton />
                     </div>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="outline"
                  className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-all border-slate-200 h-auto"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button 
                  className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-opacity-90 rounded-lg shadow-sm shadow-primary/20 transition-all h-auto"
                  asChild
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>

              {/* Mobile Menu for Logged-out Users */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-lg border-slate-200">
                      <span className="material-symbols-outlined">menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                      <Link href="/courses" className="flex items-center">
                        <span className="material-symbols-outlined mr-2 text-[18px]">library_books</span>
                        All Courses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer py-2 text-slate-600">
                      <Link href="/guide" className="flex items-center">
                        <span className="material-symbols-outlined mr-2 text-[18px]">help_outline</span>
                        Student Guide
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer py-2 text-primary font-bold">
                      <Link href="/login">Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                      <Link href="/signup">Sign up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          <CartButton />
        </div>
      </nav>
    </header>
  );
}
