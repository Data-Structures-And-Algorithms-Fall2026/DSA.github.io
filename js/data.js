/* Data for the DS course site. */

const CLASS_ROADMAP = [
  { n: 1,  art: 'algo',        color: 0, title: 'مقدمات — شروع الگوریتم‌ها', sub: ['ورودی و خروجی و درستی الگوریتم', 'پس‌کد', 'تفاوت الگوریتم و برنامه'] },
  { n: 2,  art: 'recursion',   color: 1, title: 'توابع بازگشتی و بک‌ترکینگ' },
  { n: 3,  art: 'asymptotics', color: 2, title: 'ارزیابی الگوریتم‌ها', sub: ['پیچیدگی زمان و فضا', 'بهترین، بدترین و حالت متوسط'] },
  { n: 4,  art: 'asymptotics', color: 3, title: 'علامت‌گذاری مجانبی' },
  { n: 5,  art: 'algo',        color: 4, title: 'روش‌های حل مسئله' },
  { n: 6,  art: 'master',      color: 5, title: 'قضیه Master و تحلیل آمورتایز' },
  { n: 7,  art: 'adt',         color: 6, title: 'تعریف ADT', sub: ['آشنایی با ADT ساده لیست', 'نمایش چندجمله‌ای‌ها با لیست'] },
  { n: 8,  art: 'matrix',      color: 0, title: 'ماتریس‌های اسپارس' },
  { n: 9,  art: 'stackqueue',  color: 1, title: 'صف و صف حلقوی' },
  { n: 10, art: 'stackqueue',  color: 2, title: 'پشته و دک' },
  { n: 11, art: 'kmp',         color: 3, title: 'رشته و الگوریتم KMP' },
  { n: 12, art: 'linkedlist',  color: 4, title: 'لیست‌های پیوندی', sub: ['تک‌پیوندی و حلقوی', 'لیست‌های دوگانه (دوطرفه)'] },
  { n: 13, art: 'skiplist',    color: 5, title: 'اسکیپ لیست' },
  { n: 14, art: 'skiplist',    color: 6, title: 'اسکیپ لیست — ادامه و تمرینات پیشرفته' },
  { n: 15, art: 'tree',        color: 0, title: 'درخت‌ها', sub: ['نمایش‌های اولیه درخت', 'پیمایش درخت‌ها'] },
  { n: 16, art: 'heap',        color: 1, title: 'هیپ‌ها' },
  { n: 17, art: 'heap',        color: 2, title: 'هیپ‌ها — ادامه' },
  { n: 18, art: 'bst',         color: 3, title: 'درخت‌های جستجوی دودویی' },
  { n: 19, art: 'avl',         color: 4, title: 'درخت AVL' },
  { n: 20, art: 'rbtree',      color: 5, title: 'درخت رد-بلک' },
  { n: 21, art: 'huffman',     color: 6, title: 'تریپ و ترای — کدگذاری هافمن' },
  { n: 22, art: 'graph',       color: 0, title: 'گراف‌ها — نمایش و پیمایش' },
  { n: 23, art: 'graph',       color: 1, title: 'جستجو در گراف', sub: ['مؤلفه‌های هم‌بندی در گراف'] },
  { n: 24, art: 'spanning',    color: 2, title: 'درخت‌های پوشا' },
  { n: 25, art: 'shortest',    color: 3, title: 'کوتاه‌ترین مسیر' },
  { n: 26, art: 'dsu',         color: 4, title: 'دیسجوینت‌ها' },
  { n: 27, art: 'hashing',     color: 5, title: 'مبانی هش و جدول هش', sub: ['برخورد (کلیژن) و Chaining'] },
  { n: 28, art: 'openaddr',    color: 6, title: 'آدرس‌دهی باز (Open Addressing)', sub: ['Linear · Quadratic · Double', 'Robin Hood · Cuckoo'] },
  { n: 29, art: 'crypto',      color: 0, title: 'هش برای رمزنگاری', sub: ['MD5 · SHA-1 · SHA-2 · SHA-256'] },
  { n: 30, art: 'crypto',      color: 1, title: 'هش پسورد و فیلترهای احتمال‌دار', sub: ['پسورد هش‌ینگ', 'بلوم فیلتر و کوکو فیلتر', 'امضای دیجیتال'] },
];

