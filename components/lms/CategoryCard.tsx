import Link from "next/link";

interface CategoryCardProps {
  icon: string;
  title: string;
  href: string;
}

export function CategoryCard({ icon, title, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/20 rounded-xl hover:border-primary dark:hover:border-blue-500 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-blue-500/10 transition-all text-center"
    >
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 dark:group-hover:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600 dark:text-blue-400 group-hover:text-primary dark:group-hover:text-blue-300 transition-all">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</span>
    </Link>
  );
}
