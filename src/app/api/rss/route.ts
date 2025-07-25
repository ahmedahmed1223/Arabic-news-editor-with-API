
import { getNews } from '@/lib/server-data';
import { NextResponse } from 'next/server';

// Ensure the route is always dynamic
export const dynamic = 'force-dynamic'

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export async function GET() {
  const articles = getNews();
  const siteUrl = process.env.VERCEL_URL 
                  ? `https://${process.env.VERCEL_URL}` 
                  : 'http://localhost:9002';

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>أخبار اليوم</title>
    <link>${siteUrl}</link>
    <description>آخر الأخبار من منصة أخبار اليوم</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${articles
      .map(
        (article) => `
    <item>
        <title>${escapeXml(article.title)}</title>
        <link>${siteUrl}/news/${article.id}</link>
        <description>${escapeXml(article.content)}</description>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        <guid isPermaLink="false">${siteUrl}/news/${article.id}</guid>
    </item>
    `
      )
      .join('')}
</channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
}

