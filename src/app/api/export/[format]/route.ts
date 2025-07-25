
import { getNews } from '@/lib/server-data';
import type { Article } from '@/lib/types';
import { NextResponse, type NextRequest } from 'next/server';
import { stringify } from 'csv-stringify/sync';

// Ensure the route is always dynamic
export const dynamic = 'force-dynamic';

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

function generateTxt(articles: Article[]): string {
  const BOM = '\uFEFF'; // Add BOM for UTF-8 support in Windows
  let content = BOM;
  articles.forEach(article => {
    content += `العنوان: ${article.title}\n`;
    content += `الفئة: ${article.category}\n`;
    content += `تاريخ النشر: ${new Date(article.publishedAt).toLocaleString('ar-EG')}\n`;
    content += `المشاهدات: ${article.views}\n`;
    content += `عاجل: ${article.isUrgent ? 'نعم' : 'لا'}\n`;
    content += `المحتوى: ${article.content}\n`;
    content += `رابط الصورة: ${article.imageUrl}\n`;
    content += '--------------------------------------------------\n\n';
  });
  return content;
}

function generateCsv(articles: Article[]): string {
  const BOM = '\uFEFF'; // UTF-8 BOM
  const headers = ['id', 'title', 'category', 'publishedAt', 'views', 'isUrgent', 'content', 'imageUrl'];
  const data = articles.map(a => ({
      ...a,
      publishedAt: new Date(a.publishedAt).toISOString(),
  }));

  const csvString = stringify(data, {
    header: true,
    columns: headers,
    cast: {
      boolean: (value) => value ? 'نعم' : 'لا'
    }
  });
  
  return BOM + csvString;
}

function generateXml(articles: Article[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<articles>\n';
  articles.forEach(article => {
    xml += '  <article>\n';
    xml += `    <id>${article.id}</id>\n`;
    xml += `    <title>${escapeXml(article.title)}</title>\n`;
    xml += `    <content>${escapeXml(article.content)}</content>\n`;
    xml += `    <category>${escapeXml(article.category)}</category>\n`;
    xml += `    <publishedAt>${new Date(article.publishedAt).toISOString()}</publishedAt>\n`;
    xml += `    <views>${article.views}</views>\n`;
    xml += `    <isUrgent>${article.isUrgent}</isUrgent>\n`;
    xml += `    <imageUrl>${escapeXml(article.imageUrl)}</imageUrl>\n`;
    xml += '  </article>\n';
  });
  xml += '</articles>';
  return xml;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { format: string } }
) {
  const format = params.format.toLowerCase();
  const articles = getNews();

  let content: string;
  let contentType: string;
  let filename: string;

  switch (format) {
    case 'txt':
      content = generateTxt(articles);
      contentType = 'text/plain; charset=utf-8';
      filename = 'akhbar_al_youm.txt';
      break;
    case 'csv':
      content = generateCsv(articles);
      contentType = 'text/csv; charset=utf-8';
      filename = 'akhbar_al_youm.csv';
      break;
    case 'xml':
      content = generateXml(articles);
      contentType = 'application/xml; charset=utf-8';
      filename = 'akhbar_al_youm.xml';
      break;
    default:
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  });
}

