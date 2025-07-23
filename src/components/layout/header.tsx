import { Newspaper } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-40 backdrop-blur-sm bg-card/70">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary group-hover:bg-primary/90 transition-colors p-2.5 rounded-lg">
            <Newspaper className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
            أخبار اليوم
          </h1>
        </Link>
        <p className="text-sm text-muted-foreground hidden md:block">
          مصدرك الموثوق للأخبار العاجلة والتحليلات
        </p>
      </div>
    </header>
  );
}
