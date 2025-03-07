import {
  FaEye,
  FaTooth,
  FaBone,
  FaHeartbeat,
  FaLeaf,
  FaBrain,
  FaRunning,
  FaSmile,
} from "react-icons/fa";

export const navbarlinks = [
  {
    title_ar: "الرئيسية",
    title_en: "Home",
    to: "/",
  },
  {
    title_ar: "عن المنصة",
    title_en: "About",
    to: "/about",
  },
  {
    title_ar: "المراكز",
    title_en: "organizations",
    to: "/organizations",
  },
  {
    title_ar: "خدمات التابعة لآرام",
    title_en: "Affiliate Aram Services",
    to: "/affiliateservices",
  },
  {
    title_ar: "البطاقات",
    title_en: "Cards",
    to: "/cards",
  },
  {
    title_ar: "المدونة",
    title_en: "Blog",
    to: "/blog",
  },
  {
    title_ar: "الكوبونات والعروض",
    title_en: "Coupons&offers",
    to: "/couponsoffers",
  },
];

export const currencies = [
  { code: "OMR", name: "ريال عماني", flag: "OM", symbol: "﷼" },
  { code: "USD", name: "دولار أمريكي", flag: "US", symbol: "$" },
  { code: "SAR", name: "ريال سعودي", flag: "SA", symbol: "﷼" },
  { code: "AED", name: "درهم إماراتي", flag: "AE", symbol: "د.إ" },
  { code: "BHD", name: "ريال بحريني", flag: "BH", symbol: "د.ب" },
  { code: "KWD", name: "دينار كويتي", flag: "KW", symbol: "د.ك" },
  { code: "QAR", name: "ريال قطري", flag: "QA", symbol: "﷼" },
];

export const services = [
  {
    title: { en: "Eye Care", ar: "العناية بالعيون" },
    description: {
      en: "Comprehensive eye exams and treatments for all ages.",
      ar: "فحوصات شاملة للعيون وعلاجات لجميع الأعمار.",
    },
    image: "/services/service_1.jpg",
    icon: <FaEye className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Dental Care", ar: "العناية بالأسنان" },
    description: {
      en: "Professional dental cleaning, braces, and more.",
      ar: "تنظيف الأسنان الاحترافي، تقويم الأسنان والمزيد.",
    },
    image: "/services/service_2.jpg",
    icon: <FaTooth className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Back Pain Relief", ar: "تخفيف آلام الظهر" },
    description: {
      en: "Effective solutions for chronic and acute back pain.",
      ar: "حلول فعالة لآلام الظهر المزمنة والحادة.",
    },
    image: "/services/service_3.jpg",
    icon: <FaBone className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Skin Care", ar: "العناية بالبشرة" },
    description: {
      en: "Advanced treatments for glowing and healthy skin.",
      ar: "علاجات متقدمة لبشرة مشرقة وصحية.",
    },
    image: "/services/service_4.jpg",
    icon: <FaSmile className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Nutrition Advice", ar: "نصائح التغذية" },
    description: {
      en: "Personalized diet plans for a healthier lifestyle.",
      ar: "خطط غذائية مخصصة لنمط حياة أكثر صحة.",
    },
    image: "/services/service_5.jpg",
    icon: <FaLeaf className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Mental Health", ar: "الصحة النفسية" },
    description: {
      en: "Support and therapy for mental well-being.",
      ar: "دعم وعلاج للصحة النفسية.",
    },
    image: "/services/service_6.jpg",
    icon: <FaBrain className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Physical Therapy", ar: "العلاج الطبيعي" },
    description: {
      en: "Rehabilitation and exercises for improved mobility.",
      ar: "إعادة تأهيل وتمارين لتحسين الحركة.",
    },
    image: "/services/service_3.jpg",
    icon: <FaRunning className="w-6 h-6 text-main_orange" />,
  },
  {
    title: { en: "Heart Care", ar: "العناية بالقلب" },
    description: {
      en: "Comprehensive cardiac health check-ups and care.",
      ar: "فحوصات شاملة لصحة القلب والعناية به.",
    },
    image: "/services/service_2.jpg",
    icon: <FaHeartbeat className="w-6 h-6 text-main_orange" />,
  },
];

