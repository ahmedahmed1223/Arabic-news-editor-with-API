'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, Zap } from 'lucide-react';

interface NewsTickerProps {
  articles: Article[];
}

export function NewsTicker({ articles }: NewsTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const urgentArticles = useMemo(() => {
    const urgent = articles.filter(a => a.isUrgent);
    if (urgent.length === 0) return [];
    // Duplicate the articles to create a seamless loop, ensure there's enough content
    const duplicated = [...urgent, ...urgent, ...urgent, ...urgent];
    return duplicated;
  }, [articles]);

  if (urgentArticles.length === 0 || !isClient) {
    return null;
  }

  return (
    <div className="bg-primary/10 text-primary border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          <Badge variant="destructive" className="hidden sm:flex items-center gap-2 text-base shrink-0 shadow-md">
            <Zap className="h-4 w-4 animate-pulse" />
            عاجل
          </Badge>
          <div className="flex-grow overflow-hidden relative h-full group">
            <div
              className={`flex items-center absolute top-0 left-0 w-max h-full group-hover:pause ${!isPaused ? 'ticker-animation' : ''}`}
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {urgentArticles.map((article, index) => (
                <div key={`${article.id}-${index}`} className="flex items-center whitespace-nowrap px-6">
                  <span className="font-semibold text-primary/90">{article.title}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 mx-6"></span>
                </div>
              ))}
            </div>
             <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/10 pointer-events-none"></div>
             <div className="absolute inset-0 bg-gradient-to-l from-primary/0 via-primary/0 to-primary/10 pointer-events-none"></div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="text-primary hover:bg-primary/20"
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
