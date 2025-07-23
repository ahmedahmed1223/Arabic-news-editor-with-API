'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { Zap } from 'lucide-react';

interface NewsTickerProps {
  articles: Article[];
}

export function NewsTicker({ articles }: NewsTickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const urgentArticles = useMemo(() => {
    const urgent = articles.filter(a => a.isUrgent);
    if (urgent.length === 0) return [];
    // Duplicate the articles to create a seamless loop, ensure there's enough content
    const duplicated = [...urgent, ...urgent, ...urgent, ...urgent, ...urgent];
    return duplicated;
  }, [articles]);

  if (urgentArticles.length === 0 || !isClient) {
    return null;
  }

  return (
    <div className="bg-primary/10 border-y border-primary/20 group overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-12">
          <div className="hidden sm:flex items-center gap-2 text-primary font-bold shrink-0">
            <Zap className="h-5 w-5 animate-pulse" />
            <span>عاجل</span>
          </div>
          <div className="flex-grow overflow-hidden relative h-full">
            <div
              className="flex items-center absolute top-0 left-0 w-max h-full ticker-animation group-hover:pause"
            >
              {urgentArticles.map((article, index) => (
                <div key={`${article.id}-${index}`} className="flex items-center whitespace-nowrap px-6">
                  <span className="font-semibold text-primary/90">{article.title}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 mx-6"></span>
                </div>
              ))}
            </div>
             <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
             <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
