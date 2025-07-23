import { getNews } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { NewsTicker } from '@/components/layout/news-ticker';
import { ArticleCard } from '@/components/news/article-card';
import { StatsSidebar } from '@/components/news/stats-sidebar';

export default async function HomePage() {
  const articles = await getNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NewsTicker articles={articles} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
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
        </div>
      </footer>
    </div>
  );
}
