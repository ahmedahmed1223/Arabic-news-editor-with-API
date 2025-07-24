import { getNews, addNews, updateNews, deleteNews, deleteAllNews } from '@/lib/server-data';
import { ApiArticleSchema } from '@/lib/types';
import { NextResponse, NextRequest } from 'next/server';

// Ensure the route is always dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const articles = getNews();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const newArticleData = await request.json();
    
    const validatedData = ApiArticleSchema.safeParse(newArticleData);

    if (!validatedData.success) {
      console.error('API Validation Error:', validatedData.error.flatten());
      return NextResponse.json({ error: 'Invalid article data', details: validatedData.error.flatten() }, { status: 400 });
    }

    const newArticle = addNews(validatedData.data);
    
    return NextResponse.json(newArticle, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article', details: (error as Error).message }, { status: 500 });
  }
}

async function handleRequestWithId(request: NextRequest, handler: (id: number, data?: any) => Promise<any> | any) {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

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
                console.error('API Validation Error:', validatedData.error.flatten());
                return NextResponse.json({ error: 'Invalid article data', details: validatedData.error.flatten() }, { status: 400 });
            }
            payload = validatedData.data;
        }
        const result = handler(id, payload);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(`API ${request.method} Error for ID ${id}:`, error);
        if (error.message.includes('not found')) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ error: `Failed to ${request.method?.toLowerCase()} article`, details: error.message }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest) {
    return handleRequestWithId(request, updateNews);
}

export async function DELETE(request: NextRequest) {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    // Handle delete all if no ID is provided
    if (!idParam) {
        try {
            const result = deleteAllNews();
            return NextResponse.json(result);
        } catch (error: any) {
             console.error(`API DELETE ALL Error:`, error);
             return NextResponse.json({ error: 'Failed to delete all articles', details: error.message }, { status: 500 });
        }
    }
    // Handle delete one by ID
    return handleRequestWithId(request, deleteNews);
}
