import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { initDB, getDB } from './server/db.js';
import {
  AuthRequest,
  verifyPassword,
  signToken,
  toPublicUser,
  requireAuth,
  requireAdmin,
  optionalAuth,
  checkLoginRateLimit,
  clearLoginAttempts,
  hashPassword,
} from './server/auth.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}

const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
]);
const MAX_UPLOAD_BYTES = 150 * 1024 * 1024; // 150MB for image/video upload

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_UPLOAD_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های تصویری و ویدیویی مجاز هستند.'));
    }
  },
});

async function startServer() {
  try {
    await initDB();
    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.use('/uploads', express.static(uploadDir));

  // --- Public write endpoints (forms) ---
  app.post("/api/upload", requireAuth, (req, res) => {
    upload.single('file')(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'خطا در آپلود فایل.';
        return res.status(400).json({ error: message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
      res.json({ url: `/uploads/${req.file.filename}` });
    });
  });

  app.post("/api/login", async (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkLoginRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر تلاش کنید.',
      });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'نام کاربری و کلمه عبور الزامی است.' });
    }

    try {
      const db = await getDB();
      const user = await db.get(
        "SELECT id, username, role, name, password FROM users WHERE username = ?",
        [username]
      ) as { id: number; username: string; role: 'admin' | 'writer'; name: string; password: string } | undefined;

      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json({ success: false, message: "نام کاربری یا کلمه عبور وارد شده نامعتبر است." });
      }

      clearLoginAttempts(clientIp);
      const publicUser = toPublicUser(user);
      const token = signToken(publicUser);
      res.json({ success: true, user: publicUser, token });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, message });
    }
  });

  app.get("/api/auth/me", requireAuth, (req: AuthRequest, res) => {
    res.json({ success: true, user: req.user });
  });

  // --- Settings ---
  app.get("/api/settings", async (_req, res) => {
    try {
      const db = await getDB();
      const rows = await db.all("SELECT key, value FROM settings") as { key: string; value: string }[];
      const settingsMap: Record<string, string> = {};
      rows.forEach(row => { settingsMap[row.key] = row.value; });
      res.json(settingsMap);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.put("/api/settings", requireAuth, requireAdmin, async (req, res) => {
    const updatedSettings = req.body;
    try {
      const db = await getDB();
      for (const [key, val] of Object.entries(updatedSettings)) {
        await db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, String(val)]);
      }
      res.json({ success: true, message: "تنظیمات با موفقیت ذخیره شدند." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Services (public read, admin write) ---
  app.get("/api/services", async (_req, res) => {
    try {
      const db = await getDB();
      const services = await db.all("SELECT * FROM services");
      res.json(services);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
      const db = await getDB();
      const service = await db.get("SELECT * FROM services WHERE slug = ?", [slug]);
      if (service) res.json(service);
      else res.status(404).json({ error: "خدمت مورد نظر یافت نشد." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.put("/api/services/:slug", requireAuth, requireAdmin, async (req, res) => {
    const { slug } = req.params;
    const { name, title, description, content, image_url, icon_name, seo_title, seo_description } = req.body;
    try {
      const db = await getDB();
      const result = await db.run(`
        UPDATE services 
        SET name = ?, title = ?, description = ?, content = ?, image_url = ?, icon_name = ?, seo_title = ?, seo_description = ?
        WHERE slug = ?
      `, [name, title, description, content, image_url, icon_name, seo_title, seo_description, slug]);

      if (result.changes && result.changes > 0) {
        res.json({ success: true, message: "خدمت مورد نظر با موفقیت بروزرسانی شد." });
      } else {
        res.status(404).json({ success: false, error: "خدمت مورد نظر یافت نشد." });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Categories ---
  app.get("/api/categories", async (_req, res) => {
    try {
      const db = await getDB();
      res.json(await db.all("SELECT * FROM categories"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/categories", requireAuth, requireAdmin, async (req, res) => {
    const { name, slug } = req.body;
    try {
      const db = await getDB();
      await db.run("INSERT INTO categories (name, slug) VALUES (?, ?)", [name, slug]);
      res.json({ success: true, message: "دسته بندی جدید ایجاد شد." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const db = await getDB();
      await db.run("DELETE FROM categories WHERE id = ?", [id]);
      res.json({ success: true, message: "دسته بندی با موفقیت حذف گردید." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Blog posts ---
  app.get("/api/posts", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const db = await getDB();
      const baseQuery = `
        SELECT p.*, c.name as category_name, u.name as author_name 
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.author_id = u.id
      `;
      const posts = req.user
        ? await db.all(`${baseQuery} ORDER BY p.id DESC`)
        : await db.all(`${baseQuery} WHERE p.status = 'published' ORDER BY p.id DESC`);
      res.json(posts);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/posts/:slug", optionalAuth, async (req: AuthRequest, res) => {
    const { slug } = req.params;
    try {
      const db = await getDB();
      const post = await db.get(`
        SELECT p.*, c.name as category_name, u.name as author_name 
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.slug = ?
      `, [slug]);

      if (!post) return res.status(404).json({ error: "مطلب یافت نشد" });
      if (!req.user && post.status !== 'published') {
        return res.status(404).json({ error: "مطلب یافت نشد" });
      }
      res.json(post);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/posts", requireAuth, async (req: AuthRequest, res) => {
    const { title, slug, content, image_url, status, category_id, author_id, seo_title, seo_description } = req.body;
    try {
      const db = await getDB();
      await db.run(`
        INSERT INTO posts (title, slug, content, image_url, status, category_id, author_id, seo_title, seo_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title, slug, content, image_url,
        status || 'published',
        category_id,
        author_id || req.user!.id,
        seo_title, seo_description,
      ]);
      res.json({ success: true, message: "مطلب با موفقیت ذخیره گردید." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.put("/api/posts/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, image_url, status, category_id, seo_title, seo_description } = req.body;
    try {
      const db = await getDB();
      await db.run(`
        UPDATE posts 
        SET title = ?, slug = ?, content = ?, image_url = ?, status = ?, category_id = ?, seo_title = ?, seo_description = ?
        WHERE id = ?
      `, [title, slug, content, image_url, status, category_id, seo_title, seo_description, id]);
      res.json({ success: true, message: "مقاله با موفقیت بروزرسانی شد." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/posts/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const db = await getDB();
      await db.run("DELETE FROM posts WHERE id = ?", [id]);
      res.json({ success: true, message: "مقاله با موفقیت حذف شد." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Quotes ---
  app.get("/api/quotes", requireAuth, requireAdmin, async (_req, res) => {
    try {
      const db = await getDB();
      res.json(await db.all("SELECT * FROM quotes ORDER BY id DESC"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    const { full_name, phone, origin_city, dest_city, moving_date, service_type, has_elevator, floors, estimated_price, description } = req.body;
    if (!full_name?.trim() || !phone?.trim()) {
      return res.status(400).json({ success: false, error: 'نام و شماره تماس الزامی است.' });
    }
    try {
      const db = await getDB();
      const result = await db.run(`
        INSERT INTO quotes (full_name, phone, origin_city, dest_city, moving_date, service_type, has_elevator, floors, estimated_price, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        full_name.trim(), phone.trim(),
        origin_city || '', dest_city || '', moving_date || '',
        service_type || '', has_elevator || 'no', floors || 1,
        estimated_price || 0, description || '',
      ]);
      res.json({ success: true, id: result.lastID, message: "استعلام هزینه با موفقیت ثبت شد و همکاران بزودی با شما تماس می‌گیرند." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.put("/api/quotes/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const db = await getDB();
      await db.run("UPDATE quotes SET status = ? WHERE id = ?", [status, id]);
      res.json({ success: true, message: "وضعیت استعلام با موفقیت تغییر یافت." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/quotes/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const db = await getDB();
      await db.run("DELETE FROM quotes WHERE id = ?", [id]);
      res.json({ success: true, message: "درخواست با موفقیت حذف گردید." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Contacts ---
  app.get("/api/contacts", requireAuth, requireAdmin, async (_req, res) => {
    try {
      const db = await getDB();
      res.json(await db.all("SELECT * FROM contacts ORDER BY id DESC"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    const { name, phone, message } = req.body;
    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ success: false, error: 'نام و شماره تماس الزامی است.' });
    }
    try {
      const db = await getDB();
      await db.run("INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?)", [
        name.trim(), phone.trim(), message?.trim() || '',
      ]);
      res.json({ success: true, message: "پیام شما دریافت شد. در اسرع وقت پاسخگوی شما خواهیم بود." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.put("/api/contacts/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const db = await getDB();
      await db.run("UPDATE contacts SET status = ? WHERE id = ?", [status, id]);
      res.json({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/contacts/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const db = await getDB();
      await db.run("DELETE FROM contacts WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Menus ---
  app.get("/api/menus", async (_req, res) => {
    try {
      const db = await getDB();
      res.json(await db.all("SELECT * FROM menus ORDER BY sort_order ASC"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.put("/api/menus", requireAuth, requireAdmin, async (req, res) => {
    const items = req.body;
    try {
      const db = await getDB();
      await db.run("BEGIN TRANSACTION");
      for (const item of items) {
        await db.run(
          "UPDATE menus SET title = ?, url = ?, sort_order = ? WHERE id = ?",
          [item.title, item.url, item.sort_order, item.id]
        );
      }
      await db.run("COMMIT");
      res.json({ success: true, message: "ترتیب منوها با موفقیت بروزرسانی شد." });
    } catch (err: unknown) {
      const db = await getDB();
      await db.run("ROLLBACK");
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Pages ---
  app.get("/api/pages/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
      const db = await getDB();
      const page = await db.get("SELECT * FROM pages WHERE slug = ?", [slug]);
      res.json(page || {});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.put("/api/pages/:slug", requireAuth, requireAdmin, async (req, res) => {
    const { slug } = req.params;
    const { title, content_json, image_url, seo_title, seo_description } = req.body;
    try {
      const db = await getDB();
      await db.run(`
        INSERT INTO pages (slug, title, content_json, image_url, seo_title, seo_description)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          title = excluded.title,
          content_json = excluded.content_json,
          image_url = excluded.image_url,
          seo_title = excluded.seo_title,
          seo_description = excluded.seo_description
      `, [slug, title, content_json, image_url, seo_title, seo_description]);
      res.json({ success: true, message: "صفحه با موفقیت بروزرسانی شد." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Service videos ---
  app.get("/api/service_videos/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
      const db = await getDB();
      const video = await db.get("SELECT * FROM service_videos WHERE slug = ?", [slug]);
      res.json(video || {});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.put("/api/service_videos/:slug", requireAuth, requireAdmin, async (req, res) => {
    const { slug } = req.params;
    const { video_url } = req.body;
    try {
      const db = await getDB();
      await db.run(`
        INSERT INTO service_videos (slug, video_url)
        VALUES (?, ?)
        ON CONFLICT(slug) DO UPDATE SET video_url = excluded.video_url
      `, [slug, video_url]);
      res.json({ success: true, message: "ویدیو با موفقیت بروزرسانی شد." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  // --- Users (admin only, never expose password hashes) ---
  app.get("/api/users", requireAuth, requireAdmin, async (_req, res) => {
    try {
      const db = await getDB();
      const users = await db.all("SELECT id, username, role, name FROM users ORDER BY id ASC");
      res.json(users);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
    const { username, password, role, name } = req.body;
    if (!username?.trim() || !password?.trim() || !name?.trim()) {
      return res.status(400).json({ success: false, error: 'تمام فیلدها الزامی هستند.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' });
    }
    try {
      const db = await getDB();
      const existing = await db.get("SELECT id FROM users WHERE username = ?", [username.trim()]);
      if (existing) {
        return res.status(400).json({ success: false, error: "نام کاربری تکراری است." });
      }
      const hashed = await hashPassword(password);
      await db.run(
        "INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)",
        [username.trim(), hashed, role || 'writer', name.trim()]
      );
      res.json({ success: true, message: "کاربر جدید با موفقیت ایجاد گردید." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.put("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, password, role, name } = req.body;
    if (!username?.trim() || !name?.trim()) {
      return res.status(400).json({ success: false, error: 'نام و نام کاربری الزامی است.' });
    }
    try {
      const db = await getDB();
      const existing = await db.get("SELECT id FROM users WHERE username = ? AND id != ?", [username.trim(), id]);
      if (existing) {
        return res.status(400).json({ success: false, error: "نام کاربری تکراری است." });
      }

      if (password?.trim()) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' });
        }
        const hashed = await hashPassword(password);
        await db.run(
          "UPDATE users SET username = ?, password = ?, role = ?, name = ? WHERE id = ?",
          [username.trim(), hashed, role, name.trim(), id]
        );
      } else {
        await db.run(
          "UPDATE users SET username = ?, role = ?, name = ? WHERE id = ?",
          [username.trim(), role, name.trim(), id]
        );
      }
      res.json({ success: true, message: "کاربر با موفقیت ویرایش گردید." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const db = await getDB();
      const user = await db.get("SELECT username FROM users WHERE id = ?", [id]) as { username: string } | undefined;
      if (user?.username === 'admin') {
        return res.status(400).json({ success: false, error: "حذف مدیر اصلی سیستم مجاز نیست." });
      }
      await db.run("DELETE FROM users WHERE id = ?", [id]);
      res.json({ success: true, message: "کاربر با موفقیت حذف گردید." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطای سرور';
      res.status(500).json({ success: false, error: message });
    }
  });

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: ['zarrifbar.com', 'www.zarrifbar.com', 'localhost'],
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
