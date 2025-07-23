import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Eye, Newspaper, CheckCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatsSidebarProps {
  articles: Article[];
}

export function StatsSidebar({ articles }: StatsSidebarProps) {
  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const totalUrgent = articles.filter(a => a.isUrgent).length;
  const categories = [...new Set(articles.map(a => a.category))];

  const categoryCounts = categories.map(category => ({
    name: category,
    count: articles.filter(a => a.category === category).length,
  }));

  return (
    <aside className="space-y-6 sticky top-8">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">إحصائيات مباشرة</CardTitle>
          <BarChart className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 text-primary rounded-md">
                <Newspaper className="h-5 w-5" />
              </div>
              <span className="font-semibold">إجمالي المقالات</span>
            </div>
            <span className="text-2xl font-bold font-mono text-primary">
              {totalArticles.toLocaleString('ar-EG')}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-500 rounded-md">
                <Eye className="h-5 w-5" />
              </div>
              <span className="font-semibold">إجمالي المشاهدات</span>
            </div>
            <span className="text-2xl font-bold font-mono text-blue-500">
              {totalViews.toLocaleString('ar-EG')}
            </span>
          </div>
           <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 text-destructive rounded-md">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-semibold">الأخبار العاجلة</span>
            </div>
            <span className="text-2xl font-bold font-mono text-destructive">
              {totalUrgent.toLocaleString('ar-EG')}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {categoryCounts.map(cat => (
              <li key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{cat.name}</span>
                </div>
                <Badge variant="secondary">{cat.count}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
