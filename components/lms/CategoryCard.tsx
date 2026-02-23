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
      className="group block p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all text-center"
    >
      <div className="w-12 h-12 bg-slate-50 group-hover:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600 group-hover:text-primary transition-all">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <span className="font-bold text-sm text-slate-800">{title}</span>
    </Link>
  );
}
