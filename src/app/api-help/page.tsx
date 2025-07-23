'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/lib/types';
import { Code, Copy, Download, Upload, Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ApiHelpPage() {
  const [localStorageArticles, setLocalStorageArticles] = useState<Article[]>([]);
  const { toast } = useToast();
  const apiEndpoint = '/api/news';

  useEffect(() => {
    try {
      const storedArticles = localStorage.getItem('news_data');
      if (storedArticles) {
        setLocalStorageArticles(JSON.parse(storedArticles));
      }
    } catch (error) {
      console.error("Failed to parse articles from localStorage", error);
    }
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ النص إلى الحافظة.",
    });
  };

  const exampleGetCode = `fetch('${apiEndpoint}')
  .then(response => response.json())
  .then(data => console.log(data));`;
  
  const examplePostCode = `fetch('${apiEndpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "عنوان الخبر الجديد",
    content: "محتوى الخبر هنا...",
    category: "اقتصاد",
    isUrgent: false
  }),
})
.then(response => response.json())
.then(data => console.log('Article created:', data));`;

  const examplePatchCode = `fetch(\`\${apiEndpoint}?id=1\`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "عنوان الخبر المحدث",
    views: 100
  }),
})
.then(response => response.json())
.then(data => console.log('Article updated:', data));`;

  const exampleDeleteCode = `fetch(\`\${apiEndpoint}?id=1\`, {
  method: 'DELETE',
})
.then(response => response.json())
.then(data => console.log('Article deleted:', data));`;


  const renderCodeBlock = (title: string, code: string) => (
    <div className="relative mt-4">
      <h3 className="font-bold mb-2 text-sm">{title}</h3>
      <pre className="bg-secondary rounded-md p-4 text-left dir-ltr overflow-x-auto font-code text-xs leading-relaxed">
        {code}
      </pre>
      <Button variant="ghost" size="icon" className="absolute top-10 right-2" onClick={() => handleCopyToClipboard(code)}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" />
              مساعدة واجهة برمجة التطبيقات (API)
            </CardTitle>
             <p className="text-muted-foreground pt-2">
                دليل شامل لاستخدام API الخاص بمنصة أخبار اليوم.
             </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Download className="h-6 w-6 text-muted-foreground"/>
                استعراض الأخبار (GET)
              </h2>
              <p>للحصول على جميع مقالات الأخبار، أرسل طلب GET إلى نقطة النهاية التالية:</p>
              <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <Badge variant="secondary" className="text-green-600 bg-green-100">GET</Badge>
                <code className="flex-grow text-left dir-ltr font-code">{apiEndpoint}</code>
              </div>
              {renderCodeBlock("مثال (JavaScript)", exampleGetCode)}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                إرسال خبر جديد (POST)
              </h2>
              <p>لإنشاء خبر جديد، أرسل طلب POST إلى نفس نقطة النهاية مع بيانات الخبر في جسم الطلب. الحقول المطلوبة هي: <code>title</code>, <code>content</code>, <code>category</code>, <code>isUrgent</code>.</p>
               <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <Badge variant="secondary" className="text-blue-600 bg-blue-100">POST</Badge>
                <code className="flex-grow text-left dir-ltr font-code">{apiEndpoint}</code>
              </div>
              {renderCodeBlock("مثال (JavaScript)", examplePostCode)}
            </section>
            
             <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Pencil className="h-6 w-6 text-muted-foreground" />
                تعديل خبر (PATCH)
              </h2>
              <p>لتعديل خبر موجود، أرسل طلب PATCH مع تحديد <code>id</code> الخبر كـ query parameter. يمكنك إرسال الحقول التي ترغب في تحديثها فقط.</p>
               <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">PATCH</Badge>
                <code className="flex-grow text-left dir-ltr font-code">{`${apiEndpoint}?id={ID}`}</code>
              </div>
              {renderCodeBlock("مثال (JavaScript)", examplePatchCode)}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-muted-foreground" />
                حذف خبر (DELETE)
              </h2>
              <p>لحذف خبر، أرسل طلب DELETE مع تحديد <code>id</code> الخبر كـ query parameter.</p>
               <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <Badge variant="secondary" className="text-red-600 bg-red-100">DELETE</Badge>
                <code className="flex-grow text-left dir-ltr font-code">{`${apiEndpoint}?id={ID}`}</code>
              </div>
              {renderCodeBlock("مثال (JavaScript)", exampleDeleteCode)}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-2">البيانات المخزنة محليًا (LocalStorage)</h2>
              <p>
                يتم تخزين بيانات الأخبار أيضًا في `localStorage` بالمتصفح تحت المفتاح `news_data` للمحافظة عليها بين الجلسات وتحسين سرعة التحميل.
              </p>
              {localStorageArticles.length > 0 && (
                 <div className="relative mt-4">
                  <h3 className="font-bold mb-2 text-sm">عينة من البيانات المخزنة:</h3>
                    <pre className="bg-secondary rounded-md p-4 text-left dir-ltr overflow-x-auto max-h-60 font-code text-xs">
                      {JSON.stringify(localStorageArticles.slice(0, 2), null, 2)}
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute top-10 right-2" onClick={() => handleCopyToClipboard(JSON.stringify(localStorageArticles.slice(0, 2), null, 2))}>
                      <Copy className="h-4 w-4" />
                    </Button>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-card mt-8 py-6">
        <div className="container mx-auto text-center text-muted-foreground">
           <Link href="/" className="text-sm text-primary hover:underline mt-2 inline-block mb-2">
            العودة للصفحة الرئيسية
          </Link>
          <p>&copy; {new Date().getFullYear()} أخبار اليوم. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
