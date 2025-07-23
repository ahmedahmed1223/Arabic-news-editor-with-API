import { Newspaper } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-md">
            <Newspaper className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-primary">
            أخبار اليوم
          </h1>
        </div>
        <p className="text-sm text-muted-foreground hidden md:block">
          مصدرك الموثوق للأخبار العاجلة والتحليلات
        </p>
      </div>
    </header>
  );
}
