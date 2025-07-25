
'use client';

import type { Article } from '@/lib/types';
import { ArticleCard } from './article-card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsGridProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDeleteSuccess: () => void;
  isLoading: boolean;
}

export function NewsGrid({ articles, onEdit, onDeleteSuccess, isLoading }: NewsGridProps) {

  const renderSkeleton = () => (
    [...Array(6)].map((_, i) => (
      <div key={`skeleton-${i}`} className="flex flex-col space-y-3">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    ))
  );

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? renderSkeleton() : articles.map(article => (
            <ArticleCard 
                key={article.id} 
                article={article} 
                onEdit={onEdit} 
                onDeleteSuccess={onDeleteSuccess} 
            />
        ))}
        </div>
        {!isLoading && articles.length === 0 && (
            <div className="text-center p-8 py-16 text-muted-foreground bg-card rounded-xl">
                لم يتم العثور على أخبار تطابق بحثك.
            </div>
        )}
    </div>
  );
}
