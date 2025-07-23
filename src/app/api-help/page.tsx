'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/lib/types';
import { Code, Copy, Download, Upload } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" />
              مساعدة واجهة برمجة التطبيقات (API)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Download className="h-6 w-6 text-muted-foreground"/>
                استعراض الأخبار (GET)
              </h2>
              <p>يمكنك الحصول على جميع مقالات الأخبار عن طريق إرسال طلب GET إلى نقطة النهاية التالية:</p>
              <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <code className="flex-grow text-left dir-ltr font-code">GET {apiEndpoint}</code>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(apiEndpoint)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-4">
                <h3 className="font-bold mb-2">مثال (JavaScript)</h3>
                <pre className="bg-secondary rounded-md p-4 text-left dir-ltr overflow-x-auto font-code text-sm">
                  {exampleGetCode}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-10 right-2" onClick={() => handleCopyToClipboard(exampleGetCode)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                إرسال خبر جديد (POST)
              </h2>
              <p>يمكنك إنشاء خبر جديد عن طريق إرسال طلب POST إلى نفس نقطة النهاية مع بيانات الخبر في جسم الطلب بصيغة JSON. الحقول المطلوبة هي: <code>title</code>, <code>content</code>, <code>category</code>, <code>isUrgent</code>.</p>
              <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <code className="flex-grow text-left dir-ltr font-code">POST {apiEndpoint}</code>
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(apiEndpoint)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-4">
                <h3 className="font-bold mb-2">مثال (JavaScript)</h3>
                <pre className="bg-secondary rounded-md p-4 text-left dir-ltr overflow-x-auto font-code text-sm">
                  {examplePostCode}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-10 right-2" onClick={() => handleCopyToClipboard(examplePostCode)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-2">البيانات المخزنة محليًا (LocalStorage)</h2>
              <p>
                يتم تخزين بيانات الأخبار أيضًا في `localStorage` بالمتصفح تحت المفتاح `news_data`. هذا يسمح بالوصول السريع للبيانات دون الحاجة إلى طلب جديد في كل مرة، وتبقى البيانات متاحة حتى بعد تحديث الصفحة.
              </p>
              {localStorageArticles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">عينة من البيانات المخزنة:</h3>
                  <div className="relative">
                    <pre className="bg-secondary rounded-md p-4 text-left dir-ltr overflow-x-auto max-h-60 font-code text-xs">
                      {JSON.stringify(localStorageArticles.slice(0, 2), null, 2)}
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopyToClipboard(JSON.stringify(localStorageArticles.slice(0, 2), null, 2))}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-card mt-8 py-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} أخبار اليوم. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
