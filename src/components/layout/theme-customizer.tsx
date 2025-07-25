
'use client';

import { Paintbrush, Check, Contrast, Text, Square } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const themes = [
  { name: 'blue', label: 'أزرق', color: 'hsl(221 83.2% 53.3%)' },
  { name: 'green', label: 'أخضر', color: 'hsl(142.1 76.2% 36.3%)' },
  { name: 'orange', label: 'برتقالي', color: 'hsl(24.6 95% 53.1%)' },
  { name: 'slate', label: 'أردوازي', color: 'hsl(222.2 47.4% 11.2%)' },
  { name: 'stone', label: 'حجري', color: 'hsl(222.9 30.3% 29.2%)' },
  { name: 'gray', label: 'رمادي', color: 'hsl(220 13.8% 27.8%)' },
  { name: 'zinc', label: 'زنك', color: 'hsl(240 5.9% 10%)' },
];

export function ThemeCustomizer() {
  const { theme, setTheme, radius, setRadius, fontSize, setFontSize } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--radius', `${radius}rem`);
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [radius, fontSize]);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">تخصيص المظهر</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">تخصيص المظهر</h3>
          </div>
          <div className="space-y-4">
            <Label>اللون</Label>
            <div className="grid grid-cols-4 gap-2">
              {themes.map((t) => (
                <Button
                  key={t.name}
                  variant="outline"
                  className={cn(
                    'justify-start',
                    theme === t.name && 'border-2 border-primary'
                  )}
                  onClick={() => setTheme(t.name)}
                >
                  <span
                    className={cn(
                      'ml-2 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full'
                    )}
                    style={{ backgroundColor: t.color }}
                  >
                    {theme === t.name && <Check className="h-4 w-4 text-white" />}
                  </span>
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <Label className="flex items-center gap-2">
                <Text className="w-5 h-5" />
                <span>حجم الخط: {fontSize}px</span>
            </Label>
             <Slider
                defaultValue={[fontSize]}
                max={20}
                min={12}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
              />
          </div>
          
           <div className="space-y-4">
            <Label className="flex items-center gap-2">
                <Square className="w-5 h-5" />
                <span>استدارة الحواف</span>
            </Label>
             <Slider
                defaultValue={[radius]}
                max={1}
                min={0}
                step={0.1}
                onValueChange={(value) => setRadius(value[0])}
              />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
