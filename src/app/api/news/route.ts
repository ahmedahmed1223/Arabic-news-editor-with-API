'use server';

import { getNews, addNews } from '@/lib/data';
import { ArticleSchema } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function GET() {
  const articles = await getNews();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const newArticleData = await request.json();
    
    // Omit server-side fields before validation
    const { id, publishedAt, views, ...clientData } = newArticleData;
    
    const validatedData = ArticleSchema.partial().omit({ 
        id: true, 
        publishedAt: true, 
        views: true,
        imageHint: true,
        imageUrl: true
    }).safeParse(clientData);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid article data', details: validatedData.error.flatten() }, { status: 400 });
    }

    const newArticle = await addNews(validatedData.data);
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
