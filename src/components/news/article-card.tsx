
'use client';

import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Zap, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
import { useToast } from '@/hooks/use-toast';
import { deleteNews } from '@/lib/data';

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDeleteSuccess: () => void;
}

export function ArticleCard({ article, onEdit, onDeleteSuccess }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ar });
  const { toast } = useToast();

  const handleDelete = async () => {
     try {
      await deleteNews(article.id);
      toast({
        title: "نجاح",
        description: `تم حذف الخبر بنجاح.`,
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
  }

  return (
    <AlertDialog>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border-border/80 hover:border-primary/50">
        <CardHeader className="p-0 relative overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={article.imageHint}
          />
          {article.isUrgent && (
            <Badge variant="destructive" className="absolute top-3 right-3 text-sm shadow-lg">
              <Zap className="ml-1 h-4 w-4" />
              عاجل
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <div className="flex justify-between items-center mb-2">
              <Badge variant="secondary" className="font-medium">{article.category}</Badge>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{timeAgo}</span>
              </div>
          </div>
          <CardTitle className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
           <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
              {article.content}
            </p>
        </CardContent>
        <CardFooter className="p-4 pt-2 text-sm text-muted-foreground flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium">
            <Eye className="h-4 w-4 text-primary/80" />
            <span>{article.views.toLocaleString('ar-EG')}</span>
          </div>
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical className="h-5 w-5" />
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
        </CardFooter>
      </Card>
      
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الخبر بشكل دائم.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                نعم، قم بالحذف
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  );
}
