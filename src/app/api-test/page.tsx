
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Code, TestTube2, Send, Server, RefreshCw, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'DELETE_ALL';

export default function ApiTestPage() {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [articleId, setArticleId] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const apiEndpoint = '/api/news';

  const handleMethodChange = (value: HttpMethod) => {
    setMethod(value);
    setBody('');
    setArticleId('');
    setResponse(null);
    setResponseStatus(null);
    
    if (value === 'POST') {
        setBody(JSON.stringify({
          title: "عنوان افتراضي",
          content: "هذا المحتوى يتكون من أكثر من عشرين حرفًا للتجربة.",
          category: "تجربة",
          isUrgent: false
        }, null, 2));
    } else if(value === 'PATCH') {
         setBody(JSON.stringify({
          title: "عنوان محدّث",
          views: 100
        }, null, 2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setResponseStatus(null);

    let url = apiEndpoint;
    const options: RequestInit = {
      method: method === 'DELETE_ALL' ? 'DELETE' : method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'PATCH' || method === 'DELETE') {
        if(!articleId) {
            toast({ title: 'خطأ', description: 'معرف الخبر مطلوب لعمليات التعديل والحذف.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }
        url = `${apiEndpoint}?id=${articleId}`;
    }
    
    if (method === 'POST' || method === 'PATCH') {
      try {
        options.body = JSON.stringify(JSON.parse(body));
      } catch (error) {
        toast({ title: 'خطأ في جسم الطلب', description: 'الـ JSON غير صالح.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(data);
      setResponseStatus(res.status);
    } catch (error: any) {
      setResponse({ error: 'فشل الاتصال بالخادم', details: error.message });
      setResponseStatus(500);
      toast({ title: 'خطأ في الشبكة', description: 'لا يمكن الوصول إلى الواجهة البرمجية.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusColor = () => {
    if (!responseStatus) return 'text-muted-foreground';
    if (responseStatus >= 200 && responseStatus < 300) return 'text-green-600';
    if (responseStatus >= 400 && responseStatus < 500) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getStatusIcon = () => {
    if (!responseStatus) return <AlertTriangle className="h-5 w-5 text-muted-foreground"/>;
    if (responseStatus >= 200 && responseStatus < 300) return <CheckCircle className="h-5 w-5 text-green-600"/>;
    if (responseStatus >= 400 && responseStatus < 500) return <AlertTriangle className="h-5 w-5 text-yellow-600"/>;
    return <XCircle className="h-5 w-5 text-red-600"/>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-3">
              <TestTube2 className="h-8 w-8 text-primary" />
              مختبر الواجهة البرمجية (API)
            </CardTitle>
            <CardDescription className="pt-2">
              أرسل طلبات مباشرة إلى واجهة برمجة تطبيقات الأخبار واعرض الاستجابات الفورية.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="method">الطريقة (Method)</Label>
                  <Select onValueChange={handleMethodChange} defaultValue={method}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="اختر طريقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="DELETE_ALL">DELETE (All)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-10">
                  <Label htmlFor="endpoint">نقطة النهاية (Endpoint)</Label>
                  <div className="flex items-center gap-2">
                      <Input id="endpoint" readOnly value={apiEndpoint} className="font-code dir-ltr text-left" />
                     {(method === 'PATCH' || method === 'DELETE') && (
                         <Input 
                            placeholder="ID الخبر" 
                            value={articleId} 
                            onChange={(e) => setArticleId(e.target.value)} 
                            className="w-24"
                         />
                     )}
                  </div>
                </div>
              </div>

              {(method === 'POST' || method === 'PATCH') && (
                <div>
                  <Label htmlFor="body">جسم الطلب (Body)</Label>
                  <Textarea
                    id="body"
                    placeholder='{ "key": "value" }'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="h-40 font-code dir-ltr text-left"
                  />
                </div>
              )}

              <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                {isLoading ? <RefreshCw className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
                {isLoading ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
             <div className="w-full space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                الاستجابة (Response)
              </h3>
               <Card className="bg-secondary/50">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        {getStatusIcon()}
                        <p className={`font-bold text-lg ${getStatusColor()}`}>
                            Status: {responseStatus || 'N/A'}
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoading ? (
                     <div className="flex justify-center items-center h-40">
                         <RefreshCw className="h-8 w-8 animate-spin text-primary"/>
                     </div>
                  ) : response ? (
                    <pre className="bg-background rounded-md p-4 text-left dir-ltr overflow-x-auto max-h-96 font-code text-xs leading-relaxed">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-center text-muted-foreground py-10">
                        لم يتم إرسال طلب بعد.
                    </div>
                  )}
                 </CardContent>
               </Card>
            </div>
          </CardFooter>
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
