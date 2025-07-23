'use server';

import { getNews, addNews, updateNews, deleteNews, deleteAllNews } from '@/lib/data';
import { ArticleSchema } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Add a no-cache header to ensure fresh data is fetched
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');
  
  const articles = await getNews();
  return NextResponse.json(articles, { headers });
}

export async function POST(request: Request) {
  try {
    const newArticleData = await request.json();
    
    const validatedData = ArticleSchema.partial().omit({ 
        id: true, 
        publishedAt: true, 
        views: true,
        imageHint: true,
        imageUrl: true
    }).safeParse(newArticleData);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid article data', details: validatedData.error.flatten() }, { status: 400 });
    }

    const newArticle = await addNews(validatedData.data);
    
    // After adding, get the full sorted list to return
    const allNews = await getNews();

    return NextResponse.json(allNews, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

async function handleRequest(request: NextRequest, handler: (id: number, data?: any) => Promise<any>) {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    // Handle deleteAll special case for DELETE method
    if (request.method === 'DELETE' && !idParam) {
        try {
            const result = await deleteAllNews();
            return NextResponse.json(result);
        } catch (error: any) {
             console.error(`API DELETE ALL Error:`, error);
             return NextResponse.json({ error: 'Failed to delete all articles' }, { status: 500 });
        }
    }

    if (!idParam || isNaN(parseInt(idParam))) {
        return NextResponse.json({ error: 'Invalid or missing article ID' }, { status: 400 });
    }
    const id = parseInt(idParam);
    
    try {
        let payload;
        if (request.method === 'PATCH') {
            payload = await request.json();
            const validatedData = ArticleSchema.partial().omit({ 
                id: true, 
                publishedAt: true, 
                views: true,
                imageHint: true,
                imageUrl: true
            }).safeParse(payload);
             if (!validatedData.success) {
                return NextResponse.json({ error: 'Invalid article data', details: validatedData.error.flatten() }, { status: 400 });
            }
            payload = validatedData.data;
        }

        const result = await handler(id, payload);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(`API ${request.method} Error:`, error);
        if (error.message.includes('not found')) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ error: `Failed to ${request.method.toLowerCase()} article` }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest) {
    return handleRequest(request, updateNews);
}

export async function DELETE(request: NextRequest) {
    return handleRequest(request, deleteNews);
}
