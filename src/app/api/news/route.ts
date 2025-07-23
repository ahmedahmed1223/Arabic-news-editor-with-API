'use server';

import { getNews, addNews, updateNews, deleteNews } from '@/lib/data';
import { ArticleSchema } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  const articles = await getNews();
  return NextResponse.json(articles);
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
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

async function handleRequest(request: NextRequest, handler: (id: number, data?: any) => Promise<any>) {
    const id = parseInt(request.nextUrl.searchParams.get('id') || '');
    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid or missing article ID' }, { status: 400 });
    }
    
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
        if (error.message === 'Article not found') {
            return NextResponse.json({ error: error.message }, { status: 404 });
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
