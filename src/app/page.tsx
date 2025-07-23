'use client';

import { useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import { getNews } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { NewsTicker } from '@/components/layout/news-ticker';
import { StatsSidebar } from '@/components/news/stats-sidebar';
import { NewsTable } from '@/components/news/news-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import { AddEditNewsDialog } from '@/components/news/add-edit-news-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArticleCard } from '@/components/news/article-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    const storedViewMode = localStorage.getItem('viewMode');
    if (storedViewMode === 'grid' || storedViewMode === 'list') {
      setViewMode(storedViewMode);
    }
    fetchArticles();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

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

  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
         <Card className="flex flex-col h-full overflow-hidden" key={i}>
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="p-4 pt-0 mt-auto flex justify-between items-center">
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-4 w-24" />
            </div>
          </Card>
      ))}
    </div>
  );

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
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as 'grid' | 'list')}} aria-label="View mode">
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <LayoutGrid className="h-5 w-5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-5 w-5" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Button onClick={handleAddNew} className="hidden sm:flex">
                      <PlusCircle className="ml-2 h-5 w-5" />
                      إضافة خبر
                  </Button>
                </div>
            </div>
            {isLoading ? (
              viewMode === 'grid' ? renderSkeletonGrid() : <NewsTable articles={[]} onEdit={handleEdit} onDeleteSuccess={fetchArticles} isLoading={true} />
            ) : viewMode === 'list' ? (
              <NewsTable
                articles={articles}
                onEdit={handleEdit}
                onDeleteSuccess={fetchArticles}
                isLoading={isLoading}
              />
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} onEdit={() => handleEdit(article)} />
                ))}
              </div>
            )}
             <Button onClick={handleAddNew} className="sm:hidden w-full mt-6">
                <PlusCircle className="ml-2 h-5 w-5" />
                إضافة خبر
            </Button>
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
