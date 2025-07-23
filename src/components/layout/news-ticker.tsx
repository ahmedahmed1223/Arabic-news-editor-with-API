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
    // Duplicate the articles to create a seamless loop
    return [...urgent, ...urgent];
  }, [articles]);

  if (urgentArticles.length === 0 || !isClient) {
    return null;
  }

  return (
    <div className="bg-accent text-accent-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          <Badge variant="destructive" className="hidden sm:flex items-center gap-2 text-base shrink-0">
            <Zap className="h-4 w-4" />
            عاجل
          </Badge>
          <div className="flex-grow overflow-hidden relative h-full">
            <div
              className={`flex items-center absolute top-0 left-0 w-max h-full ${!isPaused ? 'ticker-animation' : ''}`}
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {urgentArticles.map((article, index) => (
                <div key={`${article.id}-${index}`} className="flex items-center whitespace-nowrap px-6">
                  <span className="font-bold">{article.title}</span>
                  <span className="w-2 h-2 rounded-full bg-primary mx-6"></span>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="hover:bg-accent/50"
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
