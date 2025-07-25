
# أخبار اليوم - لوحة تحكم إخبارية متكاملة

مرحباً بك في "أخبار اليوم"، تطبيق ويب حديث مصمم لإدارة وعرض المحتوى الإخباري بشكل فعال وجذاب. تم بناء هذا المشروع باستخدام Next.js، ويوفر واجهة تفاعلية لإدارة الأخبار، وواجهة برمجة تطبيقات (API) قوية، وميزات متقدمة لتخصيص تجربة المستخدم.

## ✨ الميزات الرئيسية

- **إدارة الأخبار (CRUD)**: واجهة تحكم شاملة لإضافة وتعديل وحذف الأخبار بسهولة.
- **تحديثات حية**: يتم تحديث قائمة الأخبار تلقائيًا كل 10 ثوانٍ لعرض أحدث البيانات.
- **تصميم متجاوب وداعم للغة العربية**: تصميم أنيق يعمل على جميع الأجهزة ويدعم بشكل كامل التخطيط من اليمين إلى اليسار (RTL).
- **خيارات عرض متعددة**: إمكانية التبديل بين عرض **الجدول** الكلاسيكي وعرض **الشبكة** البصري.
- **بحث وفلترة فورية**: أدوات قوية للبحث في عناوين ومحتوى الأخبار، وفلترة النتائج حسب الفئة.
- **ترتيب ديناميكي**: إمكانية ترتيب قائمة الأخبار بناءً على العنوان، الفئة، المشاهدات، أو تاريخ النشر.
- **تخصيص المظهر**: لوحة جانبية لتخصيص **نظام الألوان**، **حجم الخط**، و**استدارة الحواف** لتناسب تفضيلاتك.
- **شريط أخبار عاجلة متحرك**: يعرض الأخبار العاجلة بشكل بارز في شريط متحرك.
- **ملخص الأداء**: لوحة جانبية تعرض إحصائيات حيوية مثل إجمالي المقالات والمشاهدات والأخبار العاجلة.
- **واجهة برمجة تطبيقات (API) قوية**: واجهة RESTful API متكاملة للتعامل مع الأخبار برمجيًا.
- **تصدير البيانات**: إمكانية تصدير جميع الأخبار بصيغ متعددة: **TXT**, **CSV**, **XML**.
- **خلاصة RSS**: نقطة نهاية (`/api/rss`) لتوفير الأخبار بتنسيق RSS 2.0 القياسي.
- **جاهز للإنتاج**: تم بناء التطبيق ليكون موثوقًا وقابلاً للنشر على منصات مثل Vercel أو Firebase App Hosting.

## 🚀 كيف تبدأ

### المتطلبات
- Node.js
- npm (أو pnpm/yarn)

### التشغيل المحلي

1.  **تثبيت الحزم:**
    ```bash
    npm install
    ```

2.  **تشغيل خادم التطوير:**
    ```bash
    npm run dev
    ```

3.  افتح [http://localhost:9002](http://localhost:9002) في متصفحك.

## ⚙️ استخدام الواجهة البرمجية (API)

توفر المنصة واجهة برمجية (API) كاملة للتعامل مع الأخبار. يمكنك استخدام أدوات مثل `curl` أو Postman أو صفحة **مختبر الواجهة البرمجية** المدمجة في التطبيق.

- **`GET /api/news`**: جلب جميع الأخبار.
- **`POST /api/news`**: إضافة خبر جديد.
- **`PATCH /api/news?id={ID}`**: تعديل خبر موجود.
- **`DELETE /api/news?id={ID}`**: حذف خبر معين.
- **`DELETE /api/news`**: حذف جميع الأخبار.
- **`GET /api/rss`**: الحصول على خلاصة RSS.
- **`GET /api/export/{format}`**: تصدير الأخبار بالصيغة المحددة (`txt`, `csv`, `xml`).

يمكنك العثور على توثيق تفصيلي وأمثلة في صفحة **مساعدة الواجهة البرمجية** داخل التطبيق.

## 🛠️ التقنيات المستخدمة

- **Next.js**: إطار عمل React للويب.
- **React**: مكتبة لبناء واجهات المستخدم.
- **TypeScript**: لإضافة أنواع ثابتة إلى JavaScript.
- **Tailwind CSS**: إطار عمل CSS لتصميم سريع.
- **ShadCN/UI**: مجموعة من مكونات واجهة المستخدم القابلة لإعادة الاستخدام.
- **Lucide React**: مكتبة أيقونات جميلة.
- **Genkit (قيد التطوير)**: لإضافة ميزات الذكاء الاصطناعي مستقبلًا.

## 📄 الترخيص

هذا المشروع متاح للاستخدام والتعديل.
