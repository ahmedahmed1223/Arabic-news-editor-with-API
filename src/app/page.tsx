'use client';

import { useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import { getNews } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { NewsTicker } from '@/components/layout/news-ticker';
import { StatsSidebar } from '@/components/news/stats-sidebar';
import { NewsTable } from '@/components/news/news-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddEditNewsDialog } from '@/components/news/add-edit-news-dialog';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const news = await getNews();
      setArticles(news);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
       toast({
        title: "خطأ",
        description: "فشل في تحميل الأخبار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedArticle(null);
    setDialogOpen(true);
  };
  
  const handleSuccess = () => {
    fetchArticles();
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <NewsTicker articles={articles} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-3 xl:col-span-3">
            <StatsSidebar articles={articles} isLoading={isLoading}/>
          </div>
          
          <div className="lg:col-span-9 xl:col-span-9">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold font-headline tracking-tight">آخر الأخبار</h2>
                 <div className="flex items-center gap-4">
                  <Button onClick={handleAddNew}>
                      <PlusCircle className="ml-2 h-5 w-5" />
                      إضافة خبر
                  </Button>
                </div>
            </div>
            <NewsTable
              articles={articles}
              onEdit={handleEdit}
              onDeleteSuccess={fetchArticles}
              isLoading={isLoading}
            />
          </div>

        </div>
      </main>
      <footer className="bg-card border-t mt-12 py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} أخبار اليوم. جميع الحقوق محفوظة.</p>
          <a href="/api-help" className="text-sm text-primary hover:underline mt-2 inline-block">
            مساعدة واجهة برمجة التطبيقات (API)
          </a>
        </div>
      </footer>
      
      <AddEditNewsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
        article={selectedArticle}
      />
    </div>
  );
}
