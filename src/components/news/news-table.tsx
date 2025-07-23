'use client';

import { useState, useMemo } from 'react';
import type { Article } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ChevronsUpDown, MoreHorizontal, Pencil, Trash2, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteNews } from '@/lib/data';

type SortKey = keyof Article;

interface NewsTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDeleteSuccess: () => void;
  isLoading: boolean;
}

export function NewsTable({ articles, onEdit, onDeleteSuccess, isLoading }: NewsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'publishedAt', direction: 'descending' });
  const { toast } = useToast();

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

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 text-foreground" /> : <ArrowDown className="h-4 w-4 text-foreground" />;
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteNews(id);
      toast({
        title: "نجاح",
        description: "تم حذف الخبر بنجاح.",
        className: "bg-green-100 border-green-300 text-green-800",
      });
      onDeleteSuccess();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const renderSkeleton = () => (
    [...Array(8)].map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-5 w-4/5" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead onClick={() => requestSort('title')}>
              <div className="flex items-center gap-2 cursor-pointer select-none py-2">العنوان {getSortIndicator('title')}</div>
            </TableHead>
            <TableHead onClick={() => requestSort('category')}>
              <div className="flex items-center gap-2 cursor-pointer select-none py-2">الفئة {getSortIndicator('category')}</div>
            </TableHead>
            <TableHead onClick={() => requestSort('views')}>
              <div className="flex items-center gap-2 cursor-pointer select-none py-2">المشاهدات {getSortIndicator('views')}</div>
            </TableHead>
            <TableHead onClick={() => requestSort('publishedAt')}>
              <div className="flex items-center gap-2 cursor-pointer select-none py-2">تاريخ النشر {getSortIndicator('publishedAt')}</div>
            </TableHead>
            <TableHead>إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? renderSkeleton() : sortedArticles.map(article => (
            <TableRow key={article.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                    {article.isUrgent && <Zap className="h-4 w-4 text-destructive shrink-0" />}
                    <span className="truncate">{article.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">{article.category}</Badge>
              </TableCell>
              <TableCell>{article.views.toLocaleString('ar-EG')}</TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(article.publishedAt), 'd MMM yyyy, h:mm a', { locale: ar })}
              </TableCell>
              <TableCell>
                 <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">فتح القائمة</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(article)}>
                                <Pencil className="ml-2 h-4 w-4" />
                                <span>تعديل</span>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <Trash2 className="ml-2 h-4 w-4" />
                                    <span>حذف</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription>
                            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الخبر بشكل دائم من خوادمنا.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-destructive hover:bg-destructive/90">
                            نعم، قم بالحذف
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {!isLoading && articles.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            لم يتم العثور على أخبار.
          </div>
        )}
    </div>
  );
}
