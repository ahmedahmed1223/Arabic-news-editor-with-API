import { getNews } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  const articles = await getNews();
  return NextResponse.json(articles);
}
