import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Eye, Newspaper, Zap, Activity } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface StatsSidebarProps {
  articles: Article[];
  isLoading: boolean;
}

const StatCard = ({ icon: Icon, title, value, unit, iconBgClass, isLoading }: { icon: React.ElementType, title: string, value: string | number, unit?: string, iconBgClass: string, isLoading: boolean }) => (
    <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? <Skeleton className="h-7 w-20 mt-1" /> : <p className="text-2xl font-bold">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>}
        </div>
    </div>
);


export function StatsSidebar({ articles, isLoading }: StatsSidebarProps) {
  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const totalUrgent = articles.filter(a => a.isUrgent).length;
  const averageViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;
 

  return (
    <aside className="space-y-6 sticky top-28">
      <Card className="shadow-md border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">ملخص الأداء</CardTitle>
          <BarChart className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-6">
            <StatCard 
                icon={Newspaper}
                title="إجمالي المقالات"
                value={totalArticles.toLocaleString('ar-EG')}
                iconBgClass="bg-primary"
                isLoading={isLoading}
            />
             <StatCard 
                icon={Eye}
                title="إجمالي المشاهدات"
                value={totalViews > 1000 ? `${(totalViews/1000).toFixed(1)}K` : totalViews.toLocaleString('ar-EG')}
                iconBgClass="bg-blue-500"
                isLoading={isLoading}
            />
             <StatCard 
                icon={Zap}
                title="الأخبار العاجلة"
                value={totalUrgent.toLocaleString('ar-EG')}
                iconBgClass="bg-destructive"
                isLoading={isLoading}
            />
            <StatCard 
                icon={Activity}
                title="متوسط المشاهدات"
                value={averageViews.toLocaleString('ar-EG')}
                unit="/ خبر"
                iconBgClass="bg-green-500"
                isLoading={isLoading}
            />
        </CardContent>
      </Card>
    </aside>
  );
}
