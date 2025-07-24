
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Article } from '@/lib/types';
import { addNews, updateNews } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ApiArticleSchema } from '@/lib/types';

interface AddEditNewsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  article: Article | null;
}

const formSchema = ApiArticleSchema;

type FormData = z.infer<typeof formSchema>;

export function AddEditNewsDialog({ isOpen, onClose, onSuccess, article }: AddEditNewsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      isUrgent: false,
    },
  });

  const isEditMode = article !== null;

  useEffect(() => {
    if (isOpen) {
        form.reset(
            isEditMode
            ? {
                title: article.title,
                content: article.content,
                category: article.category,
                isUrgent: article.isUrgent,
                }
            : {
                title: '',
                content: '',
                category: '',
                isUrgent: false,
            }
        );
    }
  }, [isOpen, article, isEditMode, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateNews(article.id, data);
      } else {
        await addNews(data);
      }
      toast({
        title: "نجاح",
        description: `تم ${isEditMode ? 'تحديث' : 'إضافة'} الخبر بنجاح.`,
        className: "bg-green-100 border-green-300 text-green-800",
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to save article:', error);
       toast({
        title: "خطأ",
        description: "فشل حفظ الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Need to handle open state from parent to allow form reset
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'تعديل الخبر' : 'إضافة خبر جديد'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'قم بتعديل تفاصيل الخبر أدناه.' : 'أدخل تفاصيل الخبر الجديد هنا.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>العنوان</FormLabel>
                            <FormControl>
                                <Input placeholder="عنوان الخبر..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>المحتوى</FormLabel>
                            <FormControl>
                                <Textarea placeholder="محتوى الخبر..." {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>الفئة</FormLabel>
                            <FormControl>
                                <Input placeholder="رياضة، اقتصاد..." {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="isUrgent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>خبر عاجل؟</FormLabel>
                            </div>
                            <FormControl>
                               <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'جار الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
