import { z } from 'zod';

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string().min(5, "يجب أن يكون العنوان 5 أحرف على الأقل"),
  content: z.string().min(20, "يجب أن يكون المحتوى 20 حرفًا على الأقل"),
  imageUrl: z.string().url(),
  imageHint: z.string(),
  category: z.string().min(2, "الفئة مطلوبة"),
  publishedAt: z.string().datetime(),
  views: z.number().int().nonnegative(),
  isUrgent: z.boolean(),
});

export const ApiArticleSchema = z.object({
    title: z.string().min(5, { message: "يجب أن يكون العنوان 5 أحرف على الأقل." }),
    content: z.string().min(20, { message: "يجب أن يكون المحتوى 20 حرفًا على الأقل." }),
    category: z.string().min(2, { message: "الفئة مطلوبة." }),
    isUrgent: z.boolean(),
  });


export type Article = z.infer<typeof ArticleSchema>;
export type SortKey = keyof Article;

export type NewArticle = z.infer<typeof ApiArticleSchema>;
