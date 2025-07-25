import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Cairo } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'أخبار اليوم | لوحة التحكم',
  description: 'لوحة تحكم متكاملة لإدارة المحتوى الإخباري بفعالية وسهولة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans bg-secondary/30 text-foreground`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
