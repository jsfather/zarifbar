import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { hashPassword, isPasswordHashed, verifyPassword } from './auth.js';

let dbInstance: Database | null = null;

export async function initDB() {
  const dataDir = path.resolve(process.env.DATA_DIR || process.cwd());
  fs.mkdirSync(dataDir, { recursive: true });

  dbInstance = await open({
    filename: path.join(dataDir, 'zarifbar.db'),
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
  await rotateKnownDefaultPasswords(dbInstance);

  const userCount = (await dbInstance.get("SELECT COUNT(*) as count FROM users")) as { count: number };
  if (userCount.count === 0) {
    const adminPassword = getInitialPassword('ADMIN_DEFAULT_PASSWORD', 'admin123');
    const writerPassword = getInitialPassword('WRITER_DEFAULT_PASSWORD', 'writerpassword');
    const adminHash = await hashPassword(adminPassword);
    const writerHash = await hashPassword(writerPassword);
    await dbInstance.run(`
      INSERT INTO users (username, password, role, name) 
      VALUES 
        ('admin', ?, 'admin', 'مدیر اسپاب‌چی'),
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
      { key: 'site_title', value: 'اسپاب‌چی | باربری، اسباب‌کشی، وانت و نیسان در تهران' },
      { key: 'site_description', value: 'اسپاب‌چی خدمات حمل اثاثیه، بسته‌بندی، اعزام نیروی جابجایی، وانت بار و نیسان بار را در تهران ارائه می‌دهد.' },
      { key: 'phone', value: '02144177827' },
      { key: 'phone_alt', value: '02126117092' },
      { key: 'email', value: '' },
      { key: 'address', value: '' },
      { key: 'seo_keywords', value: 'اسباب‌کشی، اسپاب‌چی، اتوبار تهران، وانت بار، نیسان بار، بسته‌بندی اثاثیه، کارگر جابجایی' },
      { key: 'instagram', value: '' },
      { key: 'telegram', value: '' },
      { key: 'working_hours', value: '۷ روز هفته، در طول روز  در خدمت شما هستیم' },
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
         'خدمات نوین و لوکس بسته‌بندی تخصصی‌', 
         'بسته‌بندی دقیق تمام لوازم منزل با متریال باکیفیت کارتن بابل‌رپ و سلفون ضدضربه به منظور تضمین سلامت کامل بار شما.',
         'امروزه بسته‌بندی لوازم قبل از اسباب‌کشی یکی از مهم‌ترین دغدغه‌های هر خانواده است. تیم ما با استفاده از کارتن‌های ۵ لایه مستحکم، نایلون‌های حباب‌دار (بابل رپ) ضخیم، فوم‌های ضربه‌گیر و سلفون‌های مخصوص، تمامی مبلمان، ظروف کریستال و لوازم الکترونیکی شما را صد در صد بیمه و ضمانت می‌کند تا در حین جابجایی کوچکترین خط و خشی بر روی آن‌ها ایجاد نشود.',
         '',
         'Package',
         'خدمات بسته‌بندی اثاثیه منزل در تهران | اسپاب‌چی',
         'بسته‌بندی اثاثیه با کارتن پنج لایه، بابل‌رپ و نیروی متخصص توسط اسپاب‌چی در تهران.'),

        ('workers', 
         'کارگر خالی و نیروی جابجایی', 
         'کارگران تنومند، مودب و متخصص جابجایی اجسام سنگین', 
         'اعزام فوری نیروهای ماهر و ورزیده بدون ماشین جهت تخلیه بار، بارگیری مجدد، چیدمان و جابجایی بین طبقات.',
         'اگر خودرو تهیه کرده‌اید اما نیازمند نیروی توانمند هستید، نگران نباشید. نیروهای ورزیده، توانمند و کاملا خوش‌برخورد اسپاب‌چی با بهترین تجهیزات حمل تخصصی گاوصندوق، سایدبای‌ساید، تردمیل، و پیانو، سخت‌ترین جابجایی‌ها را برای شما ساده می‌کنند. ما سلامتی اثاثیه گران‌بهای شما را تضمین می‌کنیم.',
         '',
         'Users',
         'اعزام کارگر اثاث‌کشی و نیروی جابجایی | اسپاب‌چی',
         'اعزام کارگر جابجایی و حمل بار در تهران. مناسب برای تخلیه، بارگیری و چیدمان.'),

        ('transport', 
         'وانت بار و نیسان بار', 
         'حمل سریع و ایمن بارهای سبک و متوسط با ناوگان مجهز', 
         'ناوگان مجهز به نیسان و وانت‌های پتو دار مخصوص اسباب‌کشی سبک و سریع با نازل‌ترین قیمت سطح شهر.',
         'با ناوگان بزرگ و مجهز مجهز به انواع پتو و ضربه‌گیر، جابجایی بارهای سبک‌تر مانند سرویس خواب، کمد، بوفه یا لوازم اداری به راحتی و با هزینه‌ای مناسب‌تر امکان‌پذیر شده است. رانندگان آشنا به مسیرهای سخت و شلوغ اسپاب‌چی، امنیت بار شما را با بیمه نامه تضمین می‌کنند.',
         '',
         'Truck',
         'وانت بار و نیسان بار در تهران | اسپاب‌چی',
         'خدمات وانت بار و نیسان بار برای حمل اثاثیه و بارهای سبک در تهران.'),

        ('storage', 
         'انبار و اجاره موقت انبار', 
         'انبار اختصاصی مسقف و روباز با امنیت فوق العاده بالا', 
         'اجاره کانتینرهای اختصاصی و انبارهای مسقف چندضلعی تحت پوشش بیمه و مجهز به دوربین مداربسته.',
         'در صورت نیاز به زمان اضافه برای آماده شدن ملک جدید یا سفر به خارج از کشور، می‌توانید لوازم و اثاثیه خود را در انبارهای کاملاً اختصاصی، بهداشتی و ایمن ما در ابعاد گوناگون امانت بگذارید. تمام انبارها کلید دست مشتری بوده، مجهز به دزدگیر و سیستم‌های اطفای حریق هوشمند و نگهبانی ۲۴ ساعته می‌باشند.',
         '',
         'Warehouse',
         'انبار موقت اثاثیه منزل و لوازم اداری | اسپاب‌چی',
         'اجاره انبار موقت برای نگهداری اثاثیه در تهران، با امنیت و نگهبانی.')
    `);
  }

  const postCount = (await dbInstance.get("SELECT COUNT(*) as count FROM posts")) as { count: number };
  if (postCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO posts (title, slug, content, image_url, status, category_id, author_id, seo_title, seo_description) 
      VALUES 
        ('کامل‌ترین راهنمای اسباب‌کشی بی‌دردسر در شهر تهران', 
         'complete-moving-guide-tehran', 
         'جابجایی و اثاث‌کشی همواره یکی از پراسترس‌ترین مراحل زندگی برای افراد به‌شمار می‌رود. در این مطلب جامع، گام‌به‌گام راه‌های کاهش استرس، زمان‌بندی مناسب، نحوه صحیح بسته‌بندی اقلام شکستنی و چگونگی انتخاب بهترین شرکت باربری مثل اسپاب‌چی را بررسی می‌کنیم. اسباب کشی حرفه‌ای باید از ۲ هفته قبل با تفکیک وسایل دور ریختنی شروع شود. جعبه‌های مشخص و برچسب‌گذاری شده کار را بسیار روان خواهند کرد.',
         '',
         'published', 1, 1,
         'راهنمای فوت و فن اسباب کشی آسان و سریع | اسپاب‌چی',
         'چگونه یک اسباب کشی بدون دردسر و سازماندهی شده داشته باشیم؟ ترفندهای بسته بندی و برنامه ریزی قبل جابجایی.'),
         
        ('نحوه چیدمان اثاثیه بعد از جابجایی در خانه جدید', 
         'organizing-new-home-after-moving', 
         'پس از تخلیه وسایل در خانه جدید، با کوهی از کارتن‌ها مواجه می‌شوید. برای شروعی عالی، بهتر است ابتدا خوابگاه و آشپزخانه را راه‌اندازی کنید. چیدن وسایل آشپزخانه اولویت دارد چون زندگی روزمره در آن چرخ می‌خورد. سپس با آرامش به سراغ پذیرایی و چیدمان مبل‌ها بروید. در این مقاله به چگونگی جانمایی سریع وسایل بر اساس اصول دکوراسیون و بهینه‌سازی فضا می‌پردازیم.',
         '',
         'published', 2, 1,
         'نکات طلایی چیدمان وسایل خانه بعد از جابجایی',
         'چگونه وسایل خود را پس از اسباب کشی سریع و منظم در خانه جدید بچینیم؟ اولویت بندی باز کردن کارتن ها.'),

        ('اصول جابجایی لوازم سنگین؛ سایدبای‌ساید و پیانو', 
         'heavy-items-moving-principles', 
         'حمل وسایلی نظیر ساید‌بای‌ساید، تردمیل، ماشین لباس‌شویی و پیانو علاوه بر توان فیزیکی بالا، نیاز مبرم به تخصص و ابزارهای خاص دارد. ضربه زدن به لولای یخچال یا بدنه ظریف پیانو خسارات سنگین چند ده میلیونی بر جای خواهند گذاشت. در این مقاله به شما آموزش می‌دهیم که چرا همکاری با کارگران مجرب شرکت‌های باربری تنها راه عاقلانه بسته‌بندی و انتقال این قبیل وسایل گران‌قیمت است.',
         '',
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
      badge: "خدمات اسباب‌کشی و حمل بار در تهران",
      title: "اسباب‌کشی آسان و بی‌دردسر",
      blue_title: "بی‌دردسر",
      description: "اسپاب‌چی خدمات حمل اثاثیه، بسته‌بندی، اعزام نیروی جابجایی، وانت بار و نیسان بار را در تهران ارائه می‌دهد. هزینه خدمات با توجه به مسیر، نوع خودرو، تعداد نیرو و خدمات موردنیاز محاسبه می‌شود.",
      quick_alert: "برای دریافت برآورد اولیه هزینه اسباب‌کشی، فرم محاسبه را تکمیل کنید.",
      video_url: "",
      hero_image: "",
      stat_1_num: "",
      stat_1_lbl: "بسته‌بندی تخصصی",
      stat_2_num: "",
      stat_2_lbl: "وانت و نیسان بار",
      stat_3_num: "",
      stat_3_lbl: "اعزام نیروی جابجایی",
      stat_4_num: "",
      stat_4_lbl: "خدمات در تهران"
    };

    const aboutContent = {
      subtitle: "خدمات حمل‌ونقل و اسباب‌کشی در تهران",
      heading: "اسپاب‌چی چه خدماتی ارائه می‌دهد؟",
      paragraph_1: "اسپاب‌چی یک مجموعه خدمات حمل‌ونقل و اسباب‌کشی در تهران است که خدماتی مانند حمل اثاثیه منزل، بسته‌بندی، اعزام نیروی حمل، وانت بار و نیسان بار را ارائه می‌دهد. هدف مجموعه این است که مشتری پیش از ثبت نهایی سفارش، اطلاعات روشنی درباره نوع خدمت، عوامل مؤثر بر هزینه و نحوه اعزام دریافت کند.",
      paragraph_2: "هزینه نهایی اسباب‌کشی بسته به عوامل مختلفی از جمله مسیر، نوع خودرو، تعداد نیروی کار، طبقه، وجود آسانسور، نوع و حجم اثاثیه و سرویس‌های اضافه تعیین می‌شود. مشتریان پس از ارائه اطلاعات سفارش، برآورد اولیه هزینه را دریافت کرده و قبل از شروع کار، قیمت نهایی تأیید می‌شود."
    };

    const contactContent = {
      subtitle: "پاسخگویی  و بدون تعطیلی جهت رفاه حال همشهریان محترم"
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
        ('home', 'صفحه اصلی', ?, '', 'بهترین اتوبار و باربری تهران | خدمات اسباب کشی مدرن', 'اولین و مجرب‌ترین ناوگان حمل مبلمان و لوازم لوکس با پتو و کارتن ضربه گیر'),
        ('about', 'درباره ما', ?, '', 'درباره ما | شرکت حمل و نقل و اتوبار تهران', 'آشنایی با تاریخچه تضاد مدنی و کادر رانندگان مجرب شرکت تهران'),
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

function getInitialPassword(envName: 'ADMIN_DEFAULT_PASSWORD' | 'WRITER_DEFAULT_PASSWORD', developmentDefault: string) {
  const configured = process.env[envName];
  if (!configured && process.env.NODE_ENV === 'production') {
    throw new Error(`${envName} is required when creating the initial production users.`);
  }
  if (configured && configured.length < 12) {
    throw new Error(`${envName} must contain at least 12 characters.`);
  }
  return configured || developmentDefault;
}

async function rotateKnownDefaultPasswords(db: Database) {
  const accounts = [
    {
      username: 'admin',
      knownDefault: 'admin123',
      replacement: process.env.ADMIN_DEFAULT_PASSWORD,
      envName: 'ADMIN_DEFAULT_PASSWORD',
    },
    {
      username: 'writer',
      knownDefault: 'writerpassword',
      replacement: process.env.WRITER_DEFAULT_PASSWORD,
      envName: 'WRITER_DEFAULT_PASSWORD',
    },
  ];

  for (const account of accounts) {
    const user = await db.get(
      'SELECT id, password FROM users WHERE username = ?',
      [account.username]
    ) as { id: number; password: string } | undefined;

    if (!user || !(await verifyPassword(account.knownDefault, user.password))) continue;

    if (!account.replacement) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`${account.envName} is required while the ${account.username} account uses its development password.`);
      }
      continue;
    }

    if (account.replacement.length < 12) {
      throw new Error(`${account.envName} must contain at least 12 characters.`);
    }

    await db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [await hashPassword(account.replacement), user.id]
    );
    console.log(`[security] Rotated the known default password for ${account.username}.`);
  }
}
