'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/lib/types';
import { Code, Copy } from 'lucide-react';

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

  const exampleCode = `fetch('${apiEndpoint}')
  .then(response => response.json())
  .then(data => console.log(data));`;

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
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-2">نقطة النهاية (Endpoint)</h2>
              <p>يمكنك الحصول على جميع مقالات الأخبار عن طريق إرسال طلب GET إلى نقطة النهاية التالية:</p>
              <div className="flex items-center gap-2 mt-2 p-3 bg-secondary rounded-md">
                <code className="flex-grow text-left dir-ltr font-code">{apiEndpoint}</code>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(apiEndpoint)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-2">مثال على الاستخدام (JavaScript)</h2>
              <p>فيما يلي مثال لكيفية جلب بيانات الأخبار باستخدام `fetch` في JavaScript.</p>
              <div className="relative mt-2">
                <pre className="bg-secondary rounded-md p-4 text-left dir-ltr overflow-x-auto font-code text-sm">
                  {exampleCode}
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopyToClipboard(exampleCode)}>
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
