
import { getNews, addNews, updateNews, deleteNews, deleteAllNews } from '@/lib/data';
import { ApiArticleSchema } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');
  
  const articles = await getNews();
  return NextResponse.json(articles, { headers });
}

export async function POST(request: Request) {
  try {
    const newArticleData = await request.json();
    
    const validatedData = ApiArticleSchema.safeParse(newArticleData);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid article data', details: validatedData.error.flatten() }, { status: 400 });
    }

    const newArticle = await addNews(validatedData.data);
    
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

    if (request.method === 'DELETE' && !idParam) {
        try {
            const result = await deleteAllNews();
            return NextResponse.json(result);
        } catch (error: any) {
             console.error(`API DELETE ALL Error:`, error);
             return NextResponse.json({ error: 'Failed to delete all articles', details: error.message }, { status: 500 });
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
            const validatedData = ApiArticleSchema.partial().safeParse(payload);
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
        return NextResponse.json({ error: `Failed to ${request.method.toLowerCase()} article`, details: error.message }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest) {
    return handleRequest(request, updateNews);
}

export async function DELETE(request: NextRequest) {
    return handleRequest(request, deleteNews);
}
