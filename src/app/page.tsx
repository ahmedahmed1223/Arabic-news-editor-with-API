
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Article } from '@/lib/types';
import { getNews, deleteAllNews } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { NewsTicker } from '@/components/layout/news-ticker';
import { StatsSidebar } from '@/components/news/stats-sidebar';
import { NewsTable } from '@/components/news/news-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Download, Rss, List, LayoutGrid, Search, ChevronsUpDown, ArrowDown, ArrowUp } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NewsGrid } from '@/components/news/news-grid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { SortKey } from '@/lib/types';


type ViewMode = 'list' | 'grid';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'publishedAt', direction: 'descending' });


  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
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
  }, [toast]);

  useEffect(() => {
    fetchArticles();
    const intervalId = setInterval(fetchArticles, 10000); 

    return () => clearInterval(intervalId);
  }, [fetchArticles]);
  
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = (format: 'txt' | 'csv' | 'xml') => {
      window.open(`/api/export/${format}`, '_blank');
  };

  const categories = useMemo(() => {
    const allCategories = articles.map(a => a.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [articles]);


  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedArticles = useMemo(() => {
    let sortableItems = [...articles];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [articles, sortConfig]);

  const filteredArticles = useMemo(() => {
    return sortedArticles
      .filter(article => 
        categoryFilter === 'all' || article.category === categoryFilter
      )
      .filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [sortedArticles, searchQuery, categoryFilter]);


  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-secondary font-sans">
      <Header />
      <NewsTicker articles={articles.filter(a => a.isUrgent)} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-6">
            <StatsSidebar articles={articles} isLoading={isLoading}/>
             <Card className="shadow-md border-border/80">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                              تصدير الأخبار
                              <Download className="mr-auto h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => handleExport('csv')}>
                              تصدير كـ CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('xml')}>
                              تصدير كـ XML
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleExport('txt')}>
                              تصدير كـ TXT
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>

                   <Button asChild variant="outline" className="w-full justify-between">
                       <a href="/api/rss" target="_blank" rel="noopener noreferrer">
                        خلاصة RSS
                        <Rss className="mr-auto h-4 w-4" />
                       </a>
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full justify-between">
                                حذف جميع الأخبار
                                <Trash2 className="mr-auto h-4 w-4" />
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
                </CardContent>
            </Card>
          </aside>
          
          <div className="lg:col-span-8 xl:col-span-9">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                  لوحة التحكم بالأخبار
                </h1>
                <Button onClick={handleAddNew} size="lg" className="shadow-md hover:shadow-lg transition-shadow shrink-0">
                    <PlusCircle className="ml-2 h-5 w-5" />
                    إضافة خبر
                </Button>
            </div>

            <Card className="p-4 sm:p-6 mb-6 shadow-md border-border/80">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="relative sm:col-span-6">
                     <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                        placeholder="ابحث في الأخبار..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                  </div>
                  <div className="sm:col-span-3">
                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="فلترة حسب الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat === 'all' ? 'جميع الفئات' : cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
                   <div className="sm:col-span-3 flex justify-end">
                      <ToggleGroup type="single" value={viewMode} onValueChange={(value: ViewMode) => value && setViewMode(value)} aria-label="طريقة العرض">
                          <ToggleGroupItem value="list" aria-label="عرض القائمة">
                              <List className="h-5 w-5" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="grid" aria-label="عرض الشبكة">
                              <LayoutGrid className="h-5 w-5" />
                          </ToggleGroupItem>
                      </ToggleGroup>
                  </div>
              </div>
            </Card>
            
            {viewMode === 'list' ? (
                <NewsTable
                articles={filteredArticles}
                onEdit={handleEdit}
                onDeleteSuccess={fetchArticles}
                isLoading={isLoading}
                sortConfig={sortConfig}
                requestSort={requestSort}
                />
            ) : (
                <NewsGrid
                articles={filteredArticles}
                onEdit={handleEdit}
                onDeleteSuccess={fetchArticles}
                isLoading={isLoading}
                />
            )}
          </div>

        </div>
      </main>
      
       <footer className="bg-card mt-8 py-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
           <div className="flex justify-center gap-4">
             <Link href="/api-help" className="text-sm text-primary hover:underline">
                مساعدة الواجهة البرمجية (API)
              </Link>
              <Link href="/api-test" className="text-sm text-primary hover:underline">
                اختبار الواجهة البرمجية (API)
              </Link>
           </div>
          <p className="mt-2">&copy; {new Date().getFullYear()} أخبار اليوم. جميع الحقوق محفوظة.</p>
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
