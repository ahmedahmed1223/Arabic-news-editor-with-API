'use client';

import { useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import { getNews } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { NewsTicker } from '@/components/layout/news-ticker';
import { StatsSidebar } from '@/components/news/stats-sidebar';
import { NewsTable } from '@/components/news/news-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AddEditNewsDialog } from '@/components/news/add-edit-news-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteAllNews } from '@/lib/data';
import Link from 'next/link';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { toast } = useToast();

  const fetchArticles = async () => {
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
  
  const handleDeleteAll = async () => {
    try {
      await deleteAllNews();
      toast({
        title: "نجاح",
        description: "تم حذف جميع الأخبار بنجاح.",
        className: "bg-green-100 border-green-300 text-green-800",
      });
      fetchArticles();
    } catch (error) {
       toast({
        title: "خطأ",
        description: "فشل حذف جميع الأخبار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-secondary font-sans">
      <Header />
      <NewsTicker articles={articles.filter(a => a.isUrgent)} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-6">
            <StatsSidebar articles={articles} isLoading={isLoading}/>
             <div className="p-4 bg-card rounded-xl border">
                 <h3 className="font-bold mb-4">إجراءات عامة</h3>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف جميع الأخبار
                        </Button>
                    </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription>
                           هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف <strong>جميع</strong> الأخبار بشكل دائم.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">
                            نعم، قم بحذف الكل
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </aside>
          
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
      
       <footer className="bg-card mt-8 py-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
           <Link href="/api-help" className="text-sm text-primary hover:underline mt-2 inline-block mb-2">
            مساعدة الواجهة البرمجية (API)
          </Link>
          <p>&copy; {new Date().getFullYear()} أخبار اليوم. جميع الحقوق محفوظة.</p>
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
