import React, { useState, useEffect } from 'react';
import { Save, Layout, Info, PhoneCall, ShieldAlert, Video, Award, Star, List, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';
import { apiFetch } from '../lib/api';

export default function PageEditor() {
  const [pages, setPages] = useState<Record<string, any>>({});
  const [activePage, setActivePage] = useState('home');
  const [parsedContents, setParsedContents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const slugs = ['home', 'about', 'contact', 'privacy', 'terms'];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const newPages: Record<string, any> = {};
    const newParsedContents: Record<string, any> = {};

    for (const slug of slugs) {
      try {
        const res = await apiFetch(`/api/pages/${slug}`);
        const data = res.ok ? await res.json() : {};
        newPages[slug] = data.slug ? data : { slug, title: slug === 'home' ? 'صفحه اصلی' : slug === 'about' ? 'درباره ما' : slug === 'contact' ? 'تماس با ما' : slug === 'privacy' ? 'حریم خصوصی و قوانین' : 'شرایط و ضوابط', content_json: '{}', image_url: '' };
        
        let contentObj = {};
        if (newPages[slug].content_json) {
          try {
            contentObj = JSON.parse(newPages[slug].content_json);
          } catch (e) {
            contentObj = {};
          }
        }
        newParsedContents[slug] = contentObj;
      } catch (e) {
        newPages[slug] = { slug, title: '', content_json: '{}', image_url: '' };
        newParsedContents[slug] = {};
      }
    }
    setPages(newPages);
    setParsedContents(newParsedContents);
    setLoading(false);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const saveContent = async (slug: string) => {
    setLoading(true);
    const pageObj = { ...pages[slug] };
    const contentToSave = parsedContents[slug] || {};
    pageObj.content_json = JSON.stringify(contentToSave);

    try {
      const res = await apiFetch(`/api/pages/${slug}`, {
        method: 'PUT',
        body: JSON.stringify(pageObj)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`محتوای صفحه ${pages[slug].title || slug} با موفقیت ذخیره و در سایت اعمال شد.`);
      } else {
        showToast('خطا در ذخیره‌سازی اطلاعات.');
      }
    } catch (e) {
      showToast('خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (slug: string, field: string, value: any) => {
    setParsedContents((prev: any) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value
      }
    }));
  };

  const handleMetadataChange = (slug: string, field: string, value: string) => {
    setPages((prev: any) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'home', label: 'صفحه اصلی', icon: Layout, color: 'text-blue-600' },
    { id: 'about', label: 'درباره ما', icon: Info, color: 'text-indigo-600' },
    { id: 'contact', label: 'تماس با ما', icon: PhoneCall, color: 'text-teal-600' },
    { id: 'privacy', label: 'حریم خصوصی و ضوابط', icon: ShieldAlert, color: 'text-amber-500' },
    { id: 'terms', label: 'شرایط و ضوابط', icon: List, color: 'text-purple-500' }
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {toastMessage && (
        <div className="fixed top-6 left-6 z-[9999] bg-slate-900 border border-slate-800 text-white py-3 px-6 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-left duration-200">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section with description */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          ✨ ویرایشگر گرافیکی و زنده محتوای صفحات اصلی با فیلدهای هوشمند
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          تمامی متون، عکس‌ها، آمارها، تیترهای اصلی و حتی ویدیوهای نمایشی صفحات چهارگانه بالا بدون نیاز به کدنویسی و به صورت مستقیم از اینجا قابل تغییر، بازبینی و بازنشانی هستند.
        </p>
      </div>

      {/* Graphical Tabs selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`flex items-center justify-center gap-2.5 p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <span className="text-xs mr-2 font-bold text-slate-500">در حال بروزرسانی و بارگذاری اطلاعات...</span>
        </div>
      )}

      {!loading && pages[activePage] && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-8 animate-in fade-in duration-200">
          
          {/* Page metadata info */}
          <div className="space-y-4 border-b border-gray-50 pb-6">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
              🏷️ تنظیمات پایه صفحه و تایتل سئو
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">تیتر داخلی صفحه ادمین</label>
                <input 
                  type="text"
                  value={pages[activePage].title || ''}
                  onChange={(e) => handleMetadataChange(activePage, 'title', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 focus:bg-white"
                  placeholder="مثلا: صفحه اصلی"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 font-sans">SEO Meta-Title (عنوان تب مرورگر)</label>
                <input 
                  type="text"
                  value={pages[activePage].seo_title || ''}
                  onChange={(e) => handleMetadataChange(activePage, 'seo_title', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 focus:bg-white"
                  placeholder="عنوان مخصوص سئو مرورگر"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">SEO Meta-Description (توضیح تگ سئو)</label>
                <input 
                  type="text"
                  value={pages[activePage].seo_description || ''}
                  onChange={(e) => handleMetadataChange(activePage, 'seo_description', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 focus:bg-white"
                  placeholder="توضیحات کوتاه سئو برای نتایج گوگل"
                />
              </div>
            </div>
          </div>

          {/* PAGE INNER CONTENT FIELDS GENERATION */}
          {activePage === 'home' && (
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-800 border-r-2 border-blue-500 pr-2">🏠 ویرایش جزئیات بخش هیرو و آمار صفحه نخست</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان برتر نشان بالای هدر (Badge)</label>
                  <input 
                    type="text"
                    value={parsedContents.home?.badge || 'رتبه نخست جلب رضایت مشتری در صنف حمل‌ونقل تهران سال ۱۴۰۴'}
                    onChange={(e) => handleFieldChange('home', 'badge', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن بنر فوقانی متحرک (Quick Alert Box)</label>
                  <input 
                    type="text"
                    value={parsedContents.home?.quick_alert || 'تخفیف ویژه ۱۵ درصدی رزرو آنلاین به همراه ۱۰۰ میلیون تومان بیمه مسئولیت مدنی کالا...'}
                    onChange={(e) => handleFieldChange('home', 'quick_alert', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">تیتر اصلی هیرو (بخش اول سفید)</label>
                  <input 
                    type="text"
                    value={parsedContents.home?.title || 'اسباب‌کشی آسان و بی‌دردسر'}
                    onChange={(e) => handleFieldChange('home', 'title', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">تیتر اصلی هیرو (قسمت دوم رنگی آبی)</label>
                  <input 
                    type="text"
                    value={parsedContents.home?.blue_title || 'بی‌دردسر'}
                    onChange={(e) => handleFieldChange('home', 'blue_title', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5">پاراگراف توضیحی هیرو اصلی</label>
                <textarea 
                  rows={3}
                  value={parsedContents.home?.description || ''}
                  onChange={(e) => handleFieldChange('home', 'description', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800"
                  placeholder="توضیحات معرفی شرکت روی هدر اصلی..."
                />
              </div>

              {/* VIDEO URL FIELD FOR HOMEPAGE */}
              <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100/50 space-y-3">
                <div className="flex items-center gap-1 text-xs font-black text-blue-700">
                  <Video className="w-4 h-4" />
                  <span>ویدیو کلیپ معرفی صفحه اصلی</span>
                </div>
                <p className="text-[10px] text-gray-400">یک لینک معتبر مستقیم ویدیو (مانند mp4.) یا لینک آپارات یا نماشا وارد نمایید تا در بخش هدر صفحه اصلی نشان داده شود. اگر خالی بگذارید عکس جایگزین نشان داده خواهد شد.</p>
                <div>
                  <input 
                    type="text"
                    value={parsedContents.home?.video_url || ''}
                    onChange={(e) => handleFieldChange('home', 'video_url', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 text-left"
                    placeholder="https://example.com/intro-video.mp4"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عکس بزرگ هیرو (در صورت لود نشدن ویدیو)</label>
                  <input 
                    type="text"
                    value={parsedContents.home?.hero_image || ''}
                    onChange={(e) => handleFieldChange('home', 'hero_image', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 text-left mb-2"
                    placeholder="آدرس عکس بزرگ هیرو"
                    dir="ltr"
                  />
                  <ImageUploader onUpload={(url) => handleFieldChange('home', 'hero_image', url)} />
                </div>
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 flex items-center justify-center">
                  {parsedContents.home?.hero_image ? (
                    <img src={parsedContents.home.hero_image} alt="پیش‌نمایش تصویر" className="max-h-[140px] rounded-xl object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-400">تصویری آپلود نشده است</span>
                  )}
                </div>
              </div>

              {/* STATS edit */}
              <div className="space-y-4 border-t border-gray-50 pt-6">
                <h5 className="text-xs font-black text-slate-800">📊 ویرایش اعداد و برچسب‌های آمار (تعداد کل یا درصد رضایت)</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <input 
                      type="text"
                      placeholder="آمار ۱ (مثلا: ۱۰,۰۰۰+)"
                      value={parsedContents.home?.stat_1_num || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_1_num', e.target.value)}
                      className="w-full border-b border-gray-200 bg-transparent text-center font-bold text-xs py-1 text-amber-600"
                    />
                    <input 
                      type="text"
                      placeholder="متن آمار ۱"
                      value={parsedContents.home?.stat_1_lbl || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_1_lbl', e.target.value)}
                      className="w-full border-none bg-transparent text-center text-[10px] text-gray-400 font-semibold"
                    />
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <input 
                      type="text"
                      placeholder="آمار ۲ (مثلا: ۱۵۰+)"
                      value={parsedContents.home?.stat_2_num || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_2_num', e.target.value)}
                      className="w-full border-b border-gray-200 bg-transparent text-center font-bold text-xs py-1 text-amber-600"
                    />
                    <input 
                      type="text"
                      placeholder="متن آمار ۲"
                      value={parsedContents.home?.stat_2_lbl || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_2_lbl', e.target.value)}
                      className="w-full border-none bg-transparent text-center text-[10px] text-gray-400 font-semibold"
                    />
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <input 
                      type="text"
                      placeholder="آمار ۳ (مثلا: ۱۰۰٪)"
                      value={parsedContents.home?.stat_3_num || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_3_num', e.target.value)}
                      className="w-full border-b border-gray-200 bg-transparent text-center font-bold text-xs py-1 text-amber-600"
                    />
                    <input 
                      type="text"
                      placeholder="متن آمار ۳"
                      value={parsedContents.home?.stat_3_lbl || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_3_lbl', e.target.value)}
                      className="w-full border-none bg-transparent text-center text-[10px] text-gray-400 font-semibold"
                    />
                  </div>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <input 
                      type="text"
                      placeholder="آمار ۴ (مثلا: ۴ کلان‌شهر)"
                      value={parsedContents.home?.stat_4_num || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_4_num', e.target.value)}
                      className="w-full border-b border-gray-200 bg-transparent text-center font-bold text-xs py-1 text-amber-600"
                    />
                    <input 
                      type="text"
                      placeholder="متن آمار ۴"
                      value={parsedContents.home?.stat_4_lbl || ''}
                      onChange={(e) => handleFieldChange('home', 'stat_4_lbl', e.target.value)}
                      className="w-full border-none bg-transparent text-center text-[10px] text-gray-400 font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'about' && (
            <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-800 border-r-2 border-indigo-500 pr-2">👥 ویرایش کامل محتوای صفحه درباره ما</h4>

              {/* ── بخش ۱: اطلاعات پایه ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">بخش ۱ — معرفی اسپاب‌چی</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">زیرعنوان خاکستری بالای صفحه</label>
                    <input type="text" value={parsedContents.about?.subtitle || ''} onChange={(e) => handleFieldChange('about', 'subtitle', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="خدمات حمل‌ونقل و اسباب‌کشی در تهران" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان فرعی کارت متنی (Heading)</label>
                    <input type="text" value={parsedContents.about?.heading || ''} onChange={(e) => handleFieldChange('about', 'heading', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="اسپاب‌چی چه خدماتی ارائه می‌دهد؟" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">پاراگراف اول</label>
                  <textarea rows={3} value={parsedContents.about?.paragraph_1 || ''} onChange={(e) => handleFieldChange('about', 'paragraph_1', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 leading-relaxed text-justify" placeholder="معرفی کلی اسپاب‌چی..." />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">پاراگراف دوم</label>
                  <textarea rows={3} value={parsedContents.about?.paragraph_2 || ''} onChange={(e) => handleFieldChange('about', 'paragraph_2', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 leading-relaxed text-justify" placeholder="توضیحات بیشتر..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">تصویر صفحه</label>
                    <input type="text" value={pages.about?.image_url || ''} onChange={(e) => handleMetadataChange('about', 'image_url', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 text-left mb-2" dir="ltr" placeholder="/uploads/about.webp" />
                    <ImageUploader onUpload={(url) => handleMetadataChange('about', 'image_url', url)} />
                  </div>
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 flex items-center justify-center">
                    {pages.about?.image_url ? (
                      <img src={pages.about.image_url} alt="پیش‌نمایش" className="max-h-[120px] rounded-xl object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">تصویری آپلود نشده</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <label className="text-xs font-black text-slate-800">🎥 ویدیو درباره ما</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div className="md:col-span-2">
                      <input type="text" placeholder="لینک ویدیو یا آپلود" value={parsedContents.about?.video_url || ''} onChange={(e) => handleFieldChange('about', 'video_url', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" />
                    </div>
                    <VideoUploader onUpload={(url) => handleFieldChange('about', 'video_url', url)} buttonText="آپلود ویدیو" />
                  </div>
                </div>
              </div>

              {/* ── بخش ۲: خدمات ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">بخش ۲ — خدماتی که ارائه می‌دهیم</p>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش خدمات</label>
                  <input type="text" value={parsedContents.about?.services_section_title || ''} onChange={(e) => handleFieldChange('about', 'services_section_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="خدماتی که اسپاب‌چی ارائه می‌دهد" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { numKey: '1', label: 'خدمت ۱ (حمل اثاثیه)' },
                    { numKey: '2', label: 'خدمت ۲ (بسته‌بندی)' },
                    { numKey: '3', label: 'خدمت ۳ (کارگر خالی)' },
                    { numKey: '4', label: 'خدمت ۴ (اجاره انبار)' },
                  ].map(({ numKey, label }) => (
                    <div key={numKey} className="bg-slate-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                      <p className="text-[10px] font-black text-slate-600">{label}</p>
                      <input type="text" value={parsedContents.about?.[`service_${numKey}_title`] || ''} onChange={(e) => handleFieldChange('about', `service_${numKey}_title`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="عنوان خدمت" />
                      <textarea rows={2} value={parsedContents.about?.[`service_${numKey}_desc`] || ''} onChange={(e) => handleFieldChange('about', `service_${numKey}_desc`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="توضیح خدمت" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── بخش ۳: فرآیند سفارش ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-green-700 bg-green-50 px-3 py-1.5 rounded-lg inline-block">بخش ۳ — نحوه ثبت و انجام سفارش</p>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش فرآیند</label>
                  <input type="text" value={parsedContents.about?.process_section_title || ''} onChange={(e) => handleFieldChange('about', 'process_section_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="نحوه ثبت و انجام سفارش" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { numKey: '1', label: 'مرحله ۱' },
                    { numKey: '2', label: 'مرحله ۲' },
                    { numKey: '3', label: 'مرحله ۳' },
                    { numKey: '4', label: 'مرحله ۴' },
                  ].map(({ numKey, label }) => (
                    <div key={numKey} className="bg-slate-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                      <p className="text-[10px] font-black text-slate-600">{label}</p>
                      <input type="text" value={parsedContents.about?.[`step_${numKey}_title`] || ''} onChange={(e) => handleFieldChange('about', `step_${numKey}_title`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="عنوان مرحله" />
                      <textarea rows={2} value={parsedContents.about?.[`step_${numKey}_desc`] || ''} onChange={(e) => handleFieldChange('about', `step_${numKey}_desc`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="توضیح مرحله" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── بخش ۴: عوامل قیمت ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">بخش ۴ — عوامل مؤثر بر هزینه</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش</label>
                    <input type="text" value={parsedContents.about?.pricing_section_title || ''} onChange={(e) => handleFieldChange('about', 'pricing_section_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="عوامل مؤثر بر هزینه اسباب‌کشی" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">توضیح کوتاه زیر عنوان</label>
                    <input type="text" value={parsedContents.about?.pricing_section_desc || ''} onChange={(e) => handleFieldChange('about', 'pricing_section_desc', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="هزینه نهایی پیش از شروع کار تأیید می‌شود." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n}>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">عامل {n}</label>
                      <input type="text" value={parsedContents.about?.[`pricing_factor_${n}`] || ''} onChange={(e) => handleFieldChange('about', `pricing_factor_${n}`, e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder={`عامل ${n}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── بخش ۵: محدوده خدمات ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg inline-block">بخش ۵ — محدوده خدمات در تهران</p>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش</label>
                  <input type="text" value={parsedContents.about?.areas_section_title || ''} onChange={(e) => handleFieldChange('about', 'areas_section_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="محدوده خدمات در تهران" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { numKey: '1', label: 'منطقه ۱ (شمال)' },
                    { numKey: '2', label: 'منطقه ۲ (مرکز)' },
                    { numKey: '3', label: 'منطقه ۳ (غرب)' },
                    { numKey: '4', label: 'منطقه ۴ (شرق/جنوب)' },
                  ].map(({ numKey, label }) => (
                    <div key={numKey} className="bg-slate-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                      <p className="text-[10px] font-black text-slate-600">{label}</p>
                      <input type="text" value={parsedContents.about?.[`area_${numKey}_zone`] || ''} onChange={(e) => handleFieldChange('about', `area_${numKey}_zone`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="نام منطقه (مثلا: شمال تهران)" />
                      <textarea rows={2} value={parsedContents.about?.[`area_${numKey}_areas`] || ''} onChange={(e) => handleFieldChange('about', `area_${numKey}_areas`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="محله‌ها با کاما جدا شوند" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── بخش ۶: شفافیت ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">بخش ۶ — چرا اطلاعات شفاف قبل از شروع کار</p>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش</label>
                  <input type="text" value={parsedContents.about?.transparency_section_title || ''} onChange={(e) => handleFieldChange('about', 'transparency_section_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="چرا مشتری پیش از شروع کار اطلاعات شفافی دریافت می‌کند؟" />
                </div>
                {[
                  { numKey: '1', label: 'دلیل ۱' },
                  { numKey: '2', label: 'دلیل ۲' },
                  { numKey: '3', label: 'دلیل ۳' },
                ].map(({ numKey, label }) => (
                  <div key={numKey} className="bg-slate-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                    <p className="text-[10px] font-black text-slate-600">{label}</p>
                    <input type="text" value={parsedContents.about?.[`transparency_${numKey}_title`] || ''} onChange={(e) => handleFieldChange('about', `transparency_${numKey}_title`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="عنوان دلیل" />
                    <textarea rows={2} value={parsedContents.about?.[`transparency_${numKey}_desc`] || ''} onChange={(e) => handleFieldChange('about', `transparency_${numKey}_desc`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="توضیح" />
                  </div>
                ))}
              </div>

              {/* ── بخش ۷: CTA ── */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">بخش ۷ — دکمه تماس و CTA</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان CTA</label>
                    <input type="text" value={parsedContents.about?.cta_title || ''} onChange={(e) => handleFieldChange('about', 'cta_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="برای استعلام قیمت یا ثبت سفارش تماس بگیرید" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">توضیح زیر عنوان CTA</label>
                    <input type="text" value={parsedContents.about?.cta_desc || ''} onChange={(e) => handleFieldChange('about', 'cta_desc', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="کارشناسان اسپاب‌چی در تمام ساعات ..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن دکمه تماس (قبل از شماره)</label>
                    <input type="text" value={parsedContents.about?.cta_btn_call || ''} onChange={(e) => handleFieldChange('about', 'cta_btn_call', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="تماس" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن دکمه محاسبه قیمت</label>
                    <input type="text" value={parsedContents.about?.cta_btn_calc || ''} onChange={(e) => handleFieldChange('about', 'cta_btn_calc', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="محاسبه آنلاین قیمت" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activePage === 'contact' && (
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-800 border-r-2 border-teal-500 pr-2">📞 ویرایش جزئیات توضیحی صفحه تماس با ما</h4>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 font-sans">توضیحات فرعی زیرعنوان صفحه تماس (Subtitle)</label>
                <input 
                  type="text"
                  value={parsedContents.contact?.subtitle || ''}
                  onChange={(e) => handleFieldChange('contact', 'subtitle', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800"
                  placeholder="مثال: پاسخگویی  و بدون تعطیلی جهت رفاه حال..."
                />
              </div>

              <div className="p-4 bg-teal-50/20 rounded-2xl border border-teal-100 text-[11px] text-teal-800 leading-relaxed font-bold">
                💡 توجه: اطلاعات تماس تلفن گویا )، شماره های فرعی، آدرس دفتر، و ایمیل به صورت سراسری بر روی سایت و تنظیمات کل سامانه مدیریت می‌شود. اینجا فقط زیرعنوان‌های توضیحی این مسیر قابل ویرایش هستند تا ثبات ارتباطات مشتری حفظ گردد.
              </div>
            </div>
          )}

          {activePage === 'privacy' && (
            <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-800 border-r-2 border-amber-500 pr-2">🔒 ویرایش کامل صفحه حریم خصوصی و ضوابط</h4>

              {/* ── محتوا ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">محتوای صفحه</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">زیرعنوان (تاریخ بروزرسانی)</label>
                    <input type="text" value={parsedContents.privacy?.subtitle || ''} onChange={(e) => handleFieldChange('privacy', 'subtitle', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="آخرین بروزرسانی: ..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش قوانین عمومی</label>
                    <input type="text" value={parsedContents.privacy?.rules_heading || ''} onChange={(e) => handleFieldChange('privacy', 'rules_heading', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="قوانین عمومی حمل‌ونقل و صدور فاکتور" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">پاراگراف مقدمه</label>
                  <textarea rows={3} value={parsedContents.privacy?.intro || ''} onChange={(e) => handleFieldChange('privacy', 'intro', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 leading-relaxed text-justify" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: 'rule_1', label: 'قانون ۱ (قیمت‌های نهایی)' },
                    { key: 'rule_2', label: 'قانون ۲ (لغو نوبت)' },
                    { key: 'rule_3', label: 'قانون ۳ (کالاهای گران‌قیمت)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">{label}</label>
                      <textarea rows={2} value={parsedContents.privacy?.[key] || ''} onChange={(e) => handleFieldChange('privacy', key, e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش بیمه‌نامه</label>
                    <input type="text" value={parsedContents.privacy?.insurance_heading || ''} onChange={(e) => handleFieldChange('privacy', 'insurance_heading', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان بخش حریم خصوصی</label>
                    <input type="text" value={parsedContents.privacy?.privacy_heading || ''} onChange={(e) => handleFieldChange('privacy', 'privacy_heading', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن بیمه‌نامه و غرامت</label>
                    <textarea rows={4} value={parsedContents.privacy?.insurance_text || ''} onChange={(e) => handleFieldChange('privacy', 'insurance_text', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 leading-relaxed text-justify" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن حریم خصوصی کاربران</label>
                    <textarea rows={4} value={parsedContents.privacy?.privacy_text || ''} onChange={(e) => handleFieldChange('privacy', 'privacy_text', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 leading-relaxed text-justify" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن هشدار (کادر زرد)</label>
                  <textarea rows={2} value={parsedContents.privacy?.box_alert || ''} onChange={(e) => handleFieldChange('privacy', 'box_alert', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" />
                </div>
              </div>

              {/* ── SEO ── */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">🔍 تنظیمات SEO صفحه حریم خصوصی</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">SEO Title (عنوان مرورگر)</label>
                    <input type="text" value={pages.privacy?.seo_title || ''} onChange={(e) => handleMetadataChange('privacy', 'seo_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="حریم خصوصی | اسپاب‌چی" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Meta Description</label>
                    <input type="text" value={pages.privacy?.seo_description || ''} onChange={(e) => handleMetadataChange('privacy', 'seo_description', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="توضیح کوتاه برای گوگل..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">کلمات کلیدی (Keywords)</label>
                    <input type="text" value={parsedContents.privacy?.seo_keywords || ''} onChange={(e) => handleFieldChange('privacy', 'seo_keywords', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="حریم خصوصی، قوانین اسباب‌کشی، ..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Canonical URL</label>
                    <input type="text" dir="ltr" value={parsedContents.privacy?.canonical_url || ''} onChange={(e) => handleFieldChange('privacy', 'canonical_url', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 text-left" placeholder="https://aspabchi.com/privacy" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Robots Meta</label>
                    <select value={parsedContents.privacy?.robots || 'index, follow'} onChange={(e) => handleFieldChange('privacy', 'robots', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800">
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'terms' && (
            <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-800 border-r-2 border-purple-500 pr-2">📋 ویرایش کامل صفحه شرایط و ضوابط</h4>

              {/* ── محتوا ── */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <p className="text-[11px] font-black text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">محتوای صفحه</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">عنوان صفحه</label>
                    <input type="text" value={pages.terms?.title || ''} onChange={(e) => handleMetadataChange('terms', 'title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="شرایط و ضوابط استفاده از خدمات اسپاب‌چی" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">زیرعنوان</label>
                    <input type="text" value={parsedContents.terms?.subtitle || ''} onChange={(e) => handleFieldChange('terms', 'subtitle', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="لطفاً پیش از استفاده از خدمات این صفحه را مطالعه کنید." />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">پاراگراف مقدمه</label>
                  <textarea rows={3} value={parsedContents.terms?.intro || ''} onChange={(e) => handleFieldChange('terms', 'intro', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 leading-relaxed text-justify" placeholder="با استفاده از خدمات اسپاب‌چی، کاربر تأیید می‌کند که..." />
                </div>

                {[
                  { n: '1', label: 'بخش ۱ — تعریف خدمات' },
                  { n: '2', label: 'بخش ۲ — پرداخت و هزینه‌ها' },
                  { n: '3', label: 'بخش ۳ — مسئولیت‌ها و محدودیت‌ها' },
                  { n: '4', label: 'بخش ۴ — لغو و تغییر سفارش' },
                  { n: '5', label: 'بخش ۵ — حل اختلاف' },
                ].map(({ n, label }) => (
                  <div key={n} className="bg-slate-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                    <p className="text-[10px] font-black text-slate-600">{label}</p>
                    <input type="text" value={parsedContents.terms?.[`section_${n}_heading`] || ''} onChange={(e) => handleFieldChange('terms', `section_${n}_heading`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800" placeholder="عنوان بخش" />
                    <textarea rows={3} value={parsedContents.terms?.[`section_${n}_text`] || ''} onChange={(e) => handleFieldChange('terms', `section_${n}_text`, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 leading-relaxed text-justify" placeholder="متن بخش" />
                  </div>
                ))}

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">متن هشدار (کادر زرد)</label>
                  <textarea rows={2} value={parsedContents.terms?.box_alert || ''} onChange={(e) => handleFieldChange('terms', 'box_alert', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" />
                </div>
              </div>

              {/* ── SEO ── */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">🔍 تنظیمات SEO صفحه شرایط و ضوابط</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">SEO Title (عنوان مرورگر)</label>
                    <input type="text" value={pages.terms?.seo_title || ''} onChange={(e) => handleMetadataChange('terms', 'seo_title', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="شرایط و ضوابط | اسپاب‌چی" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Meta Description</label>
                    <input type="text" value={pages.terms?.seo_description || ''} onChange={(e) => handleMetadataChange('terms', 'seo_description', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="توضیح کوتاه برای گوگل..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">کلمات کلیدی (Keywords)</label>
                    <input type="text" value={parsedContents.terms?.seo_keywords || ''} onChange={(e) => handleFieldChange('terms', 'seo_keywords', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800" placeholder="شرایط استفاده، قوانین اسباب‌کشی، ..." />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Canonical URL</label>
                    <input type="text" dir="ltr" value={parsedContents.terms?.canonical_url || ''} onChange={(e) => handleFieldChange('terms', 'canonical_url', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800 text-left" placeholder="https://aspabchi.com/terms" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Robots Meta</label>
                    <select value={parsedContents.terms?.robots || 'index, follow'} onChange={(e) => handleFieldChange('terms', 'robots', e.target.value)} className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-800">
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action button block to Save */}
          <div className="flex border-t border-gray-100 pt-6 justify-end">
            <button 
              onClick={() => saveContent(activePage)}
              className="bg-slate-900 border border-slate-900 shadow-lg text-white font-black hover:opacity-95 text-xs py-3.5 px-8 rounded-2xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-500" />
              <span>ذخیره تغییرات و انتشار زنده در سایت</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
