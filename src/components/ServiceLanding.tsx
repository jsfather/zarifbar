import React, { useEffect, useState } from 'react';
import { Service } from '../types';
import { 
  Package, Users, Truck, Warehouse, CheckCircle, ArrowRight, Phone, 
  ShieldCheck, PhoneCall, Sparkles, Box, Scissors, ShieldAlert, Star, MapPin 
} from 'lucide-react';

export const DEFAULT_PACKING_DATA = {
  heroBadge: "بسته بندی اثاثیه منزل ظریف بار",
  heroTitle: "بسته بندی اثاثیه منزل ظریف بار",
  heroDesc: "بسته بندی اثاثیه منزل در اسباب کشی و جابجایی گام اول است که میتواند به عنوان اولین و سخت ترین قسمت شما باشد، به همین دلیل اتوبار ظریف بار اینجاست تا به شما کمک کند، پرسنل و کادر اجرایی که به محل اعزام میشوند تا عمل باربری را به خوبی انجام دهند در تمامی مراحل نظارت کامل را دارند حتی در بسته بندی که مهم ترین بخش اسباب کشی است. برای اطلاعات بیشتر در مورد خدمات بسته بندی ظریف بار در هر تایمی از شبانه روز و در 7 روز هفته حتی روزای تعطیل با شماره 02144895314 از سراسر کشور تماس گرفته و از مشاوره رایگان برخوردار شوید.",
  heroPhone: "02144895314",
  heroImage: "https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800",
  branches: [
    { name: 'شماره ظریف بار تهران', phone: '02122637259', desc: 'تلفن تماس مستقیم سراسری' },
    { name: 'شماره ظریف بار شمال تهران', phone: '02188235358', desc: 'نیاوران، الهیه، اقدسیه، کامرانیه، فرمانیه، قیطریه، زعفرانیه' },
    { name: 'شماره ظریف بار مرکز تهران', phone: '02144895314', desc: 'ملاصدرا، یوسف‌آباد، مطهری، امیرآباد، گاندی، آرژانتین، شریعتی، جردن' },
    { name: 'شماره ظریف بار غرب تهران', phone: '02188235358', desc: 'سعادت‌آباد، شهرک غرب، پونک، جنت‌آباد، مرزداران، شهران، گیشا، ستارخان' },
  ],
  pillarsTitle: "چیزی که ما را خاص می کند",
  pillarsSubtitle: "باربری و اتوبار ظریف بار بهترین باربری تهران",
  pillars: [
    {
      title: "کارکنان صمیمی",
      desc: "مهربانی و صمیمیت با خانواده، مشتریان، همکاران و جامعه"
    },
    {
      title: "کنترل را در دست بگیرید.",
      desc: "پرداخت فقط برای فضای مورد استفاده شما و دانستن دقیق قیمت در هنگام بارگیری"
    },
    {
      title: "صرفه جویی در هزینه",
      desc: "78درصد مشتریان ما می گویند ما را برای قیمت هایمان انتخاب کرده اند."
    }
  ],
  materialsTitle: "تجهیزات و خدمات ویژه بسته بندی ظریف بار",
  materialsSubtitle: "ارائه دهنده خدمات سریع و ارزان با رعایت بالاترین ضوابط ایمنی",
  materials: [
    {
      title: "کارتن بسته بندی ظریف بار",
      desc: "کارتن های حمل بار و اسباب کشی ظریف بار با استحکامی بینظیر.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
      badge: "استحکام بینظیر"
    },
    {
      title: "اسباب کشی راحت",
      desc: "برنامه ریزی دقیق عملیاتی ، استفاده از خدمات بسته بندی، جداسازی لوازم خرده ریز از درشت",
      image: "https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800",
      badge: "برنامه ریزی دقیق"
    },
    {
      title: "حمل بار ارزان",
      desc: "ظریف بار ارائه دهنده ی خدمات سریع و ارزان بار با کیفیت بالا",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      badge: "سریع و ارزان"
    },
    {
      title: "صحیح و سالم سفر کنید",
      desc: "99درصد از مشتریان ما ،به صورت رایگان بیمه شده اند.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      badge: "۹۹٪ بیمه رایگان"
    },
    {
      title: "خدمات عالی را تجربه کنید",
      desc: "ما همواره بهترین خدمات را در حوزه باربری جهت رفاه مشتریان ارائه می دهیم.",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
      badge: "بهترین خدمات"
    },
    {
      title: "همه چیز در یک پیشنهاد",
      desc: "شما می توانید از خدمات باربری یکسان استفاده کنید، اکنون به صورت سرویس رایگان هنگام رزرو ارائه می شود.",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
      badge: "سرویس رایگان ویژه"
    }
  ],
  videoUrl: "",
  fullStoryTitle: "اسباب کشی و بسته بندی ظریف بار",
  fullStoryDesc: "یکی از مهم ترین دغدغه های مردم که با گذشت زمان نیز بیشتر با آن روبرو میشوند انتخاب باربری و اتوبار مناسب در هنگام اثاث کشی و تغییر محل زندگی است، برای پیدا کردن شرکت باربری معتبر با وجود تعداد بالای مجموعه های فیک کار دشوار و حساسی است. در ابتدا با سرچ در اینترنت و تحقیق و پرس جو از کسانی که قبلاً اسباب کشی کرده‌اند فهرستی آماده کنید؛ در این میان شما متوجه خواهید شد که اولین و بزرگترین باربری و اتوبار معتبر تهران ظریف بار است به این علت که تمامی موارد شامل بسته بندی و موارد مربوط به باربری را تحت پوشش قرار میدهد.",
  fullStoryImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
  topics: [
    {
      title: "اسباب کشی ظریف بار و مدیریت دغدغه‌ها",
      desc: "انتخاب باربری مجهز و با سابقه در وقت اثاث کشی بسیار حیاتی است. ظریف بار با ارائه راهکارهای نوین، بسته‌بندی پنج لایه ضد ضربه و استفاده از کارگران ورزیده خیال شما را کاملاً آسوده می‌سازد."
    },
    {
      title: "برنامه‌ریزی، وقت‌شناسی و سرعت عمل بی‌رقیب",
      desc: "وقتشناسی و با برنامه بودن یکی از مهمترین عوامل یک اتوبار تهران است، زیرا مشتری دوست ندارد کارگران دیر برسد و برنامه آنها را مختل کند. باربری ظریف بار با بیش از 150 ماشین فعال پخش شده در سراسر تهران در کمترین زمان ممکن و حتی کمتر از ربع ساعت از زمان تماس خود را به مبدا می‌رساند."
    },
    {
      title: "سامانه رزرو آنلاین و تلفنی شرکت باربری ظریف بار",
      desc: "باربری و اتوبار ظریف بار امکان رزرو اینترنتی اتوبار را فراهم آورده است. شما می‌توانید با تکمیل فرم آنلاین زمان اسباب کشی را انتخاب نمایید، کارشناسان با شما تماس خواهند گرفت. کافی است با تلفن ۱۵۰۰ یا شماره 02144895769 تماس حاصل فرمایید."
    },
    {
      title: "مناطق شمال تهران تحت پوشش کامل",
      desc: "ظریف بار نیاوران – خیابان بوکان – کوهستان، خیابان جمشید – ظریف بار الهیه – ظریف بار اقدسیه، ظریف بار کامرانیه – ظریف بار فرمانیه – ظریف بار اندرزگو، قیطریه – ظریف بار زعفرانیه – جردن، ظریف بار تجریش – بلوار ارتش – اختیاریه، دیباجی – جماران – باهنر - شریعتی، ظریف بار پاسداران – خیابان دولت – کلاهدوز."
    },
    {
      title: "مناطق شرق، غرب و جنوب تهران",
      desc: "شرق: ظریف بار تهرانپارس، شهرک امید، باقری، استخر، پیروزی، نارمک. غرب: اتی ساز، پونک، شهرک نفت، جنت آباد، مرزداران، شهران، شهر زیبا، سردار جنگل، آریا شهر، ستارخان، گیشا، سید خندان، گاندی، آرژانتین، آفریقا، چیتگر، دهکده، شهرک راه آهن. جنوب: نواب، پیروزی، منیریه."
    }
  ],
  concludingTitle: "اسباب کشی و بسته بندی ظریف بار",
  concludingDesc: "مهمترین و اساسی ترین نکته برای ما برخورداری از کیفیت بالا در باربری و اتوبار ظریف بار است و خوشبختانه توانستیم به عنوان بهترین معرفی شویم. اثاث کشی خود را از صفر تا صد با خیالی آسوده به ما بسپارید."
};