export const organizations = [
  {
    id: 1,
    name: "Eye Care Foundation",
    address: "Riyadh, King Fahd Road, Saudi Arabia",
    department: "العناية بالعيون / Eye Care",
    description: {
      en: "Providing specialized eye treatments and surgeries.",
      ar: "توفير علاجات وعمليات جراحية متخصصة للعيون.",
    },
    image: "/services/service_1.jpg",
    rightOrleft: true,
  },
  {
    id: 2,
    name: "Dental Wellness Center",
    address: "Jeddah, Prince Sultan Street, Saudi Arabia",
    department: "العناية بالأسنان / Dental Care",
    description: {
      en: "Comprehensive dental services for all ages.",
      ar: "خدمات طب الأسنان الشاملة لجميع الأعمار.",
    },
    image: "/services/service_2.jpg",
    rightOrleft: false,
  },
  {
    id: 3,
    name: "Spine Health Clinic",
    address: "Khobar, King Khalid Road, Saudi Arabia",
    department: "صحة الظهر / Spine Health",
    description: {
      en: "Effective solutions for back pain and spine issues.",
      ar: "حلول فعّالة لآلام الظهر ومشاكل العمود الفقري.",
    },
    image: "/services/service_3.jpg",
    rightOrleft: true,
  },
  {
    id: 4,
    name: "Heart Wellness Institute",
    address: "Dammam, Al Shati District, Saudi Arabia",
    department: "العناية بالقلب / Heart Care",
    description: {
      en: "Comprehensive cardiac care for a healthy heart.",
      ar: "رعاية قلبية شاملة لقلب صحي.",
    },
    image: "/services/service_4.jpg",
    rightOrleft: false,
  },
  {
    id: 5,
    name: "Wellness Dermatology Center",
    address: "Medina, Al Haram Road, Saudi Arabia",
    department: "الأمراض الجلدية / Dermatology",
    description: {
      en: "Expert care for skin health and treatments.",
      ar: "رعاية متخصصة لصحة الجلد والعلاجات.",
    },
    image: "/services/service_5.jpg",
    rightOrleft: true,
  },
  {
    id: 6,
    name: "Pediatric Care Hospital",
    address: "Riyadh, Al Olaya District, Saudi Arabia",
    department: "العناية بالأطفال / Pediatrics",
    description: {
      en: "Providing quality care for children and newborns.",
      ar: "توفير رعاية عالية الجودة للأطفال وحديثي الولادة.",
    },
    image: "/services/service_6.jpg",
    rightOrleft: false,
  },
  {
    id: 7,
    name: "Physiotherapy Center",
    address: "Abha, King Saud Road, Saudi Arabia",
    department: "العلاج الطبيعي / Physiotherapy",
    description: {
      en: "Personalized physical therapy for all ages.",
      ar: "علاج طبيعي مخصص لجميع الأعمار.",
    },
    image: "/services/service_4.jpg",
    rightOrleft: true,
  },
  {
    id: 8,
    name: "Nutrition and Wellness Center",
    address: "Mecca, Ibrahim Al Khalil Road, Saudi Arabia",
    department: "التغذية والصحة / Nutrition",
    description: {
      en: "Guidance for balanced nutrition and better health.",
      ar: "إرشادات للتغذية المتوازنة وصحة أفضل.",
    },
    image: "/services/service_2.jpg",
    rightOrleft: false,
  },
];

