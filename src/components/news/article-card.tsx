import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ar });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={article.imageHint}
        />
        {article.isUrgent && (
          <Badge variant="destructive" className="absolute top-3 right-3 text-sm">
            <Zap className="ml-1 h-4 w-4" />
            عاجل
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Badge variant="secondary" className="mb-2">{article.category}</Badge>
        <CardTitle className="font-headline text-xl leading-snug">
          {article.title}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{timeAgo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{article.views.toLocaleString('ar-EG')} مشاهدة</span>
        </div>
      </CardFooter>
    </Card>
  );
}