export const DEFAULT_TRANSPORT_DATA = {
  heroBadge: "حمل و نقل سریع و ارزان بارهای سبک و متوسط ظریف بار",
  heroTitle: "وانت بار و نیسان بار ظریف بار",
  heroDesc: "مخصوص حمل فوری اثاثیه سبک، بارهای تکی، مبلمان، یخچال و کارتن‌ها با وانت مجهز و نیسان‌های ضربه‌گیر دار پتو دار در هر ساعت از شبانه‌روز و حتی ایام تعطیل با تعرفه منصفانه.",
  heroPhone: "02122637259",
  heroImage: "https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800",
  branches: [
    { name: 'شماره ظریف بار تهران', phone: '02122637259', desc: 'تلفن تماس و رزرواسیون اصلی' },
    { name: 'شماره ظریف بار شمال تهران', phone: '02188235358', desc: 'نیاوران، اقدسیه، تجریش، پاسداران، الهیه، زعفرانیه' },
    { name: 'شماره ظریف بار مرکز تهران', phone: '02144895314', desc: 'ملاصدرا، ونک، یوسف آباد، مطهری، گاندی، آرژانتین' },
    { name: 'شماره ظریف بار غرب تهران', phone: '02188235358', desc: 'پونک، مرزداران، صادقیه، پوتک، جنت‌آباد، شهران' },
  ],
  pillarsTitle: "چیزی که ما را خاص می کند",
  pillarsSubtitle: "ارائه‌دهنده سرویس‌های وانت‌بار و نیسان ممتاز و ارزان در پایتخت",
  pillars: [
    {
      title: "کارکنان صمیمی و مهربان",
      desc: "مهربانی و صمیمیت با خانواده، مشتریان، همکاران و جامعه در حین جابجایی"
    },
    {
      title: "کنترل را در دست بگیرید.",
      desc: "پرداخت فقط برای فضای مورد استفاده شما و دانستن دقیق قیمت در هنگام بارگیری بارهای سبک"
    },
    {
      title: "صرفه جویی در هزینه حمل",
      desc: "بیش از ۷۸ درصد مشتریان‌مان اعلام کرده‌اند به علت قیمت منصفانه و عالی ما را برگزیده‌اند."
    }
  ],
  materialsTitle: "انواع خودروها و خدمات وانت و نیسان بار",
  materialsSubtitle: "کامیونت‌های مسقف و موکت‌کاری شده به همراه سبک‌ترین وانت‌های مجهز",
  materials: [
    {
      title: "وانت بار پیکان و مزدا",
      desc: "ایده‌آل‌ترین سرویس برای جابجایی‌های کوچک، لوازم کارگاهی، مبل تک، یخچال و بارهای کم حجم با هزینه ارزان‌تر.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
      badge: "کم هزینه و پرسرعت"
    },
    {
      title: "نیسان بار مجهز به پتو",
      desc: "دارای ده‌ها پتوی ضخیم ضربه‌گیر جهت پوشش کامل اثاثیه سنگین و حساس و ممانعت از ایجاد هرگونه خط و خش.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      badge: "ضربه‌گیر ویژه"
    },
    {
      title: "وانت و نیسان مسقف",
      desc: "محافظت کامل از مرسولات و لوازم شما در برابر باران، برف، نور خورشید و آلودگی‌های جاده‌ای.",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
      badge: "۱۰۰٪ ضد آب و گرد و غبار"
    }
  ],
  fullStoryTitle: "وانت بار تلفنی و نیسان بار ظریف بار",
  fullStoryDesc: "حمل بار سبک و نیمه‌سنگین نیازمند چابکی و دقت عمل بالاست. اگر نیاز به حمل یک یا چند قلم بار دارید، با پرداخت نیمی از هزینه کامیون‌های اسباب‌کشی می‌توانید از سرویس وانت و نیسان تلفنی ما برخوردار شوید. خودروهای ما همراه با رانندگانی ماهر و پتوهای مخمل مخصوص ضربه‌گیر، بار شما را به کمال ایمنی جابجا می‌نمایند. وقت‌شناسی بالا و حضور کمتر از ربع ساعت از ویژگی‌های بارز اتوبار ظریف بار است.",
  fullStoryImage: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
  topics: [
    {
      title: "فرآیند حمل بار ایمن و بدون دغدغه",
      desc: "برنامه‌ریزی دقیق، استفاده از ملزومات مستحکم و جدا کردن کالاهای سنگین از سبک به شما در تجربه بهترین اسباب‌کشی کمک شایانی خواهد نمود."
    },
    {
      title: "اعزام فوری خودرو به کل پایتخت",
      desc: "دارای بیش از ۱۵۰ دستگاه وانت و نیسان فعال در شمال، مرکز، غرب و شرق تهران که در کمتر از ربع ساعت در آدرس مبدا حاضر خواهند بود."
    },
    {
      title: "بیمه معتبر دولتی رایگان کالا",
      desc: "جهت آسایش خاطر بدون تزلزل شما عزیزان، بیش از ۹۹ درصد از خدمات حمل و ترابری سبک ما به صورت کاملاً رایگان تحت بیمه کالا ثبت می‌گردند."
    },
    {
      title: "رزرو هماهنگ و تلفنی شبانه‌روزی",
      desc: "شما می‌توانید در تمامی ساعت شبانه‌روز و ۷ روز هفته حتی تعطیلات رسمی با کارشناسان ما تماس گرفته و مشاوره رایگان دریافت کنید."
    },
    {
      title: "نیسان بار شهرستان و جاده‌ای",
      desc: "انتقال امن کالاها به تمام شهرهای همجوار تهران و مقصدهای سراسر کشور همراه با صدور بارنامه دولتی معتبر و رانندگان جاده‌ای راه‌بلد."
    }
  ],
  videoUrl: "",
  concludingTitle: "وانت بار و نیسان بار ظریف بار تهران",
  concludingDesc: "حمل باری ایمن، پرسرعت و مقرون به صرفه را همین حالا تجربه کنید. پشتیبانی شبانه‌روزی ظریف بار با شماره‌‌های مستقیم منتظر پاسخگویی به شما خوبان است."
};

