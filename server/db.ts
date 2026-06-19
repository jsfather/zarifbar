import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { hashPassword, isPasswordHashed } from './auth.js';

let dbInstance: Database | null = null;

export async function initDB() {
  dbInstance = await open({
    filename: path.resolve(process.cwd(), 'zarifbar.db'),
    driver: sqlite3.Database
  });

  // Enable WAL mode for performance
  await dbInstance.exec('PRAGMA journal_mode = WAL');

  // Initialize schema
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'writer')),
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published')),
      category_id INTEGER,
      author_id INTEGER,
      seo_title TEXT,
      seo_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      icon_name TEXT,
      seo_title TEXT,
      seo_description TEXT
    );

    CREATE TABLE IF NOT EXISTS service_videos (
      slug TEXT PRIMARY KEY,
      video_url TEXT,
      FOREIGN KEY(slug) REFERENCES services(slug) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pages (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content_json TEXT,
      image_url TEXT,
      seo_title TEXT,
      seo_description TEXT
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      origin_city TEXT NOT NULL,
      dest_city TEXT NOT NULL,
      moving_date TEXT NOT NULL,
      service_type TEXT NOT NULL,
      has_elevator TEXT DEFAULT 'no',
      floors INTEGER DEFAULT 1,
      estimated_price REAL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'contacted', 'completed')),
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'unread' CHECK(status IN ('unread', 'read')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      parent_id INTEGER DEFAULT NULL,
      FOREIGN KEY(parent_id) REFERENCES menus(id) ON DELETE CASCADE
    );
  `);

  await migratePlaintextPasswords(dbInstance);

  const userCount = (await dbInstance.get("SELECT COUNT(*) as count FROM users")) as { count: number };
  if (userCount.count === 0) {
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    const writerPassword = process.env.WRITER_DEFAULT_PASSWORD || 'writerpassword';
    const adminHash = await hashPassword(adminPassword);
    const writerHash = await hashPassword(writerPassword);
    await dbInstance.run(`
      INSERT INTO users (username, password, role, name) 
      VALUES 
        ('admin', ?, 'admin', 'مدیر ظریف بار'),
        ('writer', ?, 'writer', 'نویسنده سایت')
    `, [adminHash, writerHash]);
    if (!process.env.ADMIN_DEFAULT_PASSWORD) {
      console.warn('[security] Default admin password is "admin123". Set ADMIN_DEFAULT_PASSWORD in .env before production.');
    }
  }

  const catCount = (await dbInstance.get("SELECT COUNT(*) as count FROM categories")) as { count: number };
  if (catCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO categories (name, slug) 
      VALUES 
        ('راهنمای بسته‌بندی', 'packing-guide'),
        ('نکات جابجایی', 'moving-tips'),
        ('حمل‌ونقل تخصصی', 'specialized-moving')
    `);
  }

  const settingsCount = (await dbInstance.get("SELECT COUNT(*) as count FROM settings")) as { count: number };
  if (settingsCount.count === 0) {
    const defaultSettings = [
      { key: 'site_title', value: 'ظریف بار - اتوبار و حمل اثاثیه منزل مدرن و ظریف' },
      { key: 'site_description', value: 'ظریف بار با کادری مجرب و ماشین‌آلات پیشرفته حمل اثاثیه منزل، کارگر خالی، بسته‌بندی حرفه‌ای و خدمات انبارداری در خدمت شماست.' },
      { key: 'phone', value: '1500' },
      { key: 'phone_alt', value: '021-22222222' },
      { key: 'email', value: 'info@zarifbar-moving.ir' },
      { key: 'address', value: 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۱۰' },
      { key: 'seo_keywords', value: 'حمل اثاثیه, اثاث کشی, ظریف بار, بسته بندی اثاث, وانت بار, کارگر خالی, اجاره انبار' },
      { key: 'instagram', value: 'https://instagram.com/zarifbar' },
      { key: 'telegram', value: 'https://t.me/zarifbar' },
      { key: 'working_hours', value: '۷ روز هفته، ۲۴ ساعته در خدمت شما هستیم' },
      { key: 'pricing_base_truck', value: '1800000' },
      { key: 'pricing_per_worker', value: '450000' },
      { key: 'pricing_pack_service', value: '1200000' }
    ];
    for (const item of defaultSettings) {
      await dbInstance.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [item.key, item.value]);
    }
  }

  const servicesCount = (await dbInstance.get("SELECT COUNT(*) as count FROM services")) as { count: number };
  if (servicesCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO services (slug, name, title, description, content, image_url, icon_name, seo_title, seo_description) 
      VALUES 
        ('packing', 
         'بسته‌بندی حرفه‌ای اثاثیه', 
         'خدمات نوین و لوکس بسته‌بندی تخصصی شبانه‌روزی', 
         'بسته‌بندی دقیق تمام لوازم منزل با متریال باکیفیت کارتن بابل‌رپ و سلفون ضدضربه به منظور تضمین سلامت کامل بار شما.',
         'امروزه بسته‌بندی لوازم قبل از اسباب‌کشی یکی از مهم‌ترین دغدغه‌های هر خانواده است. تیم ما با استفاده از کارتن‌های ۵ لایه مستحکم، نایلون‌های حباب‌دار (بابل رپ) ضخیم، فوم‌های ضربه‌گیر و سلفون‌های مخصوص، تمامی مبلمان، ظروف کریستال و لوازم الکترونیکی شما را صد در صد بیمه و ضمانت می‌کند تا در حین جابجایی کوچکترین خط و خشی بر روی آن‌ها ایجاد نشود.',
         'https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800',
         'Package',
         'بهترین خدمات بسته‌بندی اثاثیه منزل در تهران | ظریف بار',
         'بسته‌بندی اثاثیه با قیمت مناسب و متریال صد درصد خارجی کارتن پنج لایه و بابل‌رپ و نیروی حرفه‌ای.'),

        ('workers', 
         'کارگر خالی و نیروی جابجایی', 
         'کارگران تنومند، مودب و متخصص جابجایی اجسام سنگین', 
         'اعزام فوری نیروهای ماهر و ورزیده بدون ماشین جهت تخلیه بار، بارگیری مجدد، چیدمان و جابجایی بین طبقات.',
         'اگر خودرو تهیه کرده‌اید اما نیازمند نیروی توانمند هستید، نگران نباشید. نیروهای ورزیده، توانمند و کاملا خوش‌برخورد ظریف بار با بهترین تجهیزات حمل تخصصی گاوصندوق، سایدبای‌ساید، تردمیل، و پیانو، سخت‌ترین جابجایی‌ها را برای شما ساده می‌کنند. ما سلامتی اثاثیه گران‌بهای شما را تضمین می‌کنیم.',
         'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
         'Users',
         'اعزام کارگر اثاث کشی مجرب و تنومند | ظریف بار',
         'اعزام فوری کارگر خالی جابجایی بار و اسباب‌کشی شبانه‌روزی بدون خودرو جهت چیدمان و بارگیری.'),

        ('transport', 
         'وانت بار و نیسان بار', 
         'حمل سریع و ایمن بارهای سبک و متوسط با ناوگان مجهز', 
         'ناوگان مجهز به نیسان و وانت‌های پتو دار مخصوص اسباب‌کشی سبک و سریع با نازل‌ترین قیمت سطح شهر.',
         'با ناوگان بزرگ و مجهز مجهز به انواع پتو و ضربه‌گیر، جابجایی بارهای سبک‌تر مانند سرویس خواب، کمد، بوفه یا لوازم اداری به راحتی و با هزینه‌ای مناسب‌تر امکان‌پذیر شده است. رانندگان آشنا به مسیرهای سخت و شلوغ ظریف بار، امنیت بار شما را با بیمه نامه تضمین می‌کنند.',
         'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
         'Truck',
         'حمل اثاثیه با وانت و نیسان بار پتو دار | ظریف بار',
         'خدمات وانت بار و نیسان اسباب کشی با راننده باتجربه و پتو دار جهت محافظت از اثاثیه.'),

        ('storage', 
         'انبار و اجاره موقت انبار', 
         'انبار اختصاصی مسقف و روباز با امنیت فوق العاده بالا', 
         'اجاره کانتینرهای اختصاصی و انبارهای مسقف چندضلعی تحت پوشش بیمه و مجهز به دوربین مداربسته شبانه‌روزی.',
         'در صورت نیاز به زمان اضافه برای آماده شدن ملک جدید یا سفر به خارج از کشور، می‌توانید لوازم و اثاثیه خود را در انبارهای کاملاً اختصاصی، بهداشتی و ایمن ما در ابعاد گوناگون امانت بگذارید. تمام انبارها کلید دست مشتری بوده، مجهز به دزدگیر و سیستم‌های اطفای حریق هوشمند و نگهبانی ۲۴ ساعته می‌باشند.',
         'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
         'Warehouse',
         'اجاره انبار موقت اثاثیه منزل و لوازم اداری | ظریف بار',
         'بهترین انبارهای اختصاصی کانکس و کانتینر مسقف جهت دپو و نگهداری وسایل با امنیت عالی کلید شخصی.')
    `);
  }

  const postCount = (await dbInstance.get("SELECT COUNT(*) as count FROM posts")) as { count: number };
  if (postCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO posts (title, slug, content, image_url, status, category_id, author_id, seo_title, seo_description) 
      VALUES 
        ('کامل‌ترین راهنمای اسباب‌کشی بی‌دردسر در شهر تهران', 
         'complete-moving-guide-tehran', 
         'جابجایی و اثاث‌کشی همواره یکی از پراسترس‌ترین مراحل زندگی برای افراد به‌شمار می‌رود. در این مطلب جامع، گام‌به‌گام راه‌های کاهش استرس، زمان‌بندی مناسب، نحوه صحیح بسته‌بندی اقلام شکستنی و چگونگی انتخاب بهترین شرکت باربری مثل ظریف بار را بررسی می‌کنیم. اسباب کشی حرفه‌ای باید از ۲ هفته قبل با تفکیک وسایل دور ریختنی شروع شود. جعبه‌های مشخص و برچسب‌گذاری شده کار را بسیار روان خواهند کرد.',
         'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
         'published', 1, 1,
         'راهنمای فوت و فن اسباب کشی آسان و سریع | ظریف بار',
         'چگونه یک اسباب کشی بدون دردسر و سازماندهی شده داشته باشیم؟ ترفندهای بسته بندی و برنامه ریزی قبل جابجایی.'),
         
        ('نحوه چیدمان اثاثیه بعد از جابجایی در خانه جدید', 
         'organizing-new-home-after-moving', 
         'پس از تخلیه وسایل در خانه جدید، با کوهی از کارتن‌ها مواجه می‌شوید. برای شروعی عالی، بهتر است ابتدا خوابگاه و آشپزخانه را راه‌اندازی کنید. چیدن وسایل آشپزخانه اولویت دارد چون زندگی روزمره در آن چرخ می‌خورد. سپس با آرامش به سراغ پذیرایی و چیدمان مبل‌ها بروید. در این مقاله به چگونگی جانمایی سریع وسایل بر اساس اصول دکوراسیون و بهینه‌سازی فضا می‌پردازیم.',
         'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
         'published', 2, 1,
         'نکات طلایی چیدمان وسایل خانه بعد از جابجایی',
         'چگونه وسایل خود را پس از اسباب کشی سریع و منظم در خانه جدید بچینیم؟ اولویت بندی باز کردن کارتن ها.'),

        ('اصول جابجایی لوازم سنگین؛ سایدبای‌ساید و پیانو', 
         'heavy-items-moving-principles', 
         'حمل وسایلی نظیر ساید‌بای‌ساید، تردمیل، ماشین لباس‌شویی و پیانو علاوه بر توان فیزیکی بالا، نیاز مبرم به تخصص و ابزارهای خاص دارد. ضربه زدن به لولای یخچال یا بدنه ظریف پیانو خسارات سنگین چند ده میلیونی بر جای خواهند گذاشت. در این مقاله به شما آموزش می‌دهیم که چرا همکاری با کارگران مجرب شرکت‌های باربری تنها راه عاقلانه بسته‌بندی و انتقال این قبیل وسایل گران‌قیمت است.',
         'https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800',
         'published', 3, 2,
         'چگونه وسایل سنگین منزل را بدون خسارت جابجا کنیم؟',
         'ترفندهای جابجایی ساید بای ساید و اجسام سنین در راه پله های تنگ با کمک نیروی توانمند و متخصص.')
    `);
  }

  const menuCount = (await dbInstance.get("SELECT COUNT(*) as count FROM menus")) as { count: number };
  if (menuCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO menus (title, url, sort_order) 
      VALUES 
        ('صفحه اصلی', '/', 1),
        ('خدمات ما', '/services', 2),
        ('وبلاگ', '/blog', 3),
        ('درباره ما', '/about', 4),
        ('تماس با ما', '/contact', 5)
    `);
  }

  const pagesCount = (await dbInstance.get("SELECT COUNT(*) as count FROM pages")) as { count: number };
  if (pagesCount.count === 0) {
    const homeContent = {
      badge: "رتبه نخست جلب رضایت مشتری در صنف حمل‌ونقل تهران سال ۱۴۰۴",
      title: "اسباب‌کشی آسان و بی‌دردسر",
      blue_title: "بی‌دردسر",
      description: "شرکت بزرگ ما با کادر مجرب، خودروهای مسقف ضربه‌گیر دار مجهز و نازل‌ترین قیمت مصوب صنف، آرامش خاطر را هنگام بارگیری، بسته‌بندی، حمل اقلام سنگین نظیر گاوصندوق و پیانو برای شما به ارمغان می‌آورد.",
      quick_alert: "تخفیف ویژه ۱۵ درصدی رزرو آنلاین به همراه ۱۰۰ میلیون تومان بیمه مسئولیت مدنی کالا به صورت کاملاً رایگان!",
      video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
      hero_image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
      stat_1_num: "۱۰,۰۰۰+",
      stat_1_lbl: "پروژه موفق اسباب‌کشی در تهران",
      stat_2_num: "۱۵۰+",
      stat_2_lbl: "راننده و کارگر بسته‌بندی مجرب",
      stat_3_num: "۱۰۰٪",
      stat_3_lbl: "بیمه کامل بار با ضمانت بیمه ایران",
      stat_4_num: "۴ کلان‌شهر",
      stat_4_lbl: "پوشش سراسری بین شهری روزانه"
    };

    const aboutContent = {
      subtitle: "پنج دهه همراهی صادقانه و خدمت‌رسانی هوشمندانه به مردم شریف تهران",
      heading: "آرمان ما کیفیت عالی و جلب اعتماد اسباب‌کشی لوکس است",
      paragraph_1: "شرکت بزرگ ما از اوایل دهه ۷۰ شمسی فعالیت رسمی خود را در تهران بزرگ در حوزه ترابری درون‌شهری آغاز کرد. در طی نیم قرن این شرکت همواره در مسیر توسعه فناوری قدم برداشته و توانسته با ایجاد کلینیک کادری مجرب متشکل از ۱۰۰ راننده دوره دیده و ۲۰۰ کارگر ورزیده بسته‌بندی، بیش از چهل و پنج هزار خانوار تهرانی را بدون حتی یک خسارت فیزیکی یا رفتاری جابجا نماید.",
      paragraph_2: "تضاد اصلی کار ما با باربری‌های خرده‌پا در تعهد کامل مدنی و صدور سند پیش فاکتور قطعی نهفته است. در شرکت ما هیچ راننده‌ای حق چانه‌زنی بعد از اتمام باربری را ندارد، تعهد تا تحویل کامل گلدان‌ها و بلورجات به پای تیم مجزای ناظر کادر فنی ثبت گردیده است."
    };

    const contactContent = {
      subtitle: "پاسخگویی شبانه‌روزی و بدون تعطیلی جهت رفاه حال همشهریان محترم"
    };

    const privacyContent = {
      subtitle: "آخرین بروزرسانی مقررات مدنی اسباب‌کشی: خرداد ماه ۱۴۰۵",
      intro: "کاربر گرامی، ورود به وب‌سایت ما و استفاده از خدمات مشاوره، محاسبه‌گر هوشمند آنلاین، و رزرو نوبت تلفنی یا اینترنتی به معنای آگاهی کامل و پذیرش بی قید و شرط قوانین درج شده در این صفحه می‌باشد. هدف ما آسودگی خاطر کامل شما در طول اسباب‌کشی و حفظ امانت به مطمئن‌ترین شکل ممکن است.",
      rules_heading: "قوانین عمومی حمل‌ونقل و صدور فاکتور",
      rule_1: "**قیمت‌های نهایی صادر شده**: مبالغی که کارشناسان پشتیبانی پس از ثبت استعلام محاسبه‌گر هوشمند به صورت فاکتور کتبی یا پیامکی تایید می‌کنند، قطعی بوده و رانندگان به هیچ عنوان مجاز به دریافت مبالغ اضافه تحت عناوین «انعام، سختی راه پله، پیاده‌روی طولانی» نخواهند بود مگر با هماهنگی مدیریت.",
      rule_2: "**لغو نوبت رزرو شده**: مشتریان محترم در صورت نیاز به تغییر زمان اسباب‌کشی یا لغو نوبت، موظف هستند حداقل ۲۴ ساعت قبل از اعزام کادر جابجایی موضوع را به کارشناسان اطلاع دهند.",
      rule_3: "**کالاهای گران‌قیمت خاص**: جابجایی اقلام بسیار گران‌قیمت اعم از وجوه نقد، جواهرات، اسناد ملکی گاوصندوق، لپ‌تاپ‌های شخصی و طلاجات باید توسط خود کارفرما انجام گیرد. کادر فنی به هیچ عنوان مسئولیت انتقال موارد شخصی درون کیف‌های مسافرتی را برعهده نمی‌گیرد.",
      insurance_heading: "بیمه نامه و تضمین خسارت",
      insurance_text: "تمامی اثاثیه‌های حمل شده توسط ناوگان کامیونت‌های مسقف، تحت پوشش **بیمه نامه معتبر البرز یا ایران** تا سقف مشخص شده در فاکتور قرار می‌گیرند. در صورت بروز هرگونه آسیب به وسایلی که بسته‌بندی آنها توسط تیم حرفه‌ای و با تایید ناظر کادر فنی انجام شده باشد، شرکت موظف به پرداخت غرامت معادل قیمت روز کالا یا تعمیر تخصصی آن خواهد بود.",
      privacy_heading: "سیاست حفظ حریم خصوصی کاربران",
      privacy_text: "مجموعه ما نسبت به حفظ اطلاعات خصوصی مشتریان خود (مانند نام خانوادگی، شماره‌های همراه، آدرس‌های مبدا و مقصد) کاملاً متعهد است. تمامی اطلاعات وارد شده در وب‌سایت در سرورهای امن نگهداری شده و فقط برای فرآیند اعزام خودرو، صدور بیمه نامه حمل بار و بهبود کیفیت خدمات مورد استفاده قرار می‌گیرند. ما هرگز داده‌های شما را در اختیار اشخاص ثالثِ تبلیغاتی قرار نخواهیم داد.",
      box_alert: "در صورت بروز هرگونه تعارض نامتعارف با پرسنل صحنه جابجایی قبل از هرگونه پرداخت وجه با شماره بازرسی مرکزی تماس حاصل فرمایید تا کارشناس شعبه فوراً مداخله کند."
    };

    await dbInstance.run(`
      INSERT INTO pages (slug, title, content_json, image_url, seo_title, seo_description)
      VALUES 
        ('home', 'صفحه اصلی', ?, 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', 'بهترین اتوبار و باربری تهران | خدمات اسباب کشی مدرن', 'اولین و مجرب‌ترین ناوگان حمل مبلمان و لوازم لوکس با پتو و کارتن ضربه گیر'),
        ('about', 'درباره ما', ?, 'https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800', 'درباره ما | شرکت حمل و نقل و اتوبار تهران', 'آشنایی با تاریخچه تضاد مدنی و کادر رانندگان مجرب شرکت تهران'),
        ('contact', 'تماس با ما', ?, NULL, 'تماس با پشتیبانی باربری و اسباب کشی', 'شماره تلفن های گویا و ادرس دفاتر و نمایندگی های کل تهران'),
        ('privacy', 'حریم خصوصی و قوانین', ?, NULL, 'ضوابط، مقررات و حریم خصوصی', 'بیمه‌نامه دولتی البرز و ضوابط پیش فاکتور قطعی و تعهدات حقوقی اسباب کشی')
    `, [
      JSON.stringify(homeContent),
      JSON.stringify(aboutContent),
      JSON.stringify(contactContent),
      JSON.stringify(privacyContent)
    ]);
  }
}

export function getDB(): Database {
  if (!dbInstance) throw new Error("DB not initialized");
  return dbInstance;
}

async function migratePlaintextPasswords(db: Database) {
  const users = await db.all("SELECT id, password FROM users") as { id: number; password: string }[];
  for (const user of users) {
    if (!isPasswordHashed(user.password)) {
      const hashed = await hashPassword(user.password);
      await db.run("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id]);
    }
  }
}