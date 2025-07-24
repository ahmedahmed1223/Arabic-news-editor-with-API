
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    setSelectedRows(new Set());
  }, [articles]);

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
  
  const handleDelete = async () => {
    try {
      await Promise.all(idsToDelete.map(id => deleteNews(id)));
      toast({
        title: "نجاح",
        description: `تم حذف ${idsToDelete.length} خبر بنجاح.`,
        className: "bg-green-100 border-green-300 text-green-800",
      });
      setSelectedRows(new Set());
      onDeleteSuccess();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الأخبار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
        setIsDeleteDialogOpen(false);
        setIdsToDelete([]);
    }
  };

  const openDeleteDialog = (ids: number[]) => {
    if (ids.length > 0) {
        setIdsToDelete(ids);
        setIsDeleteDialogOpen(true);
    }
  };

  const handleSelectRow = (id: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedRows(new Set(articles.map(a => a.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const isAllSelected = selectedRows.size === articles.length && articles.length > 0;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < articles.length;

  const renderSkeleton = () => (
    [...Array(8)].map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-5 w-5" /></TableCell>
        <TableCell><Skeleton className="h-5 w-4/5" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <div className="border rounded-xl bg-card shadow-lg overflow-hidden">
            {selectedRows.size > 0 && (
                <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        {selectedRows.size} أخبار محددة
                    </span>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(Array.from(selectedRows))}>
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف المحدد
                        </Button>
                    </AlertDialogTrigger>
                </div>
            )}
        <Table>
            <TableHeader className="bg-muted/50">
            <TableRow>
                <TableHead className="w-12">
                    <Checkbox
                        checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                        onCheckedChange={handleSelectAll}
                    />
                </TableHead>
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
                <TableRow key={article.id} className="hover:bg-muted/30" data-state={selectedRows.has(article.id) ? 'selected' : ''}>
                <TableCell>
                    <Checkbox
                        checked={selectedRows.has(article.id)}
                        onCheckedChange={() => handleSelectRow(article.id)}
                    />
                </TableCell>
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
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => openDeleteDialog([article.id])}>
                                    <Trash2 className="ml-2 h-4 w-4" />
                                    <span>حذف</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                <AlertDialogDescription>
                    هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف {idsToDelete.length > 1 ? `${idsToDelete.length} أخبار` : 'الخبر المحدد'} بشكل دائم.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIdsToDelete([])}>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    نعم، قم بالحذف
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