export const DEFAULT_STORAGE_DATA = {
  heroBadge: "اجاره انبار تمیز و مسقف ظریف بار با امنیت فوق العاده بالا",
  heroTitle: "اجاره انبار ظریف بار",
  heroDesc: "اجاره انبار ظریف بار برای اثاثیه منزل ، جهیزیه ، کالاهای تجاری و صنعتی شما در محیطی کاملا تمیز و با امنیت بالا و دارای نگهبان 24 ساعته و دوربین های مدار بسته نگهداری میشوند. انبارهای روباز و مسقف در اندازه های استاندارد موجود می باشد.همچنین انبار های عمومی و بصورت خصوصی در انبار ظریف بار با قیمت مناسب موجود می باشد .",
  heroPhone: "02122637259",
  heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  branches: [
    { name: 'شماره اجاره انبار ظریف بار', phone: '02122637259', desc: 'تلفن تماس مستقیم رزرو و پذیرش' },
    { name: 'شعبه شمال تهران', phone: '02188235358', desc: 'زعفرانیه، نیاوران، جردن، ولنجک' },
    { name: 'شعبه مرکز تهران', phone: '02144895314', desc: 'ملاصدرا، یوسف‌آباد، مطهری، امیرآباد' },
    { name: 'شعبه غرب تهران', phone: '02188235358', desc: 'سعادت‌آباد، شهرک غرب، پونک، ستارخان' },
  ],
  pillarsTitle: "امنیت ۱۰۰٪ بار در انبارهای ظریف بار",
  pillarsSubtitle: "نگهبـان شبانه‌روزی فیزیکی، مجهز به پیشرفته‌ترین دوربین‌های مداربسته",
  pillars: [
    {
      title: "امنیت شبانه‌روزی",
      desc: "نگهبانی فیزیکی ۲۴ ساعته در محل به همراه سیستم دوربین مداربسته شبکه‌ای متصل به دزدگیرهای قوی."
    },
    {
      title: "کانتینر شخصی شما",
      desc: "کانتینرهایی که تنها مختص به یک مشتری اجاره داده خواهد شد و کلید آن تماماً نزد مشتری نگهداری می‌شود."
    },
    {
      title: "بیمه رسمی و معتبر کالا",
      desc: "کلیه اموال و اثاثیه منزل شما بر اساس قرارداد رسمی شرکت تحت پوشش بیمه دولتی کامل قرار می‌گیرند."
    }
  ],
  materialsTitle: "بخش‌ها و استانداردهای فیزیکی انبارها",
  materialsSubtitle: "انواع کانکس عایق‌بندی، انبارهای مسقف بهداشتی و روباز در ابعاد دلخواه",
  materials: [
    {
      title: "کانتینرهای مسقف فلزی اختصاصی",
      desc: "بسیار مقاوم در برابر نوسانات دما، نفوذ باران، گرد و خاک و رطوبت. هر مشتری کانتینر مجزا با قفل و کلید انحصاری دریافت می‌کند.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      badge: "ضدآب و ایزوله کامل"
    },
    {
      title: "انبارهای بهداشتی و سم‌زدایی شده",
      desc: "کلیه سوله ها و کانتینرها به صورت مستمر و دوره‌ای نظافت گردیده و ضدعفونی و سم‌پاشی جهت حشرات و موش انجام می‌شود تا اثاثه در سلامت کامل بماند.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      badge: "۱۰۰٪ تمیز و عاری از حشرات"
    },
    {
      title: "انبارهای روباز برای مصارف صنعتی",
      desc: "مناسب برای تجار و دپو کردن ماشین‌آلات و کالاهای بزرگ‌تر که تحت حفاظت نگهبانان ۲۴ ساعته قرار می‌گیرند با قیمت فوق‌العاده ارزان‌تر.",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
      badge: "اقتصادی و با دسترسی عريض"
    }
  ],
  fullStoryTitle: "رهن انبار تهران",
  fullStoryDesc: "اجاره انبار در تمام مناطق تهران ، اجاره انواع انبار و کانتینر در سایز های استاندارد برای اجاره اثاثیه های ، برای جهیزیه ، وسایل های فروشگاهی و .. در مجموعه ما برای شما شما عزیزان فراهم نموده ایم. انبار های ما در تهران با داشتن دوربین های مدار بسته و نگهبانی 24 ساعته مجهز می باشد و کالاهای شما نزد ما در امنیت کامل می باشند.کانتینر هایی که تنها مختص به یک مشتری اجاره داده می شود. برای اجاره انبار در تهران با شماره 02144895314 تماس نمایید.",
  fullStoryImage: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
  topics: [
    {
      title: "اجاره انبار ظریف بار",
      desc: "اجاره انبار ظریف بار ، اجاه انبار های مقف و روباز، خصوصی و عمومی در بهترین مکان در تهران با دوربین هی مداربسته ، نگهبان شبانه روزی جهت نگهداری اثاثیه منزل،محل کار کالاهای تجاری و صنعتی آماده می باشد."
    },
    {
      title: "دسترسی عالی به شاهراه‌ها",
      desc: "انبارها در موقعیت‌هایی در حومه و محدوده شهری تهران مستقرند که امکان دسترسی فوق‌العاده آسان از تمام اتوبان‌ها و جاده‌های اصلی را بدون محدودیت طرح ترافیک میسر می‌سازد."
    },
    {
      title: "کانتینر بیست و چهل فوت",
      desc: "انواع حجم کانتینرها متناسب با اثاثیه یک خوابه، دو خوابه و بیشتر تعبیه شده است تا نیازی به پرداخت هزینه بابت فضاهای اضافی خالی نداشته باشید."
    },
    {
      title: "انبار جهیزیه عروس",
      desc: "شرایط بسیار ایده‌آل و قیمت اقتصادی برای عروس و دامادهایی که دنبال مکانی موقتی و عاری از هرگونه آلودگی برای وسایل خود هستند."
    },
    {
      title: "مدارک و قرارداد رسمی",
      desc: "دریافت رسیدهای رسمی با مهر شرکت ظریف بار و مشخصات کامل وسایل تحویل داده شده جهت آسودگی کامل خاطر شما هموطنان عزیز."
    }
  ],
  videoUrl: "",
  concludingTitle: "اجاره انبار ظریف بار با بهترین قیمت",
  concludingDesc: "انبارهـای ما انتخابی مناسب برای تضمین ماندگاری کالاهای شما با خدمات جابجایی تیمی می‌باشد. برای رزو با ما تماس بگیرید."
};

