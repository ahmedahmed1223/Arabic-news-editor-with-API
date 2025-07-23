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
    // Don't set isLoading to true on polling to avoid UI flicker
    // setIsLoading(true); 
    try {
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
    const intervalId = setInterval(fetchArticles, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
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
    <div dir="rtl" className="min-h-screen flex flex-col bg-secondary font-sans">
      <Header />
      <NewsTicker articles={articles} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
            <StatsSidebar articles={articles} isLoading={isLoading}/>
          </div>
          
          <div className="lg:col-span-8 xl:col-span-9">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                  لوحة التحكم بالأخبار
                </h1>
                <Button onClick={handleAddNew} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                    <PlusCircle className="ml-2 h-5 w-5" />
                    إضافة خبر
                </Button>
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
      
      <AddEditNewsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
        article={selectedArticle}
      />
    </div>
  );
}
