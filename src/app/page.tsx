import { getNews } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { NewsTicker } from '@/components/layout/news-ticker';
import { StatsSidebar } from '@/components/news/stats-sidebar';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';

export default async function HomePage() {
  const articles = await getNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NewsTicker articles={articles} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>المشاهدات</TableHead>
                    <TableHead>تاريخ النشر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map(article => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{article.category}</Badge>
                      </TableCell>
                      <TableCell>{article.views.toLocaleString('ar-EG')}</TableCell>
                      <TableCell>
                        {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: ar })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="lg:col-span-1">
            <StatsSidebar articles={articles} />
          </div>
        </div>
      </main>
      <footer className="bg-card mt-8 py-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} أخبار اليوم. جميع الحقوق محفوظة.</p>
          <Link href="/api-help" className="text-sm text-primary hover:underline mt-2 inline-block">
            مساعدة واجهة برمجة التطبيقات (API)
          </Link>
        </div>
      </footer>
    </div>
  );
}
