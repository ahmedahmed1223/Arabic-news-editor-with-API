import type { Article } from './types';

const newsData: Article[] = [
  {
    id: 1,
    title: "اكتشاف كوكب جديد قد يدعم الحياة خارج المجموعة الشمسية",
    content: "أعلن فريق من علماء الفلك الدوليين عن اكتشاف كوكب جديد، أُطلق عليه اسم 'زركونيا'، يدور حول نجم قزم أحمر على بعد 40 سنة ضوئية. يتميز الكوكب بوجود محيطات من الماء السائل ودرجات حرارة معتدلة، مما يجعله مرشحًا قويًا لوجود حياة.",
    imageUrl: "https://placehold.co/600x400",
    imageHint: "planet space",
    category: "علوم وتكنولوجيا",
    publishedAt: "2024-05-20T10:00:00Z",
    views: 15203,
    isUrgent: true,
  },
  {
    id: 2,
    title: "أسعار النفط تصل إلى أعلى مستوى لها في ثلاثة أشهر",
    content: "ارتفعت أسعار النفط العالمية اليوم لتصل إلى أعلى مستوياتها منذ ثلاثة أشهر، وذلك بسبب التوترات الجيوسياسية المتزايدة في الشرق الأوسط وتوقعات بزيادة الطلب العالمي مع بدء تعافي الاقتصادات الكبرى.",
    imageUrl: "https://placehold.co/600x400",
    imageHint: "oil rig",
    category: "اقتصاد",
    publishedAt: "2024-05-20T09:30:00Z",
    views: 8745,
    isUrgent: false,
  },
  {
    id: 3,
    title: "تحفة فنية نادرة تباع بمبلغ قياسي في مزاد علني",
    content: "بيعت لوحة نادرة للفنان الهولندي فان جوخ بمبلغ 82.5 مليون دولار في مزاد أقيم في نيويورك، وهو رقم قياسي جديد لأعمال الفنان. اللوحة، التي لم تُعرض للجمهور منذ أكثر من قرن، تصور مشهدًا ريفيًا هادئًا.",
    imageUrl: "https://placehold.co/600x400",
    imageHint: "art auction",
    category: "فن وثقافة",
    publishedAt: "2024-05-19T18:45:00Z",
    views: 12500,
    isUrgent: false,
  },
  {
    id: 4,
    title: "منتخب كرة القدم الوطني يتأهل لنهائيات كأس العالم",
    content: "حقق المنتخب الوطني لكرة القدم إنجازًا تاريخيًا بتأهله إلى نهائيات كأس العالم بعد فوزه المثير على منافسه التقليدي في المباراة الفاصلة. عمت الاحتفالات الشوارع بعد هذا الانتصار الكبير الذي طال انتظاره.",
    imageUrl: "https://placehold.co/600x400",
    imageHint: "soccer stadium",
    category: "رياضة",
    publishedAt: "2024-05-20T21:00:00Z",
    views: 25890,
    isUrgent: true,
  },
  {
    id: 5,
    title: "شركة تقنية تطلق هاتفًا ذكيًا جديدًا بشاشة قابلة للطي بالكامل",
    content: "كشفت شركة التكنولوجيا العملاقة 'فيوتشر تك' عن أحدث ابتكاراتها، وهو هاتف ذكي بشاشة قابلة للطي بالكامل يمكن تحويله إلى جهاز لوحي. يعد الجهاز الجديد بنقلة نوعية في سوق الهواتف الذكية.",
    imageUrl: "https://placehold.co/600x400",
    imageHint: "folding phone",
    category: "علوم وتكنولوجيا",
    publishedAt: "2024-05-18T14:00:00Z",
    views: 9980,
    isUrgent: false,
  },
  {
    id: 6,
    title: "دراسة تحذر من مخاطر الجلوس لفترات طويلة على الصحة",
    content: "أظهرت دراسة حديثة أجرتها جامعة ستانفورد أن الجلوس لأكثر من ثماني ساعات يوميًا يزيد من خطر الإصابة بأمراض القلب والسكري بنسبة 20%. يوصي الباحثون بأخذ فترات راحة قصيرة للحركة كل نصف ساعة.",
    imageUrl: "https://placehold.co/600x400",
    imageHint: "office work",
    category: "صحة",
    publishedAt: "2024-05-19T11:20:00Z",
    views: 7654,
    isUrgent: false,
  },
  {
      id: 7,
      title: "قمة المناخ العالمية تدعو إلى إجراءات عاجلة لمواجهة الاحتباس الحراري",
      content: "اختتمت قمة المناخ أعمالها بالدعوة إلى اتخاذ إجراءات فورية وجذرية لخفض انبعاثات الغازات الدفيئة. وحذر الأمين العام للأمم المتحدة من أن العالم يواجه 'نقطة اللاعودة' إذا لم يتم التحرك الآن.",
      imageUrl: "https://placehold.co/600x400",
      imageHint: "earth protest",
      category: "عالمي",
      publishedAt: "2024-05-17T22:00:00Z",
      views: 6543,
      isUrgent: true,
  },
  {
      id: 8,
      title: "مهرجان سينمائي دولي يكرم المخرج الأسطوري مارتن سكورسيزي",
      content: "شهد مهرجان كان السينمائي تكريمًا خاصًا للمخرج الأمريكي مارتن سكورسيزي تقديرًا لمسيرته الفنية الحافلة. وعرض المهرجان مجموعة من أفلامه الكلاسيكية التي لا تزال تلهم أجيالاً من صناع الأفلام.",
      imageUrl: "https://placehold.co/600x400",
      imageHint: "film festival",
      category: "فن وثقافة",
      publishedAt: "2024-05-16T19:00:00Z",
      views: 4321,
      isUrgent: false,
  }
];

// Helper function to store data in localStorage on the client-side
function storeNewsInLocalStorage(articles: Article[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('news_data', JSON.stringify(articles));
  }
}

export async function getNews(): Promise<Article[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  const sortedNews = newsData.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  // This function is called on the server, so we can't directly call localStorage here.
  // Instead, we will fetch and store on the client side.
  // We'll add a client component that fetches and stores the data.
  // For now, let's just make sure the local storage logic is available.
  if (typeof window !== 'undefined') {
    storeNewsInLocalStorage(sortedNews);
  }

  return sortedNews;
}
