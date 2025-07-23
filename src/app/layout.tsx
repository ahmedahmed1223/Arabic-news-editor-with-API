import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Cairo } from 'next/font/google'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'Akhbar Al Youm',
  description: 'Your daily news source',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans bg-secondary/30 text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
