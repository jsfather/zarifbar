import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Estimator from './components/Estimator';
import ServiceLanding from './components/ServiceLanding';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import AdminPanel from './components/AdminPanel';
import AreasView from './components/AreasView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import TermsView from './components/TermsView';
import { Settings, Service, Post } from './types';
import { 
  Truck, ShieldCheck, Clock, Award, CheckCircle2, Star, 
  MapPin, HelpCircle, ArrowLeft, ArrowUpRight, ShieldAlert,
  Package, Users, Warehouse, MessagesSquare, Check, ArrowUp, Phone, MessageCircle
} from 'lucide-react';

export default function App() {
  // Client routing state based on pathname or custom navigation stack
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load state for settings
  const [settings, setSettings] = useState<Settings>({
    site_title: 'اسپاب‌چی | باربری، اسباب‌کشی، وانت و نیسان در تهران',
    site_description: 'اسپاب‌چی خدمات حمل اثاثیه، بسته‌بندی، اعزام نیروی جابجایی، وانت بار و نیسان بار را در تهران ارائه می‌دهد.',
    phone: '02144177827',
    phone_alt: '02126117092',
    email: '',
    address: '',
    seo_keywords: 'اسباب‌کشی، اسپاب‌چی، اتوبار تهران، وانت بار، نیسان بار',
    working_hours: '۷ روز هفته، ۲۴ ساعته در خدمت شما هستیم',
    pricing_base_truck: '1800000',
    pricing_per_worker: '450000',
    pricing_pack_service: '1200000'
  });

  const [services, setServices] = useState<Service[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [activePostSlug, setActivePostSlug] = useState<string>('');
  const [pages, setPages] = useState<Record<string, any>>({});

  // Toast confirmation
  const [toastMessage, setToastMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch settings & services dynamic data
  useEffect(() => {
    Promise.all([
      fetch('/api/settings', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/services', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/posts', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/pages/home', { cache: 'no-store' }).then(res => res.json()).catch(() => ({})),
      fetch('/api/pages/about', { cache: 'no-store' }).then(res => res.json()).catch(() => ({})),
      fetch('/api/pages/contact', { cache: 'no-store' }).then(res => res.json()).catch(() => ({})),
      fetch('/api/pages/privacy', { cache: 'no-store' }).then(res => res.json()).catch(() => ({})),
      fetch('/api/pages/terms', { cache: 'no-store' }).then(res => res.json()).catch(() => ({}))
    ])
      .then(([settingsData, servicesData, postsData, homePage, aboutPage, contactPage, privacyPage, termsPage]) => {
        if (!settingsData.error) setSettings(settingsData);
        if (!servicesData.error) setServices(servicesData);
        if (!postsData.error) {
          setRecentPosts(postsData.filter((p: any) => p.status === 'published').slice(0, 3));
        }

        const pagesObj: Record<string, any> = {};
        if (homePage && homePage.slug) pagesObj.home = homePage;
        if (aboutPage && aboutPage.slug) pagesObj.about = aboutPage;
        if (contactPage && contactPage.slug) pagesObj.contact = contactPage;
        if (privacyPage && privacyPage.slug) pagesObj.privacy = privacyPage;
        if (termsPage && termsPage.slug) pagesObj.terms = termsPage;
        setPages(pagesObj);
      })
      .catch((err) => console.error('Error fetching initial dynamic modules:', err));
  }, []);

  // Update real titles from database
  useEffect(() => {
    document.title = settings.site_title;
  }, [settings.site_title]);

  // PushState synchronizer for path routing
  const navigate = (newPath: string) => {
    window.history.pushState(null, '', newPath);
    setPath(newPath);
    // Clear sub-page arguments when navigating back
    if (!newPath.startsWith('/blog')) {
      setActivePostSlug('');
    }
    window.scrollTo(0, 0);
  };

  // Sync client going page state with browser history actions (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const getHomeContent = () => {
    let parsed: any = {};
    if (pages.home && pages.home.content_json) {
      try {
        parsed = JSON.parse(pages.home.content_json);
      } catch (e) {
        parsed = {};
      }
    }
    return {
      badge: parsed.badge || "خدمات اسباب‌کشی و حمل بار در تهران",
      title: parsed.title || "اسباب‌کشی آسان و بی‌دردسر",
      blue_title: parsed.blue_title || "بی‌دردسر",
      description: parsed.description || "اسپاب‌چی خدمات حمل اثاثیه، بسته‌بندی، اعزام نیروی جابجایی، وانت بار و نیسان بار را در تهران ارائه می‌دهد. هزینه خدمات با توجه به مسیر، نوع خودرو، تعداد نیرو و خدمات موردنیاز محاسبه می‌شود.",
      quick_alert: parsed.quick_alert || "برای دریافت برآورد اولیه هزینه اسباب‌کشی، فرم محاسبه را تکمیل کنید.",
      video_url: parsed.video_url || "",
      hero_image: parsed.hero_image || "",
      stat_1_num: parsed.stat_1_num || "",
      stat_1_lbl: parsed.stat_1_lbl || "بسته‌بندی تخصصی",
      stat_2_num: parsed.stat_2_num || "",
      stat_2_lbl: parsed.stat_2_lbl || "وانت و نیسان بار",
      stat_3_num: parsed.stat_3_num || "",
      stat_3_lbl: parsed.stat_3_lbl || "اعزام نیروی جابجایی",
      stat_4_num: parsed.stat_4_num || "",
      stat_4_lbl: parsed.stat_4_lbl || "خدمات در تهران"
    };
  };

  const getAboutContent = () => {
    let parsed: any = {};
    if (pages.about && pages.about.content_json) {
      try {
        parsed = JSON.parse(pages.about.content_json);
      } catch (e) {
        parsed = {};
      }
    }
    return {
      // Basic
      title: pages.about?.title || 'درباره اسپاب‌چی',
      image_url: pages.about?.image_url || '',
      subtitle: parsed.subtitle || 'خدمات حمل‌ونقل و اسباب‌کشی در تهران',
      heading: parsed.heading || 'اسپاب‌چی چه خدماتی ارائه می‌دهد؟',
      paragraph_1: parsed.paragraph_1 || 'اسپاب‌چی یک مجموعه خدمات حمل‌ونقل و اسباب‌کشی در تهران است که خدماتی مانند حمل اثاثیه منزل، بسته‌بندی، اعزام نیروی حمل، وانت بار و نیسان بار را ارائه می‌دهد. هدف مجموعه این است که مشتری پیش از ثبت نهایی سفارش، اطلاعات روشنی درباره نوع خدمت، عوامل مؤثر بر هزینه و نحوه اعزام دریافت کند.',
      paragraph_2: parsed.paragraph_2 || 'هزینه نهایی اسباب‌کشی بسته به عوامل مختلفی از جمله مسیر، نوع خودرو، تعداد نیروی کار، طبقه، وجود آسانسور، نوع و حجم اثاثیه و سرویس‌های اضافه تعیین می‌شود. مشتریان پس از ارائه اطلاعات سفارش، برآورد اولیه هزینه را دریافت کرده و قبل از شروع کار، قیمت نهایی تأیید می‌شود.',
      video_url: parsed.video_url || '',
      // Section 2 – Services
      services_section_title: parsed.services_section_title || 'خدماتی که اسپاب‌چی ارائه می‌دهد',
      service_1_title: parsed.service_1_title || 'حمل اثاثیه منزل',
      service_1_desc: parsed.service_1_desc || 'جابجایی کامل وسایل منزل با کامیونت، خاور یا وانت متناسب با حجم بار.',
      service_2_title: parsed.service_2_title || 'بسته‌بندی اثاثیه',
      service_2_desc: parsed.service_2_desc || 'بسته‌بندی با کارتن، پتو، نایلون حبابی و متریال محافظ برای کاهش آسیب در حمل.',
      service_3_title: parsed.service_3_title || 'کارگر خالی اسباب‌کشی',
      service_3_desc: parsed.service_3_desc || 'اعزام نیروی جابجایی برای تخلیه، بارگیری یا چیدمان بدون نیاز به خودرو.',
      service_4_title: parsed.service_4_title || 'اجاره انبار',
      service_4_desc: parsed.service_4_desc || 'انبارهای مسقف و روباز برای نگهداری موقت اثاثیه، جهیزیه یا کالاهای تجاری.',
      // Section 3 – Process
      process_section_title: parsed.process_section_title || 'نحوه ثبت و انجام سفارش',
      step_1_title: parsed.step_1_title || 'تماس یا پر کردن فرم',
      step_1_desc: parsed.step_1_desc || 'با شماره‌های اسپاب‌چی تماس بگیرید یا از فرم محاسبه آنلاین استفاده کنید.',
      step_2_title: parsed.step_2_title || 'بررسی و برآورد اولیه',
      step_2_desc: parsed.step_2_desc || 'کارشناس اطلاعات مسیر، حجم بار، طبقه و سرویس‌های مورد نیاز را دریافت می‌کند و برآورد اولیه هزینه را اعلام می‌کند.',
      step_3_title: parsed.step_3_title || 'هماهنگی زمان اعزام',
      step_3_desc: parsed.step_3_desc || 'زمان مناسب برای حضور تیم در محل مبدا هماهنگ می‌شود.',
      step_4_title: parsed.step_4_title || 'اجرا و تحویل',
      step_4_desc: parsed.step_4_desc || 'تیم اجرایی در محل حاضر می‌شود، قیمت نهایی تأیید می‌شود و کار شروع می‌گردد.',
      // Section 4 – Pricing factors
      pricing_section_title: parsed.pricing_section_title || 'عوامل مؤثر بر هزینه اسباب‌کشی',
      pricing_section_desc: parsed.pricing_section_desc || 'هزینه نهایی پیش از شروع کار و با توافق طرفین تأیید می‌شود.',
      pricing_factor_1: parsed.pricing_factor_1 || 'مسافت مبدا تا مقصد',
      pricing_factor_2: parsed.pricing_factor_2 || 'نوع و تعداد خودرو',
      pricing_factor_3: parsed.pricing_factor_3 || 'تعداد نیروی کار',
      pricing_factor_4: parsed.pricing_factor_4 || 'طبقه و وجود آسانسور',
      pricing_factor_5: parsed.pricing_factor_5 || 'حجم و نوع اثاثیه',
      pricing_factor_6: parsed.pricing_factor_6 || 'سرویس‌های جانبی (بسته‌بندی، انبار)',
      // Section 5 – Areas
      areas_section_title: parsed.areas_section_title || 'محدوده خدمات در تهران',
      area_1_zone: parsed.area_1_zone || 'شمال تهران',
      area_1_areas: parsed.area_1_areas || 'نیاوران، الهیه، اقدسیه، تجریش، پاسداران، زعفرانیه، قیطریه، فرمانیه، کامرانیه، ولنجک',
      area_2_zone: parsed.area_2_zone || 'مرکز تهران',
      area_2_areas: parsed.area_2_areas || 'ملاصدرا، یوسف‌آباد، مطهری، امیرآباد، گاندی، آرژانتین، شریعتی، جردن، ونک',
      area_3_zone: parsed.area_3_zone || 'غرب تهران',
      area_3_areas: parsed.area_3_areas || 'سعادت‌آباد، شهرک غرب، پونک، جنت‌آباد، مرزداران، شهران، گیشا، ستارخان، صادقیه',
      area_4_zone: parsed.area_4_zone || 'شرق و جنوب تهران',
      area_4_areas: parsed.area_4_areas || 'تهرانپارس، نارمک، پیروزی، نواب، منیریه و سایر مناطق شهر تهران',
      // Section 6 – Transparency
      transparency_section_title: parsed.transparency_section_title || 'چرا مشتری پیش از شروع کار اطلاعات شفافی دریافت می‌کند؟',
      transparency_1_title: parsed.transparency_1_title || 'جلوگیری از اختلاف در روز اسباب‌کشی',
      transparency_1_desc: parsed.transparency_1_desc || 'وقتی قیمت و شرایط از قبل روشن باشد، در روز اجرا هیچ ابهامی وجود ندارد و کار سریع‌تر پیش می‌رود.',
      transparency_2_title: parsed.transparency_2_title || 'امکان مقایسه و تصمیم‌گیری آگاهانه',
      transparency_2_desc: parsed.transparency_2_desc || 'مشتری می‌تواند با برآورد اولیه، گزینه‌های مختلف را بسنجد و بر اساس نیاز واقعی خود تصمیم بگیرد.',
      transparency_3_title: parsed.transparency_3_title || 'عدم دریافت هزینه‌های پنهان',
      transparency_3_desc: parsed.transparency_3_desc || 'تمام آیتم‌های هزینه‌ساز (طبقه، آسانسور، بسته‌بندی) از ابتدا در برآورد لحاظ می‌شوند.',
      // Section 7 – CTA
      cta_title: parsed.cta_title || 'برای استعلام قیمت یا ثبت سفارش تماس بگیرید',
      cta_desc: parsed.cta_desc || 'کارشناسان اسپاب‌چی در تمام ساعات شبانه‌روز آماده پاسخگویی و هماهنگی هستند.',
      cta_btn_call: parsed.cta_btn_call || 'تماس',
      cta_btn_calc: parsed.cta_btn_calc || 'محاسبه آنلاین قیمت',
    };
  };

  const getContactContent = () => {
    let parsed: any = {};
    if (pages.contact && pages.contact.content_json) {
      try {
        parsed = JSON.parse(pages.contact.content_json);
      } catch (e) {
        parsed = {};
      }
    }
    return {
      title: pages.contact?.title || 'تماس با اسپاب‌چی',
      subtitle: parsed.subtitle || 'با اسپاب‌چی تماس بگیرید. آماده پاسخگویی هستیم.'
    };
  };

  const getPrivacyContent = () => {
    let parsed: any = {};
    if (pages.privacy && pages.privacy.content_json) {
      try {
        parsed = JSON.parse(pages.privacy.content_json);
      } catch (e) {
        parsed = {};
      }
    }
    return {
      title: pages.privacy?.title || "قوانین، شرایط خدمات و حریم خصوصی | اسپاب‌چی",
      subtitle: parsed.subtitle || "آخرین بروزرسانی: شهریور ماه ۱۴۰۴",
      intro: parsed.intro || "کاربر گرامی، ورود به وب‌سایت اسپاب‌چی و استفاده از خدمات مشاوره، محاسبه‌گر هوشمند آنلاین، و رزرو نوبت تلفنی یا اینترنتی به معنای آگاهی کامل و پذیرش بی قید و شرط قوانین درج شده در این صفحه می‌باشد. هدف ما آسودگی خاطر کامل شما در طول اسباب‌کشی و حفظ امانت به مطمئن‌ترین شکل ممکن است.",
      rules_heading: parsed.rules_heading || "قوانین عمومی حمل‌ونقل و صدور فاکتور",
      rule_1: parsed.rule_1 || "قیمت‌های نهایی صادر شده: مبالغی که کارشناسان پشتیبانی پس از ثبت استعلام محاسبه‌گر هوشمند به صورت فاکتور کتبی یا پیامکی تایید می‌کنند، قطعی بوده و رانندگان به هیچ عنوان مجاز به دریافت مبالغ اضافه تحت عناوین انعام، سختی راه پله، پیاده‌روی طولانی نخواهند بود مگر با هماهنگی مدیریت.",
      rule_2: parsed.rule_2 || "لغو نوبت رزرو شده: مشتریان محترم در صورت نیاز به تغییر زمان اسباب‌کشی یا لغو نوبت، موظف هستند حداقل ۲۴ ساعت قبل از اعزام کادر جابجایی موضوع را به کارشناسان اسپاب چی اطلاع دهند.",
      rule_3: parsed.rule_3 || "کالاهای گران‌قیمت خاص: جابجایی اقلام بسیار گران‌قیمت اعم از وجوه نقد، جواهرات، اسناد ملکی گاوصندوق، لپ‌تاپ‌های شخصی و طلاجات باید توسط خود کارفرما انجام گیرد. کادر فنی به هیچ عنوان مسئولیت انتقال موارد شخصی درون کیف‌های مسافرتی را برعهده نمی‌گیرد.",
      insurance_heading: parsed.insurance_heading || "بیمه نامه و تضمین خسارت",
      insurance_text: parsed.insurance_text || "تمامی اثاثیه‌های حمل شده توسط ناوگان کامیونت‌های مسقف اسپاب چی، تحت پوشش بیمه تا سقف مشخص شده در فاکتور قرار می‌گیرند. در صورت بروز هرگونه آسیب به وسایلی که بسته‌بندی آنها توسط تیم حرفه‌ای و با تایید ناظر کادر اسپاب چی انجام شده باشد، شرکت موظف به پرداخت غرامت معادل قیمت روز کالا یا تعمیر تخصصی آن خواهد بود.",
      privacy_heading: parsed.privacy_heading || "سیاست حفظ حریم خصوصی کاربران",
      privacy_text: parsed.privacy_text || "مجموعه اسپاب چی نسبت به حفظ اطلاعات خصوصی مشتریان خود (مانند نام خانوادگی، شماره‌های همراه، آدرس‌های مبدا و مقصد) کاملاً متعهد است. تمامی اطلاعات وارد شده در وب‌سایت اسپاب چی در سرورهای امن نگهداری شده و فقط برای فرآیند اعزام خودرو، صدور بیمه نامه حمل بار و بهبود کیفیت خدمات مورد استفاده قرار می‌گیرند. ما هرگز داده‌های شما را در اختیار اشخاص ثالثِ تبلیغاتی قرار نخواههم داد.",
      box_alert: parsed.box_alert || "در صورت بروز هرگونه تعارض نامتعارف با پرسنل صحنه جابجایی قبل از هرگونه پرداخت وجه با شماره بازرسی مرکزی اسپاب چی تماس حاصل فرمایید تا کارشناس شعبه فوراً مداخله کند.",
      // SEO
      seo_title: pages.privacy?.seo_title || '',
      seo_description: pages.privacy?.seo_description || '',
      seo_keywords: parsed.seo_keywords || '',
      canonical_url: parsed.canonical_url || '',
      robots: parsed.robots || 'index, follow',
    };
  };

  const getTermsContent = () => {
    let parsed: any = {};
    if (pages.terms && pages.terms.content_json) {
      try {
        parsed = JSON.parse(pages.terms.content_json);
      } catch (e) {
        parsed = {};
      }
    }
    return {
      title: pages.terms?.title || "شرایط و ضوابط استفاده از خدمات اسپاب‌چی",
      subtitle: parsed.subtitle || "لطفاً پیش از استفاده از خدمات این صفحه را مطالعه کنید.",
      intro: parsed.intro || "با استفاده از خدمات اسپاب‌چی، کاربر گرامی تأیید می‌کند که شرایط و ضوابط زیر را خوانده، درک کرده و با آن‌ها موافق است. این شرایط بر رابطه میان مشتری و مجموعه اسپاب‌چی حاکم است.",
      section_1_heading: parsed.section_1_heading || "تعریف خدمات",
      section_1_text: parsed.section_1_text || "اسپاب‌چی ارائه‌دهنده خدمات حمل اثاثیه، بسته‌بندی، اعزام نیروی جابجایی، وانت بار، نیسان بار و اجاره انبار در تهران است. کلیه خدمات پس از تأیید سفارش و اعلام قیمت نهایی به مشتری آغاز می‌شود.",
      section_2_heading: parsed.section_2_heading || "پرداخت و هزینه‌ها",
      section_2_text: parsed.section_2_text || "قیمت‌گذاری بر اساس فاکتور کتبی یا پیامکی صادر شده توسط کارشناسان اسپاب‌چی انجام می‌گیرد. هیچ مبلغ اضافه‌ای خارج از فاکتور تأییدشده از مشتری دریافت نمی‌شود.",
      section_3_heading: parsed.section_3_heading || "مسئولیت‌ها و محدودیت‌ها",
      section_3_text: parsed.section_3_text || "اسپاب‌چی مسئولیت آسیب به اثاثیه‌ای که توسط تیم بسته‌بندی حرفه‌ای آماده شده را می‌پذیرد. مسئولیت اقلام گران‌قیمت، اسناد، وجوه نقد و جواهرات که توسط خود مشتری جابجا نشده، پذیرفته نمی‌شود.",
      section_4_heading: parsed.section_4_heading || "لغو و تغییر سفارش",
      section_4_text: parsed.section_4_text || "مشتری می‌تواند تا ۲۴ ساعت پیش از زمان اعزام، سفارش را بدون هزینه لغو یا تغییر دهد. لغو در کمتر از ۲۴ ساعت ممکن است مشمول هزینه انصراف گردد.",
      section_5_heading: parsed.section_5_heading || "حل اختلاف",
      section_5_text: parsed.section_5_text || "در صورت بروز هرگونه اختلاف، مشتری باید پیش از اقدام حقوقی با تیم پشتیبانی اسپاب‌چی تماس بگیرد. اسپاب‌چی متعهد است ظرف ۴۸ ساعت پاسخگو باشد.",
      box_alert: parsed.box_alert || "برای هرگونه سؤال یا اعتراض پیش از پرداخت وجه با پشتیبانی مرکزی اسپاب‌چی تماس بگیرید.",
      // SEO
      seo_title: pages.terms?.seo_title || '',
      seo_description: pages.terms?.seo_description || '',
      seo_keywords: parsed.seo_keywords || '',
      canonical_url: parsed.canonical_url || '',
      robots: parsed.robots || 'index, follow',
    };
  };

  // Pricing constants parsed
  const baseTruckNum = Number(settings.pricing_base_truck) || 1800000;
  const perWorkerNum = Number(settings.pricing_per_worker) || 450000;
  const packServiceNum = Number(settings.pricing_pack_service) || 1200000;

  // Render Homepage Main UI View
  const renderHome = () => {
    const homeContent = getHomeContent();
    return (
      <div className="animate-in fade-in duration-300" dir="rtl">
        
        {/* Banner Quick Alert Line */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs md:text-sm font-semibold py-3 px-4 text-center flex justify-center items-center gap-2">
          <Star className="w-4 h-4 fill-amber-300 text-amber-300 animate-spin" />
          <span>{homeContent.quick_alert}</span>
          <button 
            onClick={() => {
              const el = document.getElementById('price-calc-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="underline hover:text-amber-300 text-white font-bold cursor-pointer"
          >
            همین الان رزو کنید ⬅️
          </button>
        </div>

        {/* Content sections wrapper with tight, elegant spacing */}
        <div className="space-y-12 md:space-y-16 mt-5 md:mt-8">

          {/* HERO SECTION DESIGN WITH PREMIUM PERSPECTIVE */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-2 md:pt-4">
          
          <div className="lg:col-span-6 space-y-6 text-right">
            <span className="inline-flex items-center gap-2 bg-purple-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-extrabold text-xs px-4 py-2 rounded-full border border-blue-105 dark:border-blue-900/40 shadow-sm">
              <Award className="w-4 h-4" />
              {homeContent.badge}
            </span>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.2] tracking-tight">
              {homeContent.title} <br />
              <span className="text-purple-600">{homeContent.blue_title}</span>
            </h1>

            <p className="text-sm md:text-base text-gray-500 dark:text-slate-400 font-medium leading-relaxed text-justify max-w-xl">
              {homeContent.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById('price-calc-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-600 text-white font-extrabold rounded-2xl px-8 py-4 shadow-xl shadow-purple-500/20 hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                محاسبه آنلاین هزینه اسباب‌کشی
                <ArrowLeft className="w-4 h-4" />
              </button>

              <a 
                href={`tel:${settings.phone}`}
                className="border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 font-bold rounded-2xl px-6 py-4 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                تماس با خط ویژه سراسری: {settings.phone}
              </a>
            </div>

            {/* Micro indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-150 dark:border-slate-800 max-w-lg text-center">
              <div>
                <strong className="block text-xl font-black text-slate-800 dark:text-slate-100 font-sans">۲۴ ساعته</strong>
                <span className="text-[10px] text-gray-400 font-bold">پاسخگویی و اعزام</span>
              </div>
              <div className="border-r border-gray-150 dark:border-slate-805">
                <strong className="block text-xl font-black text-slate-800 dark:text-slate-105 font-sans">📦</strong>
                <span className="text-[10px] text-gray-400 font-bold">بسته‌بندی تخصصی</span>
              </div>
              <div className="border-r border-gray-150 dark:border-slate-805">
                <strong className="block text-xl font-black text-slate-800 dark:text-slate-105 font-sans">۱۵ دقیقه</strong>
                <span className="text-[10px] text-gray-400 font-bold">حداکثر زمان پاسخگویی</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-6 relative flex justify-center w-full">
            {/* Ambient visual backdrops */}
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
            
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] w-full max-w-lg group bg-slate-950 flex items-center justify-center">
              {homeContent.video_url ? (
                <>
                  {homeContent.video_url.toLowerCase().includes('aparat.com') ? (
                    <iframe 
                      src={homeContent.video_url.toLowerCase().includes('/v/') 
                        ? `https://www.aparat.com/video/video/embed/videohash/${(homeContent.video_url.match(/\/v\/([a-zA-Z0-9]+)/) || [])[1] || ''}/vt/frame`
                        : homeContent.video_url
                      } 
                      allowFullScreen 
                      className="w-full h-full border-0 absolute inset-0" 
                      title="ویدیو معرفی صفحه اصلی"
                    />
                  ) : (homeContent.video_url.toLowerCase().includes('youtube.com') || homeContent.video_url.toLowerCase().includes('youtu.be')) ? (
                    <iframe 
                      src={homeContent.video_url.toLowerCase().includes('watch?v=') 
                        ? homeContent.video_url.replace('watch?v=', 'embed/') 
                        : homeContent.video_url.toLowerCase().includes('youtu.be/') 
                          ? `https://www.youtube.com/embed/${homeContent.video_url.split('/').pop()}`
                          : homeContent.video_url
                      } 
                      allowFullScreen 
                      className="w-full h-full border-0 absolute inset-0"
                      title="ویدیو معرفی صفحه اصلی"
                    />
                  ) : (
                    <video 
                      src={homeContent.video_url} 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                </>
              ) : (
                <img 
                  src={homeContent.hero_image}
                  alt="وانت نیسان اسباب کشی اسپاب چی" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-150 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-bold block">ناوگان مجهز روز کشور</span>
                  <strong className="text-xs text-slate-900 font-black">کامیونت ۵ متری پتودار مخصوص اسباب‌کشی</strong>
                </div>
                <div className="text-yellow-500 flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
            </div>
          </div>

          </section>

        {/* SERVICES OVERVIEW SECTION */}
        {(homeContent.stat_1_num || homeContent.stat_2_num || homeContent.stat_3_num || homeContent.stat_4_num) ? (
        <section className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <strong className="block text-3xl md:text-4xl font-extrabold font-sans text-amber-400">{homeContent.stat_1_num}</strong>
              <span className="text-xs text-slate-300 font-semibold">{homeContent.stat_1_lbl}</span>
            </div>
            <div className="space-y-1">
              <strong className="block text-3xl md:text-4xl font-extrabold font-sans text-amber-400">{homeContent.stat_2_num}</strong>
              <span className="text-xs text-slate-300 font-semibold">{homeContent.stat_2_lbl}</span>
            </div>
            <div className="space-y-1">
              <strong className="block text-3xl md:text-4xl font-extrabold font-sans text-amber-400">{homeContent.stat_3_num}</strong>
              <span className="text-xs text-slate-300 font-semibold">{homeContent.stat_3_lbl}</span>
            </div>
            <div className="space-y-1">
              <strong className="block text-3xl md:text-4xl font-extrabold font-sans text-amber-400">{homeContent.stat_4_num}</strong>
              <span className="text-xs text-slate-300 font-semibold">{homeContent.stat_4_lbl}</span>
            </div>
          </div>
        </section>
        ) : (
        <section className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <span className="text-sm text-slate-300 font-semibold">{homeContent.stat_1_lbl}</span>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-slate-300 font-semibold">{homeContent.stat_2_lbl}</span>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-slate-300 font-semibold">{homeContent.stat_3_lbl}</span>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-slate-300 font-semibold">{homeContent.stat_4_lbl}</span>
            </div>
          </div>
        </section>
        )}

        {/* 4 PROFESSIONAL LANDING SERVICES (Sub menus) */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="inline-block mb-5 md:mb-6 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-extrabold px-4 py-2 rounded-full border border-amber-100 dark:border-amber-900/40 shadow-xs">
              چرا هشدارهای اسباب‌کشی را جدی بگیریم؟
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              ۴ خدمت تخصصی باربری و بسته‌بندی اسپاب چی
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
              هر کدام از بخش‌های زیر با لندینگ اطلاعاتی حرفه‌‌ای و امکان تعیین هزینه با زبانه اختصاصی متناوب پیوند داده شده‌اند.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Service 1: Packing */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-blue-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">بسته‌بندی اثاثیه منزل</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">سرویس لوکس کارتن پنج لایه و سلفون ضد ضربه خارجی</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                  لوازم ظریف آشپزخانه و مبلمان شما به طور کامل توسط تیم و متریال درجه یک ضد ضربه بسته‌بندی خواهد شد.
                </p>
              </div>
              <button 
                onClick={() => navigate('/services/packing')}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-slate-700 rounded-xl text-xs font-black transition-colors"
              >
                توضیحات و نمونه کارها کتبی
              </button>
            </div>

            {/* Service 2: Workers */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">کارگر خالی و نیروی جابجایی</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">اعزام فوری کارگران خوش‌اخلاق برای تخلیه و بارگیری</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                  اگر ماشین تهیه کرده‌اید اما نیازمند نیروی تنومند گاوصندوق و ساید-بای-ساید هستید، ما فوراً در خدمتیم.
                </p>
              </div>
              <button 
                onClick={() => navigate('/services/workers')}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-slate-700 rounded-xl text-xs font-black transition-colors"
              >
                کسب اطلاعات بیشتر
              </button>
            </div>

            {/* Service 3: Transport Vehicles */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">وانت بار و نیسان بار</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">حمل ایمن و سریع بارهای کوچک با راننده باتجربه</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                  مناسب‌ترین خدمات حمل مبلمان سرویس خواب یا یخچال ساید به صورت تک با تعرفه‌های ویژه شهری پتو دار.
                </p>
              </div>
              <button 
                onClick={() => navigate('/services/transport')}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-slate-700 rounded-xl text-xs font-black transition-colors"
              >
                کسب اطلاعات بیشتر
              </button>
            </div>

            {/* Service 4: Storage */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Warehouse className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">انبار و اجاره موقت وسایل</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">کانتینرهای اختصاصی ضد آب و مسقف کلید دست مشتری</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                  انبارهای کاملاً بهداشتی با نگهبانی مداربسته ۲۴ ساعته در ابعاد متفاوت جهت دپوی مطمئن اثاثیه موقت.
                </p>
              </div>
              <button 
                onClick={() => navigate('/services/storage')}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-slate-700 rounded-xl text-xs font-black transition-colors"
              >
                کسب اطلاعات بیشتر
              </button>
            </div>

          </div>

        </section>

        {/* CHAT/COST CALCULATOR SECION WITH LIVE PRICING METER */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 scroll-mt-28" id="price-calc-anchor">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              <span className="inline-block mb-5 md:mb-6 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 px-4 py-2 rounded-full font-extrabold border border-rose-100 dark:border-rose-900/40 shadow-xs">
                بروزرسانی تعرفه خرداد ۱۴۰۵
              </span>
              <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white leading-[1.25]">
                پیش فاکتور دقیق با پوشش ضمانت‌نامه تا سقف دلخواه!
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-justify">
                با وارد کردن اطلاعات اسباب‌کشی خود، برآورد اولیه هزینه را دریافت کنید. هزینه نهایی پس از بررسی اطلاعات سفارش توسط کارشناسان اسپاب‌چی به شما اعلام می‌شود.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300">۱۵٪ تخفیف ویژه رزرو اینترنتی از داخل فرم</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300">اعزام کارگران مجزا، کاربلد و ایرانی</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300">کامیون‌های نسل جدید ایسوزو موکت کاری مجهز به ۶۰ پتو</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-12 xl:col-span-7">
              <Estimator 
                baseTruck={baseTruckNum}
                perWorker={perWorkerNum}
                packService={packServiceNum}
                onSuccess={() => triggerToast('درخواست استعلام قیمت و هماهنگی شما با شماره ثبت پیگیری با موفقیت ارسال شد!')}
                configString={settings.estimator_config}
              />
            </div>

          </div>
        </section>

        {/* DYNAMIC COMPANY HIGHLIGHT ABOUT US FOR SECURE COOPERATION */}
        <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-gray-100 dark:border-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-blue-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">اطلاعات شفاف قبل از انجام کار</h4>
              <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                پیش از ثبت سفارش، اطلاعات کاملی درباره نوع خدمت، عوامل مؤثر بر هزینه و نحوه اعزام به شما داده می‌شود.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">سرویس دهی منظم شبانه‌روزی</h4>
              <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                حتی در سردترین یا شلوغ‌ترین روزهای آخر هفته تهران بزرگ، با اتکا به کادر پاسخگو رزرو‌های اختصاصی شما راس ساعت هماهنگ شده به محل اعزام می‌گردند.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <MessagesSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">پشتیبانی و پیگیری سفارش</h4>
              <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed text-justify">
                در صورت هرگونه سؤال یا مشکل، تیم پشتیبانی اسپاب‌چی آماده پاسخگویی و پیگیری است.
              </p>
            </div>
          </div>
        </section>

        {/* 3 TOP LATEST BLOG POSTS INSIGHTS */}
        {recentPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div className="space-y-1 text-right">
                <span className="inline-block mb-5 md:mb-6 text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-extrabold px-4 py-2 rounded-full uppercase border border-indigo-150/40 dark:border-indigo-900/40 shadow-xs font-sans">دانستنی‌های جالب</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">آخرین مطالب آموزشی و نکات مهم اسباب‌کشی</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">دانستن چند اصول ساده مادی می‌تواند زیان‌های اسباب کشی را به صفر برساند.</p>
              </div>
              <button 
                onClick={() => navigate('/blog')}
                className="text-xs font-black text-purple-600 hover:text-blue-800 underline self-start cursor-pointer"
              >
                مشاهده کل مقالات ⬅️
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="h-44 overflow-hidden">
                    <img 
                      src={post.image_url || ''} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 space-y-3 flex-grow bg-white dark:bg-slate-900">
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold px-2.5 py-1 rounded-full uppercase inline-block">
                      آموزشی
                    </span>
                    <h4 
                      onClick={() => {
                        setActivePostSlug(post.slug);
                        navigate(`/blog/${post.slug}`);
                      }}
                      className="text-sm font-black text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2 leading-tight cursor-pointer"
                    >
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 text-justify leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                  <div className="p-5 border-t border-gray-50 dark:border-slate-800 pt-3 bg-white dark:bg-slate-900">
                    <button 
                      onClick={() => {
                        setActivePostSlug(post.slug);
                        navigate(`/blog/${post.slug}`);
                      }}
                      className="text-[11px] font-black text-purple-600 hover:text-blue-800 dark:text-purple-400 flex items-center gap-1 cursor-pointer"
                    >
                      مطالعه مقاله کامل
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        </div>
      </div>
    );
  };

  // Render Page Content conditionally
  const renderContent = () => {
    // Exact path matcher
    if (path === '/') return renderHome();
    
    if (path === '/about') {
      const about = getAboutContent();
      return (
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-16 space-y-10 text-right leading-relaxed animate-in fade-in duration-200" dir="rtl">

          {/* ── 1. معرفی اسپاب‌چی ── */}
          <div className="space-y-3">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-extrabold px-4 py-1.5 rounded-full">معرفی اسپاب‌چی</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{about.title}</h1>
            <p className="text-sm text-gray-500">{about.subtitle}</p>
          </div>

          {/* Video or image */}
          {about.video_url ? (
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-slate-100 aspect-[16/9] w-full bg-slate-950 flex items-center justify-center">
              {about.video_url.toLowerCase().includes('aparat.com') ? (
                <iframe
                  src={about.video_url.toLowerCase().includes('/v/')
                    ? `https://www.aparat.com/video/video/embed/videohash/${(about.video_url.match(/\/v\/([a-zA-Z0-9]+)/) || [])[1] || ''}/vt/frame`
                    : about.video_url}
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                  title="ویدیو معرفی درباره ما"
                />
              ) : (about.video_url.toLowerCase().includes('youtube.com') || about.video_url.toLowerCase().includes('youtu.be')) ? (
                <iframe
                  src={about.video_url.toLowerCase().includes('watch?v=')
                    ? about.video_url.replace('watch?v=', 'embed/')
                    : about.video_url.toLowerCase().includes('youtu.be/')
                      ? `https://www.youtube.com/embed/${about.video_url.split('/').pop()}`
                      : about.video_url}
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                  title="ویدیو معرفی درباره ما"
                />
              ) : (
                <video src={about.video_url} controls preload="metadata" className="w-full h-full object-cover" playsInline />
              )}
            </div>
          ) : about.image_url ? (
            <div className="rounded-[32px] overflow-hidden shadow-md max-h-[360px]">
              <img src={about.image_url} alt="تیم اسباب‌کشی اسپاب‌چی" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : null}

          {/* Intro card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900">{about.heading}</h2>
            <p className="text-sm text-gray-600 text-justify leading-relaxed">{about.paragraph_1}</p>
            <p className="text-sm text-gray-600 text-justify leading-relaxed">{about.paragraph_2}</p>
          </div>

          {/* ── 2. خدماتی که ارائه می‌دهیم ── */}
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-extrabold px-4 py-1.5 rounded-full">خدمات ما</span>
              <h2 className="text-xl font-black text-slate-900">{about.services_section_title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Truck className="w-5 h-5" />, title: about.service_1_title, desc: about.service_1_desc },
                { icon: <Package className="w-5 h-5" />, title: about.service_2_title, desc: about.service_2_desc },
                { icon: <Users className="w-5 h-5" />, title: about.service_3_title, desc: about.service_3_desc },
                { icon: <Warehouse className="w-5 h-5" />, title: about.service_4_title, desc: about.service_4_desc },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. نحوه ثبت و انجام سفارش ── */}
          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 space-y-5">
            <div className="space-y-1">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-extrabold px-4 py-1.5 rounded-full">فرآیند سفارش</span>
              <h2 className="text-xl font-black text-slate-900">{about.process_section_title}</h2>
            </div>
            <ol className="space-y-4">
              {[
                { n: '۱', title: about.step_1_title, desc: about.step_1_desc },
                { n: '۲', title: about.step_2_title, desc: about.step_2_desc },
                { n: '۳', title: about.step_3_title, desc: about.step_3_desc },
                { n: '۴', title: about.step_4_title, desc: about.step_4_desc },
              ].map((step) => (
                <li key={step.n} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-black flex items-center justify-center shrink-0">{step.n}</span>
                  <div>
                    <p className="text-sm font-black text-slate-800">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ── 4. عوامل مؤثر بر هزینه ── */}
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-extrabold px-4 py-1.5 rounded-full">شفافیت قیمت</span>
              <h2 className="text-xl font-black text-slate-900">{about.pricing_section_title}</h2>
              <p className="text-xs text-gray-500">{about.pricing_section_desc}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                about.pricing_factor_1,
                about.pricing_factor_2,
                about.pricing_factor_3,
                about.pricing_factor_4,
                about.pricing_factor_5,
                about.pricing_factor_6,
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 5. محدوده خدمات در تهران ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <span className="inline-block bg-rose-100 text-rose-700 text-xs font-extrabold px-4 py-1.5 rounded-full">پوشش جغرافیایی</span>
              <h2 className="text-xl font-black text-slate-900">{about.areas_section_title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { zone: about.area_1_zone, areas: about.area_1_areas },
                { zone: about.area_2_zone, areas: about.area_2_areas },
                { zone: about.area_3_zone, areas: about.area_3_areas },
                { zone: about.area_4_zone, areas: about.area_4_areas },
              ].map((z, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-slate-800">{z.zone}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{z.areas}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. چرا اطلاعات شفاف قبل از شروع کار ── */}
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-extrabold px-4 py-1.5 rounded-full">رویکرد ما</span>
              <h2 className="text-xl font-black text-slate-900">{about.transparency_section_title}</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: about.transparency_1_title, desc: about.transparency_1_desc },
                { title: about.transparency_2_title, desc: about.transparency_2_desc },
                { title: about.transparency_3_title, desc: about.transparency_3_desc },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-slate-800">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 7. CTA ── */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-[32px] p-8 md:p-10 text-center space-y-5 shadow-xl">
            <h3 className="text-xl font-black">{about.cta_title}</h3>
            <p className="text-sm text-blue-100 leading-relaxed">{about.cta_desc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black px-7 py-3.5 rounded-2xl shadow-md transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                {about.cta_btn_call}: {settings.phone}
              </a>
              <button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('price-calc-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors text-sm cursor-pointer"
              >
                {about.cta_btn_calc}
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      );
    }

    if (path === '/contact') {
      return (
        <ContactView 
          phone={settings.phone}
          phoneAlt={settings.phone_alt}
          email={settings.email}
          address={settings.address}
          workingHours={settings.working_hours}
        />
      );
    }

    if (path === '/areas') {
      return (
        <AreasView 
          areasDataObj={settings.areas_data}
          onBackToHome={() => navigate('/')}
          phone={settings.phone}
        />
      );
    }

    if (path.startsWith('/services/')) {
      const parts = path.split('/');
      const slug = parts[parts.length - 1];
      return (
        <ServiceLanding 
          slug={slug} 
          onBackToServices={() => navigate('/')} 
          onOpenEstimator={() => {
            navigate('/');
            setTimeout(() => {
              const el = document.getElementById('price-calc-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }}
          phone={settings.phone}
          onNavigate={navigate}
        />
      );
    }

    if (path.startsWith('/services')) {
      return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-12 space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
          <div className="text-center max-w-xl mx-auto space-y-3 pb-8">
            <h1 className="text-3xl font-black text-slate-900">خدمات ممتاز و جامع حمل اثاثیه اسپاب چی</h1>
            <p className="text-xs text-gray-500">برای مشاهده جزئیات فاکتور و متد عملیاتی هر سرویس روی آن کلیک کنید.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {services.map((srv) => (
              <div key={srv.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow p-6 flex gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={srv.image_url} alt={srv.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3 flex-grow">
                  <h3 className="text-md font-black text-slate-900">{srv.name}</h3>
                  <p className="text-xs text-gray-550 text-justify line-clamp-3 leading-relaxed">{srv.description}</p>
                  <button 
                    onClick={() => navigate(`/services/${srv.slug}`)}
                    className="text-xs font-bold text-purple-600 underline"
                  >
                    نمایش لندینگ تخصصی ⬅️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (path.startsWith('/blog')) {
      return (
        <BlogView 
          onNavigate={navigate}
          selectedPostSlug={activePostSlug}
          onSelectPost={(slug) => {
            setActivePostSlug(slug);
            if (slug) {
              navigate(`/blog/${slug}`);
            } else {
              navigate('/blog');
            }
          }}
        />
      );
    }

    if (path.startsWith('/admin')) {
      return (
        <AdminPanel 
          onLogout={() => navigate('/')} 
          phone={settings.phone}
        />
      );
    }

    if (path === '/privacy') {
      return (
        <PrivacyPolicyView onBackToHome={() => navigate('/')} content={getPrivacyContent()} />
      );
    }

    if (path === '/terms') {
      return (
        <TermsView onBackToHome={() => navigate('/')} content={getTermsContent()} />
      );
    }

    // Default Fallback
    return (
      <div className="text-center py-24 text-gray-500 font-bold space-y-4">
        <p>به نظر می‌رسد آدرس مورد نظر در شبکه اسپاب چی یافت نشد.</p>
        <button onClick={() => navigate('/')} className="bg-purple-600 text-white rounded-xl px-5 py-2">بازگشت به سایت</button>
      </div>
    );
  };

  // Helper to format whatsapp link
  const getWhatsappUrl = () => {
    const input = settings.float_whatsapp_phone || settings.phone_alt || settings.phone || '';
    if (!input) return '';
    if (input.startsWith('http://') || input.startsWith('https://')) return input;
    // Strip non-digits
    const clean = input.replace(/[^\d]/g, '');
    // If starts with 09 (Iranian mobile), replace 0 with 98
    if (clean.startsWith('09') && clean.length === 11) {
      return `https://wa.me/98${clean.substring(1)}`;
    }
    if (clean.startsWith('9') && clean.length === 10) {
      return `https://wa.me/98${clean}`;
    }
    return `https://wa.me/${clean}`;
  };

  const getCallPhone = () => {
    return settings.float_call_phone || settings.phone || '02144177827';
  };

  const isPlainAdminView = path === '/admin';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden transition-colors duration-300">
      
      {/* Toast Alert System Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[999] bg-green-600 text-white py-3.5 px-6 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render layout header only if not login/plain admin panel to leave room */}
      {!isPlainAdminView && (
        <Header 
          currentPath={path} 
          onNavigate={navigate} 
          phone={settings.phone} 
          logoUrl={settings.logo_url}
          tagline={settings.tagline}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      <main className={`flex-grow ${!isPlainAdminView ? 'pt-24 pb-14' : ''}`}>
        {renderContent()}
      </main>

      {!isPlainAdminView && (
        <Footer 
          onNavigate={navigate} 
          phone={settings.phone}
          phone_alt={settings.phone_alt}
          email={settings.email}
          address={settings.address}
          aboutText={settings.about_text}
        />
      )}

      {/* Back to Top Button */}
      {!isPlainAdminView && settings.back_to_top_enabled !== 'false' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 left-6 z-50 bg-white/95 backdrop-blur text-slate-850 hover:text-purple-600 border border-slate-200/60 hover:border-blue-200 w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${
            showScrollTop ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-10 invisible pointer-events-none'
          }`}
          title="برگشت به بالا"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6 animate-pulse group-hover:animate-bounce" />
        </button>
      )}

      {/* Floating Contact Stack */}
      {!isPlainAdminView && settings.float_contact_enabled !== 'false' && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end" dir="rtl">
          {/* WhatsApp floating button */}
          {getWhatsappUrl() && (
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba56] hover:scale-110 transition-all duration-300 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20 group relative border border-green-400/20"
              title="ارسال پیام در واتساپ"
            >
              <MessageCircle className="w-6 h-6 animate-pulse" />
              <span className="absolute right-14 bg-slate-900/95 backdrop-blur text-white text-[10px] font-black py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none translate-x-2 group-hover:translate-x-0">
                مشاوره در واتس‌اپ
              </span>
            </a>
          )}

          {/* Direct phone call floating button */}
          <a
            href={`tel:${getCallPhone()}`}
            className="bg-purple-600 hover:bg-purple-700 hover:scale-110 transition-all duration-300 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 group relative border border-purple-500/20"
            title="تماس مستقیم سریع"
          >
            <Phone className="w-5 h-5 animate-bounce" />
            <span className="absolute right-14 bg-slate-900/95 backdrop-blur text-white text-[10px] font-black py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none translate-x-2 group-hover:translate-x-0">
              تماس تلفنی مستقیم
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
