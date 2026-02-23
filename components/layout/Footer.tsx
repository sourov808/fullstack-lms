import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-primary text-white p-1 rounded-lg">
              <span className="material-symbols-outlined">school</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight">EDUSTREAM</span>
          </Link>
          <p className="text-slate-400 max-w-xs leading-relaxed text-sm">
            The leading global marketplace for learning and instruction. Connect through knowledge and grow your career with us.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              href="#"
              className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">language</span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">play_circle</span>
            </Link>
          </div>
        </div>

        <div>
          <h5 className="font-bold mb-6 text-slate-200">Resources</h5>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">EduStream Business</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Teach on EduStream</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Get the app</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">About us</Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-6 text-slate-200">Legal</h5>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Careers</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Blog</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Privacy policy</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-end">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-700 bg-transparent px-4 py-2 rounded text-sm hover:text-white hover:bg-slate-800 transition-all font-normal text-slate-200"
          >
            <span className="material-symbols-outlined text-lg">public</span>
            English
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-xs">© 2024 EduStream, Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white transition-colors">social_leaderboard</span>
          <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white transition-colors">share</span>
        </div>
      </div>
    </footer>
  );
}