export const DEFAULT_WORKERS_DATA = {
  heroBadge: "کارگر اسباب کشی و نیروی جابجایی متخصص ظریف بار",
  heroTitle: "کارگر خالی اسباب کشی ظریف بار",
  heroDesc: "اگر برای تخلیه بار، بارگیری اثاثیه، جابجایی یخچال ساید‌بای‌ساید، گاوصندوق، پیانو یا تنها چیدمان اثاثیه منزل در خانه جدید نیاز به کارگران ورزیده، توانمند و امین دارید، ظریف بار با پرسنل تخصصی خود به صورت ۲۴ ساعته در خدمت شماست.",
  heroPhone: "02144895314",
  heroImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
  branches: [
    { name: 'شماره مستقیم کارگر خالی ظریف بار', phone: '02122637259', desc: 'رزرو فوری نیروی جابجایی برای تمامی نقاط' },
    { name: 'اعزام کارگر شمال تهران', phone: '02188235358', desc: 'نیاوران، اندرزگو، زعفرانیه، ولنجک، دیباجی، قلهک' },
    { name: 'اعزام کارگر مرکز تهران', phone: '02144895314', desc: 'ملاصدرا، امیرآباد، سیدخندان، یوسف‌آباد، کریمخان' },
    { name: 'اعزام کارگر غرب تهران', phone: '02188235358', desc: 'سعادت‌آباد، شهرک غرب، پونک، جنت‌آباد، صادقیه، مرزداران' },
  ],
  pillarsTitle: "چرا کارگران جابجایی ظریف بار؟",
  pillarsSubtitle: "نیروی کادر مجرب، خوش‌اخلاق، آموزش‌دیده و با امانت صد در صد",
  pillars: [
    {
      title: "نیروی ورزیده و حرفه‌ای",
      desc: "دارای توان جسمانی بالا و تخصص کامل در جابجایی اثاثیه خاص مثل ساید‌بای‌ساید و گاوصندوق بدون آسیب به دیوارهای خانه."
    },
    {
      title: "اخلاق و امانت‌داری کامل",
      desc: "تایید صلاحیت اخلاقی با تست‌های سخت‌گیرانه برای جابجایی مطمئن و توام با نهایت احترام و صمیمیت با مشتریان گرامی."
    },
    {
      title: "تعرفه‌های کاملاً شفاف دولتی",
      desc: "محاسبه دقیق دستمزدها برحسب تعداد طبقات و ساعت کاری صنف بدون انعام زوری یا تقاضای مبالغ اضافی خارج از توافق."
    }
  ],
  materialsTitle: "انواع تخصص‌ها و خدمات کارگر خالی اسباب کشی",
  materialsSubtitle: "خدماتی ایده‌آل و متمایز متناسب با نیاز جابجایی شما در تهران",
  materials: [
    {
      title: "کارگر مخصوص چیدمان و دکوراسیون",
      desc: "نیروهای بادلسوز و با سلیقه جهت چیدمان اصولی مبل‌ها، نصب اتصالات برقی یخچال و جابجایی‌های سنگین داخل آپارتمان شما.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
      badge: "دقت بالا و منظم"
    },
    {
      title: "کارگر جابجایی بارهای سنگین و فوق‌سنگین",
      desc: "کادر متخصص ویژه جهت بلند کردن و جابجایی گاوصندوق، پیانو، وان جکوزی، یخچال ساید‌بای‌ساید و بارهای حجیم صنعتی در پله‌ها.",
      image: "https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800",
      badge: "سازمان‌یافته و پرقدرت"
    },
    {
      title: "کارگر تخلیه بار و بارگیری خاور",
      desc: "اعزام سریع نیروها جهت تخلیه سریع بارهای شهرستان، دپو نمودن وسایل در انبارها، بارگیری خاور، نیسان و انواع کامیون‌ها در کوتاه‌ترین زمان.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      badge: "کوشا و خوش‌برخورد"
    }
  ],
  fullStoryTitle: "اعزام کارگر خالی جابجایی و اتوبار تلفنی ظریف بار",
  fullStoryDesc: "اکثر مواقع اسباب‌کشی با خودروی سواری شخصی یا وانت شخصی انجام می‌شود، اما عدم وجود توان فیزیکی یا نداشتن کادر ورزیده جابجایی باعث آسیب به سلامتی و ستون فقرات یا شکستگی وسایل می‌گردد. در این راستا شرکت ظریف بار امکان اعزام کارگر خالی بدون نیاز به خودرو را برای شهروندان محترم تهران مهیا ساخته است. خدمات نظیر حمل اثاث بین طبقات، بسته بندی، بالابری و چیدمان تماماً توسط نیروهای ورزیده شرکت پشتیبانی می‌شود. همین امروز با تلفن ۱۵۰۰ یا شماره 02144895314 تماس حاصل فرمایید.",
  fullStoryImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
  topics: [
    {
      title: "کارگران ورزیده برای راهروهای تنگ و باریک",
      desc: "حمل اصولی ساید، گاوصندوق، بوفه‌های شیشه‌ای و مبلی از راه‌پله‌های پیچ‌درپیچ و طبقات بالا با رعایت زوایای استاندارد حمل بار."
    },
    {
      title: "کنترل کامل بر هزینه کارگر خالی",
      desc: "با توجه به دستورالعمل‌های رسمی اتحادیه، هزینه جابجایی بر اساس نفرساعت محاسبه می‌شود تا هزینه‌ای برای خودرو پرداخت نکرده و فقط بابت کار جابجایی فیزیکی پرداخت کنید."
    },
    {
      title: "کارشناس بازرسی و نظارت مستقل بر کادر ارسالی",
      desc: "هر گونه نارضایتی خریدار در خصوص انعام غیراخلاقی یا کم کاری به صورت آنی و قاطعانه توسط تیم بازرسی پاسخگویی خواهد شد."
    },
    {
      title: "اعزام کارگر زن و مرد برای بسته بندی ظریف",
      desc: "در صورت تمایل به بسته‌بندی ریزه‌کاری‌ها، پوشاک و ظروف شکستنی آشپزخانه می‌توانید از کادر مجرب بانوان شرکت ظریف بار نیز استفاده کنید."
    },
    {
      title: "جایگزینی آنی کارگر در مبدا در صورت رخداد ناگهانی",
      desc: "در صورتی که به هر دلیلی نیاز به تغییر زمان اعزام کارگر باشد، کادر پشتیبان بلافاصله با نزدیک‌ترین نیروی مستقر در آن شعبه هماهنگ خواهد کرد."
    }
  ],
  videoUrl: "",
  concludingTitle: "تیم متبحر کارگران خالی جابجایی ظریف بار",
  concludingDesc: "آسودگی خیال از بابت جابجایی ایمن و درست سنگین‌ترین اثاثه با کادر زبده ظریف بار. منتظر تماس شما جهت اعزام در سراسر پایتخت هستیم."
};