export const articles = [
  {
    image: "/services/service_1.jpg",
    avatar: "/logo.ico",
    author: "Gloria",
    date: "Jan 09, 2021",
    category: "Technology",
    title:
      "Facebook is creating a news section in Watch to feature breaking news",
    description: "Facebook launched the Watch platform in August",
  },
  {
    image: "/services/service_6.jpg",
    avatar: "/logo.ico",
    author: "Alex",
    date: "Feb 15, 2022",
    category: "SEO",
    title: "How to optimize your website for SEO in 2023",
    description:
      "Learn the best practices for modern search engine optimization.",
  },
  {
    image: "/services/service_5.jpg",
    avatar: "/logo.ico",
    author: "Gloria",
    date: "Jan 09, 2021",
    category: "Technology",
    title:
      "Facebook is creating a news section in Watch to feature breaking news",
    description: "Facebook launched the Watch platform in August",
  },
  {
    image: "/services/service_2.jpg",
    avatar: "/logo.ico",
    author: "Alex",
    date: "Feb 15, 2022",
    category: "SEO",
    title: "How to optimize your website for SEO in 2023",
    description:
      "Learn the best practices for modern search engine optimization.",
  },
  {
    image: "/services/service_1.jpg",
    avatar: "/logo.ico",
    author: "Gloria",
    date: "Jan 09, 2021",
    category: "Lifestyle",
    title:
      "Facebook is creating a news section in Watch to feature breaking news",
    description: "Facebook launched the Watch platform in August",
  },
  {
    image: "/services/service_2.jpg",
    avatar: "/logo.ico",
    author: "Alex",
    date: "Feb 15, 2022",
    category: "Lifestyle",
    title: "How to optimize your website for SEO in 2023",
    description:
      "Learn the best practices for modern search engine optimization.",
  },
  {
    image: "/services/service_3.jpg",
    avatar: "/logo.ico",
    author: "Gloria",
    date: "Jan 09, 2021",
    category: "Finance",
    title:
      "Facebook is creating a news section in Watch to feature breaking news",
    description: "Facebook launched the Watch platform in August",
  },
  {
    image: "/services/service_2.jpg",
    avatar: "/logo.ico",
    author: "Alex",
    date: "Feb 15, 2022",
    category: "Finance",
    title: "How to optimize your website for SEO in 2023",
    description:
      "Learn the best practices for modern search engine optimization.",
  },
  {
    image: "/services/service_4.jpg",
    avatar: "/logo.ico",
    author: "John",
    date: "Apr 10, 2023",
    category: "Health",
    title: "How to improve your mental health with simple daily habits",
    description: "Simple strategies to maintain mental well-being.",
  },
  {
    image: "/services/service_5.jpg",
    avatar: "/logo.ico",
    author: "Sarah",
    date: "May 18, 2023",
    category: "Health",
    title: "Top 10 Foods to Boost Your Immune System",
    description: "Eating for a healthier immune system.",
  },
];

// كائن النصوص الثابتة لكل لغة
export const Updatetexts: any = {
  EN: {
    editService: "Edit Service",
    titleAr: "Title in Arabic",
    titleEn: "Title in English",
    descriptionAr: "Description in Arabic",
    descriptionEn: "Description in English",
    serviceImage: "Service Image",
    discountPercent: "Discount",
    chooseImage: "Choose Image",
    removeImage: "Remove Image",
    confirmationPrice: "Confirmation Price",
    confirmationStatus: "Confirmation Price Status",
    chooseStatus: "Choose Status",
    active: "Active",
    inactive: "Inactive",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    featuresAr: "Features in Arabic",
    featuresEn: "Features in English",
    addFeature: "Add Feature",
    featurePlaceholder: "Enter a new feature",
    selectCategory: "Select Category",
  },
  AR: {
    editService: "تعديل خدمة",
    titleAr: "العنوان بالعربية",
    titleEn: "العنوان بالإنجليزية",
    descriptionAr: "الوصف بالعربية",
    discountPercent: "نسبة الخصم",
    descriptionEn: "الوصف بالإنجليزية",
    serviceImage: "صورة الخدمة",
    chooseImage: "اختر صورة",
    removeImage: "إزالة الصورة",
    confirmationPrice: "سعر التأكيد",
    confirmationStatus: "حالة التأكيد",
    chooseStatus: "اختر الحالة",
    active: "مفعل",
    inactive: "غير مفعل",
    cancel: "إلغاء",
    saveChanges: "حفظ التغييرات",
    featuresAr: "المميزات بالعربية",
    featuresEn: "المميزات بالإنجليزية",
    addFeature: "إضافة ميزة",
    featurePlaceholder: "أدخل ميزة جديدة",
    selectCategory: "القسم الخاص بالخدمة",
  },
};