const WORKSHOPS = [
  { n: 1,  color: 0, title: 'معرفی و آماده‌سازی', art: 'algo',
    sessions: ['معرفی تیم، کلاس‌های کارگاه و تمرین‌ها', 'مسیر انتقال از جاوا به C++ و گیتهاب', 'نقشه راه ترم'], link: 'https://quera.org/course/assignments/107017/problems' },
  { n: 2,  color: 1, title: 'مقدمات و پایه‌های الگوریتم', art: 'recursion',
    sessions: ['شروع الگوریتم‌ها، ورودی و خروجی و درستی الگوریتم', 'پس‌کد و تفاوت الگوریتم و برنامه', 'توابع بازگشتی و بک‌ترکینگ'], link: 'https://quera.org/course/assignments/107018/problems' },
  { n: 3,  color: 2, title: 'تحلیل الگوریتم', art: 'asymptotics',
    sessions: ['ارزیابی الگوریتم‌ها و پیچیدگی زمان و فضا', 'بهترین، بدترین و حالت متوسط', 'علامت‌گذاری مجانبی', 'روش‌های حل مسئله', 'قضیه Master و آنالیز آمورتایز'], link: 'https://quera.org/course/assignments/107019/problems' },
  { n: 4,  color: 3, title: 'ADT و ماتریس اسپارس', art: 'adt',
    sessions: ['تعریف ADT و آشنایی با ADT ساده لیست', 'نمایش چندجمله‌ای‌ها با لیست', 'ماتریس‌های اسپارس'], link: 'https://quera.org/course/assignments/107020/problems' },
  { n: 5,  color: 4, title: 'ساختارهای خطی پایه', art: 'stackqueue',
    sessions: ['صف و صف حلقوی', 'پشته و دک'], link: 'https://quera.org/course/assignments/107021/problems' },
  { n: 6,  color: 5, title: 'رشته و لیست‌های پیوندی', art: 'linkedlist',
    sessions: ['رشته و الگوریتم KMP', 'لیست‌های تک‌پیوندی و حلقوی', 'لیست‌های دوگانه'], link: 'https://quera.org/course/assignments/107022/problems' },
  { n: 7,  color: 6, title: 'اسکیپ لیست', art: 'skiplist',
    sessions: ['ساختار و منطق اسکیپ لیست', 'ادامه و تمرینات پیشرفته'], link: 'https://quera.org/course/assignments/107023/problems' },
  { n: 8,  color: 0, title: 'درخت‌ها', art: 'tree',
    sessions: ['مفهوم درخت و نمایش‌های اولیه', 'روش‌های پیمایش درخت‌ها'], link: 'https://quera.org/course/assignments/107024/problems' },
  { n: 9,  color: 1, title: 'هیپ', art: 'heap',
    sessions: ['ساختار و خواص هیپ', 'حالت‌های عملیاتی و ترتیب‌دهی با هیپ'], link: 'https://quera.org/course/assignments/107025/problems' },
  { n: 10, color: 2, title: 'درخت‌های جستجوی دودویی', art: 'bst',
    sessions: ['درخت‌های جستجوی دودویی', 'درخت AVL و تعادل'], link: 'https://quera.org/course/assignments/107026/problems' },
  { n: 11, color: 3, title: 'درخت‌های پیشرفته', art: 'rbtree',
    sessions: ['درخت رد-بلک', 'تریپ و ترای', 'کدگذاری هافمن'], link: 'https://quera.org/course/assignments/107027/problems' },
  { n: 12, color: 4, title: 'گراف‌ها — بخش اول', art: 'graph',
    sessions: ['نمایش و پیمایش گراف', 'جستجو در گراف و مؤلفه‌های هم‌بندی'], link: 'https://quera.org/course/assignments/107028/problems' },
  { n: 13, color: 5, title: 'گراف‌ها — بخش دوم', art: 'spanning',
    sessions: ['درخت‌های پوشا', 'مسائل کوتاه‌ترین مسیر', 'ساختار دیسجوینت‌ها'], link: 'https://quera.org/course/assignments/107029/problems' },
  { n: 14, color: 6, title: 'هشینگ', art: 'hashing',
    sessions: ['مبانی هش، جدول هش و برخورد', 'Chaining و آدرس‌دهی باز (خطی، درجه دو، دوگانه، روبین‌هود، کوکو)'], link: 'https://quera.org/course/assignments/107030/problems' },
];

const EXERCISES = [
  { n: 1, link: 'https://quera.org/course/assignments/107031/problems' },
  { n: 2, link: 'https://quera.org/course/assignments/107032/problems' },
  { n: 3, link: 'https://quera.org/course/assignments/107033/problems' },
  { n: 4, link: 'https://quera.org/course/assignments/107034/problems' },
  { n: 5, link: 'https://quera.org/course/assignments/107035/problems' },
  { n: 6, link: 'https://quera.org/course/assignments/107036/problems' },
];

const PROFESSOR = {
  name: 'دکتر زهرا قربانعلی',
  role: 'استاد دوره',
  email: 'zahra.ghorbanali@gmail.com',
};

const TUTORS = [
  { name: 'سید حمید حسینی', email: 'iamhamidhosseini@gmail.com' },
  { name: 'علی جعفری',       email: 'ali.jafari.2114@gmail.com' },
  { name: 'سید حسن علوی',    email: 'hassan.alavi.ha@gmail.com' },
  { name: 'شروین رجبی',      email: 'ShervinRajabi2016@gmail.com' },
];

const LINKS = {
  course: 'https://quera.org/course/29036',
  telegram: 'https://t.me/+jim1kxHwToMwMDFk',
  special: 'https://github.com/Sec-Lab-SH/LogSentinel',
};