interface ServiceLandingProps {
  slug: string;
  onBackToServices: () => void;
  onOpenEstimator: () => void;
  phone: string;
  onNavigate?: (path: string) => void;
}

export default function ServiceLanding({ slug, onBackToServices, onOpenEstimator, phone, onNavigate }: ServiceLandingProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [packingData, setPackingData] = useState(DEFAULT_PACKING_DATA);
  const [storageData, setStorageData] = useState(DEFAULT_STORAGE_DATA);
  const [transportData, setTransportData] = useState(DEFAULT_TRANSPORT_DATA);
  const [workersData, setWorkersData] = useState(DEFAULT_WORKERS_DATA);
  const [loadedVideoUrl, setLoadedVideoUrl] = useState('');

  useEffect(() => {
    setLoading(true);

    // Fetch video url from service_videos table
    fetch(`/api/service_videos/${slug}`)
      .then((res) => res.json())
      .then((vData) => {
        if (vData && vData.video_url) {
          setLoadedVideoUrl(vData.video_url);
        } else {
          setLoadedVideoUrl('');
        }
      })
      .catch(() => setLoadedVideoUrl(''));
    
    // Load dynamic packing content if it is the packing slug
    if (slug === 'packing') {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((settingsData) => {
          if (settingsData && settingsData.packing_data) {
            try {
              const customData = JSON.parse(settingsData.packing_data);
              // Merge with default values in case keys are missing
              setPackingData({
                ...DEFAULT_PACKING_DATA,
                ...customData,
                branches: customData.branches || DEFAULT_PACKING_DATA.branches,
                pillars: customData.pillars || DEFAULT_PACKING_DATA.pillars,
                materials: customData.materials || DEFAULT_PACKING_DATA.materials,
                topics: customData.topics || DEFAULT_PACKING_DATA.topics
              });
            } catch (err) {
              console.error('Failed to parse packing_data from settings:', err);
            }
          }
        })
        .catch((err) => console.error('Failed to fetch settings for packing page:', err))
        .finally(() => setLoading(false));
    } else if (slug === 'storage') {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((settingsData) => {
          if (settingsData && settingsData.storage_data) {
            try {
              const customData = JSON.parse(settingsData.storage_data);
              setStorageData({
                ...DEFAULT_STORAGE_DATA,
                ...customData,
                branches: customData.branches || DEFAULT_STORAGE_DATA.branches,
                pillars: customData.pillars || DEFAULT_STORAGE_DATA.pillars,
                materials: customData.materials || DEFAULT_STORAGE_DATA.materials,
                topics: customData.topics || DEFAULT_STORAGE_DATA.topics
              });
            } catch (err) {
              console.error('Failed to parse storage_data from settings:', err);
            }
          }
        })
        .catch((err) => console.error('Failed to fetch settings for storage page:', err))
        .finally(() => setLoading(false));
    } else if (slug === 'transport') {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((settingsData) => {
          if (settingsData && settingsData.transport_data) {
            try {
              const customData = JSON.parse(settingsData.transport_data);
              setTransportData({
                ...DEFAULT_TRANSPORT_DATA,
                ...customData,
                branches: customData.branches || DEFAULT_TRANSPORT_DATA.branches,
                pillars: customData.pillars || DEFAULT_TRANSPORT_DATA.pillars,
                materials: customData.materials || DEFAULT_TRANSPORT_DATA.materials,
                topics: customData.topics || DEFAULT_TRANSPORT_DATA.topics
              });
            } catch (err) {
              console.error('Failed to parse transport_data from settings:', err);
            }
          }
        })
        .catch((err) => console.error('Failed to fetch settings for transport page:', err))
        .finally(() => setLoading(false));
    } else if (slug === 'workers') {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((settingsData) => {
          if (settingsData && settingsData.workers_data) {
            try {
              const customData = JSON.parse(settingsData.workers_data);
              setWorkersData({
                ...DEFAULT_WORKERS_DATA,
                ...customData,
                branches: customData.branches || DEFAULT_WORKERS_DATA.branches,
                pillars: customData.pillars || DEFAULT_WORKERS_DATA.pillars,
                materials: customData.materials || DEFAULT_WORKERS_DATA.materials,
                topics: customData.topics || DEFAULT_WORKERS_DATA.topics
              });
            } catch (err) {
              console.error('Failed to parse workers_data from settings:', err);
            }
          }
        })
        .catch((err) => console.error('Failed to fetch settings for workers page:', err))
        .finally(() => setLoading(false));
    } else {
      // Find normal service info
      fetch(`/api/services/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setService(data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  // RENDER DYNAMIC CUSTOM PACKING OR STORAGE OR TRANSPORT LANDING PAGE
  if (slug === 'packing' || slug === 'storage' || slug === 'transport' || slug === 'workers') {
    const data = slug === 'packing' 
      ? packingData 
      : (slug === 'storage' 
        ? storageData 
        : (slug === 'transport' ? transportData : workersData));
    const activeVideoUrl = loadedVideoUrl || data.videoUrl;
    const pageName = slug === 'packing' 
      ? 'بسته‌بندی حرفه‌ای اثاثیه' 
      : (slug === 'storage' 
        ? 'انبار و اجاره موقت انبار' 
        : (slug === 'transport' ? 'وانت بار و نیسان بار' : 'کارگر خالی و نیروی جابجایی'));

    return (
      <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12" dir="rtl">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
          <button onClick={onBackToServices} className="hover:text-blue-600 transition-colors">خدمات ما</button>
          <span className="text-gray-300">/</span>
          <span className="text-slate-600 font-black">{pageName}</span>
        </div>

        {/* HERO HEADER */}
        <section className="relative rounded-[40px] overflow-hidden shadow-xl bg-slate-900 text-white min-h-[420px] flex items-center p-8 md:p-14">
          <div className="absolute inset-0 z-0 opacity-20">
            <img 
              src={data.heroImage} 
              alt={data.heroTitle} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/90 to-slate-950/60 z-10"></div>
          
          <div className="relative z-20 w-full">
            {activeVideoUrl ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center text-right">
                <div className="lg:col-span-3 space-y-6">
                  <span className="inline-block bg-blue-600 text-white text-[11px] font-black px-4 py-2 rounded-full shadow-md uppercase tracking-wider">
                    {data.heroBadge}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-sm">
                    {data.heroTitle}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify">
                    {data.heroDesc}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-3">
                    {data.heroPhone && (
                      <a 
                        href={`tel:${data.heroPhone}`}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4" />
                        تلفن رزرو: {data.heroPhone}
                      </a>
                    )}
                    <button 
                      onClick={onOpenEstimator}
                      className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-7 py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      محاسبه آنلاین قیمت
                      <span>←</span>
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-2 flex justify-center items-center w-full">
                  <div className="relative rounded-[24px] overflow-hidden shadow-2xl border-4 border-white/20 aspect-[16/9] w-full max-w-lg bg-slate-950 flex items-center justify-center">
                    {activeVideoUrl.toLowerCase().includes('aparat.com') ? (
                      <iframe 
                        src={activeVideoUrl.toLowerCase().includes('/v/') 
                          ? `https://www.aparat.com/video/video/embed/videohash/${(activeVideoUrl.match(/\/v\/([a-zA-Z0-9]+)/) || [])[1] || ''}/vt/frame`
                          : activeVideoUrl
                        } 
                        allowFullScreen 
                        className="w-full h-full border-0 absolute inset-0" 
                        title="ویدیو معرفی"
                      />
                    ) : (activeVideoUrl.toLowerCase().includes('youtube.com') || activeVideoUrl.toLowerCase().includes('youtu.be')) ? (
                      <iframe 
                        src={activeVideoUrl.toLowerCase().includes('watch?v=') 
                          ? activeVideoUrl.replace('watch?v=', 'embed/') 
                          : activeVideoUrl.toLowerCase().includes('youtu.be/') 
                            ? `https://www.youtube.com/embed/${activeVideoUrl.split('/').pop()}`
                            : activeVideoUrl
                        } 
                        allowFullScreen 
                        className="w-full h-full border-0 absolute inset-0"
                        title="ویدیو معرفی"
                      />
                    ) : (
                      <video 
                        src={activeVideoUrl} 
                        controls 
                        preload="metadata"
                        className="w-full h-full object-cover"
                        playsInline
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl space-y-6 text-right">
                <span className="inline-block bg-blue-600 text-white text-[11px] font-black px-4 py-2 rounded-full shadow-md uppercase tracking-wider">
                  {data.heroBadge}
                </span>
                <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-sm">
                  {data.heroTitle}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify">
                  {data.heroDesc}
                </p>
                <div className="flex flex-wrap gap-4 pt-3">
                  {data.heroPhone && (
                    <a 
                      href={`tel:${data.heroPhone}`}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      تلفن رزرو: {data.heroPhone}
                    </a>
                  )}
                  <button 
                    onClick={onOpenEstimator}
                    className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-7 py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    محاسبه آنلاین قیمت
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BRANCH CONTACT GRID */}
        <section className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              {slug === 'packing' ? 'شعبه‌های فعال بسته‌بندی ظریف بار تهران' : (slug === 'storage' ? 'شعبه‌های فعال اجاره انبار ظریف بار تهران' : (slug === 'transport' ? 'شعبه‌های فعال وانت بار و نیسان بار ظریف بار تهران' : 'شعبه‌های فعال اعزام کارگر خالی ظریف بار تهران'))}
            </h2>
            <p className="text-xs text-gray-400">تماس مستقیم با کارشناسان و کادر مجرب در سراسر پایتخت</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.branches.map((br, idx) => (
              <a 
                key={idx}
                href={`tel:${br.phone}`}
                className="bg-white border border-gray-150 hover:border-blue-300 rounded-2xl p-5 hover:shadow-lg transition-all text-center flex flex-col justify-between space-y-3 group"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800">{br.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{br.desc}</p>
                </div>
                <span className="text-sm font-extrabold font-sans text-blue-700 tracking-wider block pt-2 border-t border-gray-50">
                  {br.phone}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* THREE PILLARS */}
        <section className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100">
          <div className="max-w-xl mx-auto text-center mb-10">
            <span className="inline-block mb-5 md:mb-6 text-xs bg-blue-100 text-blue-700 font-extrabold px-4 py-2 rounded-full border border-blue-200 shadow-xs">خدمات ممتاز اثاث کشی</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">{data.pillarsTitle}</h2>
            <p className="text-xs text-gray-500 mt-2">{data.pillarsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                  {idx === 0 ? <Sparkles className="w-6 h-6" /> : idx === 1 ? <Box className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                </div>
                <h3 className="text-base font-black text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed text-justify">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIALS DETAIL */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xl md:text-3xl font-black text-slate-900">{data.materialsTitle}</h2>
            <p className="text-xs text-gray-400">{data.materialsSubtitle}</p>
          </div>
          
          <div className="space-y-6">
            {data.materials.map((mat, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-3xl border border-gray-110 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row p-6 md:p-8 gap-8 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-2/5 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-slate-50">
                  <img src={mat.image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800'} alt={mat.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="w-full md:w-3/5 text-right">
                  <span className="inline-block bg-blue-50 text-blue-700 font-extrabold text-xs px-4 py-2 mb-5 md:mb-6 rounded-full border border-blue-100 shadow-xs">
                    {mat.badge}
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{mat.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed text-justify">
                    {mat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALL TO ADVISORS PROMPT BUTTON */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-[40px] p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
          
          <div className="relative text-center max-w-xl mx-auto space-y-6">
            <h3 className="text-xl md:text-2xl font-black">
              {slug === 'packing' ? 'سفارش تلفنی بسته بندی ظریف بار' : (slug === 'storage' ? 'سفارش تلفنی اجاره انبار ظریف بار' : (slug === 'transport' ? 'سفارش تلفنی وانت بار و نیسان بار ظریف بار' : 'سفارش تلفنی اعزام کارگر خالی ظریف بار'))}
            </h3>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
              تنها با یک تماس و ارتباط با مشاورین آسان ترین و بی دغدغه ترین اثاث کشی و خدمات را تجربه نمایید. همین حالا با ما تماس بگیرید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a 
                href={`tel:${data.heroPhone}`}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black text-sm shadow-md transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                ارتباط با مشاورین: {data.heroPhone}
              </a>
              <button 
                onClick={onOpenEstimator}
                className="bg-transparent border border-white/40 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                محاسبه قیمت آنلاین
                <span>←</span>
              </button>
            </div>
          </div>
        </section>

        {/* BRAND TRUST / FULL STORY */}
        <section className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-150 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-right">
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-lg md:text-xl font-black text-slate-900">{data.fullStoryTitle}</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed text-justify">
                {data.fullStoryDesc}
              </p>
            </div>
            <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-md aspect-video md:aspect-[4/3] bg-slate-900 border border-slate-100 flex items-center justify-center">
              {activeVideoUrl ? (
                <video 
                  src={activeVideoUrl} 
                  controls 
                  className="w-full h-full object-cover"
                  poster={data.fullStoryImage}
                />
              ) : (
                <img 
                  src={data.fullStoryImage} 
                  alt={slug === 'packing' ? 'کارگران بسته بندی ظریف بار' : (slug === 'storage' ? 'انبار و اجاره کانتینر ظریف بار' : (slug === 'transport' ? 'وانت بار و نیسان بار ظریف بار' : 'کارگر خالی اسباب کشی ظریف بار'))} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </div>
        </section>

        {/* TEXT TOPICS (5 Items grid) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-right">
          {data.topics.map((t, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3 ${idx === 2 ? 'md:col-span-2' : ''}`}
            >
              <h4 className={`text-sm md:text-base font-black border-r-4 pr-3 ${
                idx === 0 ? 'text-indigo-900 border-indigo-600' :
                idx === 1 ? 'text-rose-950 border-rose-600' :
                idx === 2 ? 'text-blue-900 border-blue-600' :
                idx === 3 ? 'text-emerald-950 border-emerald-600' :
                'text-amber-950 border-amber-600'
              }`}>{t.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed text-justify">
                {t.desc}
              </p>
            </div>
          ))}
        </section>

        {/* CONCLUDING OUTRO ALERT CARD */}
        <section className="bg-slate-950 text-white rounded-[32px] p-8 text-center space-y-4 border border-slate-900">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-black text-amber-400">{data.concludingTitle}</h4>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {data.concludingDesc}
          </p>
          <div className="pt-2">
            <a 
              href={`tel:${data.heroPhone}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              تماس فوری: {data.heroPhone}
            </a>
          </div>
        </section>
      </div>
    );
  }

  // STANDARD LOADING VIEW FOR OTHER SLUGS
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20 text-gray-500" dir="rtl">
        خدمت مورد نظر یافت نشد.
        <button onClick={onBackToServices} className="text-blue-600 font-bold mr-4 underline">بازگشت به خدمات</button>
      </div>
    );
  }

  const renderIcon = () => {
    switch (service.icon_name) {
      case 'Package':
        return <Package className="w-12 h-12 text-blue-600" />;
      case 'Users':
        return <Users className="w-12 h-12 text-blue-600" />;
      case 'Truck':
        return <Truck className="w-12 h-12 text-blue-600" />;
      case 'Warehouse':
        return <Warehouse className="w-12 h-12 text-blue-600" />;
      default:
        return <Package className="w-12 h-12 text-blue-600" />;
    }
  };

  const benefits = [
    'تضمین کتبی عدم خسارت به کالا',
    'کارکنان ایرانی، ورزیده و آموزش‌دیده',
    'صدور بیمه و بارنامه دولتی رایگان',
    'حضور تیم پشتیبانی ۲۴ ساعته',
  ];

  return (
    <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-7xl mx-auto px-4 md:px-8 leading-relaxed" dir="rtl">
      {/* Breadcrumb path */}
      <div className="mb-5 flex items-center gap-2 text-xs text-gray-400 font-bold">
        <button onClick={onBackToServices} className="hover:text-blue-600">خدمات ما</button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 font-black">{service.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-3xl overflow-hidden shadow-md group h-[300px] md:h-[420px]">
            <img 
              src={service.image_url || 'https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800'} 
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent flex items-end p-6 md:p-10">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-full mb-3 shadow-md">
                  سرویس طلایی ظریف بار
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                  {service.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                {renderIcon()}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-gray-900">{service.name}</h2>
                <p className="text-xs text-gray-400 mt-1">تضمین ۱۰۰٪ ایمنی و سلامت بار شما</p>
              </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            <p className="text-sm md:text-base text-gray-600 leading-relaxed text-justify">
              {service.content}
            </p>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mt-6">
              <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                تعهدات و استانداردهای کیفی ظریف بار:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600 font-semibold">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-xl font-bold">بیمه‌نامه رایگان برای اسباب‌کشی لوکس خود صادر کنید</h3>
              <p className="text-xs text-slate-300">همین حالا می‌توانید قیمت حدودی را محاسبه کرده و رزرو نمایید</p>
            </div>
            <button
              onClick={onOpenEstimator}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all cursor-pointer shrink-0"
            >
              استعلام آنلاین هزینه
            </button>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 text-center">
            <h3 className="text-md font-bold text-gray-900">سایر خدمات اسباب‌کشی</h3>
            <div className="flex flex-col gap-2">
              {[
                { name: 'بسته‌بندی اثاثیه منزل', slug: 'packing' },
                { name: 'کارگر خالی و نیروری جابجایی', slug: 'workers' },
                { name: 'وانت بار و نیسان ممتاز', slug: 'transport' },
                { name: 'انبار و اجاره موقت بهداشتی', slug: 'storage' },
              ].map((item) => (
                <button
                  key={item.slug}
                  onClick={() => {
                    if (item.slug === slug) return;
                    if (onNavigate) {
                      onNavigate(`/services/${item.slug}`);
                    } else {
                      fetch(`/api/services/${item.slug}`)
                        .then((res) => res.json())
                        .then((data) => {
                          if (!data.error) {
                            setService(data);
                          }
                        });
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-2xl border text-sm text-right font-medium transition-all ${
                    item.slug === slug 
                      ? 'border-blue-600 bg-blue-50 text-blue-600' 
                      : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-6 text-center space-y-6 shadow-xl">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-md font-black">مشاوره ۲۴ ساعته رایگان اسباب‌کشی</h3>
              <p className="text-xs text-blue-100 mt-2">کارشناسان ما هم‌اکنون آماده مشاوره و پاسخگویی به سوالات شما هستند</p>
            </div>
            <a 
              href={`tel:${phone}`}
              className="block bg-white text-blue-900 rounded-2xl py-3 font-black text-md shadow-md hover:bg-gray-50 transition-colors"
              dir="ltr"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
