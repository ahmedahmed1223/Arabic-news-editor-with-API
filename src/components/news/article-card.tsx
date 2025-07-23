import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Zap, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Pencil, Trash2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
}

export function ArticleCard({ article, onEdit }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ar });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group border-border/80 hover:border-primary/50">
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
                 <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 className="ml-2 h-4 w-4" />
                    <span>حذف (قيد الإنشاء)</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
