import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Eye, Newspaper } from 'lucide-react';
import Image from 'next/image';

interface StatsSidebarProps {
  articles: Article[];
}

export function StatsSidebar({ articles }: StatsSidebarProps) {
  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const mostViewed = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <aside className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إحصائيات مباشرة</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 text-primary rounded-md">
                <Newspaper className="h-5 w-5" />
              </div>
              <span className="font-bold">إجمالي المقالات</span>
            </div>
            <span className="text-2xl font-bold font-mono text-primary">
              {totalArticles.toLocaleString('ar-EG')}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 text-accent rounded-md">
                <Eye className="h-5 w-5" />
              </div>
              <span className="font-bold">إجمالي المشاهدات</span>
            </div>
            <span className="text-2xl font-bold font-mono text-accent">
              {totalViews.toLocaleString('ar-EG')}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>الأكثر قراءة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {mostViewed.map(article => (
              <li key={article.id} className="flex items-start gap-4">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
                  data-ai-hint={article.imageHint}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-bold leading-tight">{article.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.views.toLocaleString('ar-EG')} مشاهدة
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
