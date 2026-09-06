import React, { useEffect } from 'react';
import { FileText, HelpCircle, CheckCircle2 } from 'lucide-react';

interface TermsViewProps {
  onBackToHome: () => void;
  content?: {
    title?: string;
    subtitle?: string;
    intro?: string;
    section_1_heading?: string;
    section_1_text?: string;
    section_2_heading?: string;
    section_2_text?: string;
    section_3_heading?: string;
    section_3_text?: string;
    section_4_heading?: string;
    section_4_text?: string;
    section_5_heading?: string;
    section_5_text?: string;
    box_alert?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    canonical_url?: string;
    robots?: string;
  };
}

export default function TermsView({ onBackToHome, content }: TermsViewProps) {
  const p = content || {};

  useEffect(() => {
    if (p.seo_title) document.title = p.seo_title;
    const setMeta = (name: string, val: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    const setLink = (rel: string, val: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
      el.setAttribute('href', val);
    };
    if (p.seo_description) setMeta('description', p.seo_description);
    if (p.seo_keywords) setMeta('keywords', p.seo_keywords);
    if (p.robots) setMeta('robots', p.robots);
    if (p.canonical_url) setLink('canonical', p.canonical_url);
  }, [p.seo_title, p.seo_description, p.seo_keywords, p.robots, p.canonical_url]);

  const sections = [
    { heading: p.section_1_heading || 'تعریف خدمات', text: p.section_1_text || '' },
    { heading: p.section_2_heading || 'پرداخت و هزینه‌ها', text: p.section_2_text || '' },
    { heading: p.section_3_heading || 'مسئولیت‌ها و محدودیت‌ها', text: p.section_3_text || '' },
    { heading: p.section_4_heading || 'لغو و تغییر سفارش', text: p.section_4_text || '' },
    { heading: p.section_5_heading || 'حل اختلاف', text: p.section_5_text || '' },
  ].filter(s => s.text);

  return (
    <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-4xl mx-auto px-4 leading-relaxed animate-in fade-in duration-200" dir="rtl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-gray-400 font-bold">
        <button onClick={onBackToHome} className="hover:text-purple-600 transition-colors cursor-pointer">صفحه اصلی</button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 dark:text-slate-350 font-black">شرایط و ضوابط استفاده</span>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3 pb-4 border-b border-gray-150 dark:border-slate-800">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            {p.title || 'شرایط و ضوابط استفاده از خدمات اسپاب‌چی'}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">
            {p.subtitle || 'لطفاً پیش از استفاده از خدمات این صفحه را مطالعه کنید.'}
          </p>
        </div>

        {/* Body */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-xs space-y-8 text-justify transition-colors duration-300">

          {/* Intro */}
          <div className="space-y-4">
            <h2 className="text-md font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-600 dark:bg-purple-500 rounded-full"></span>
              مقدمه
            </h2>
            <p className="text-sm text-gray-650 dark:text-slate-350 leading-relaxed text-justify">
              {p.intro || 'با استفاده از خدمات اسپاب‌چی، کاربر گرامی تأیید می‌کند که شرایط و ضوابط زیر را خوانده، درک کرده و با آن‌ها موافق است.'}
            </p>
          </div>

          {/* Dynamic sections */}
          {sections.map((sec, i) => (
            <div key={i} className="space-y-4">
              <h2 className="text-md font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-600 dark:bg-purple-500 rounded-full"></span>
                {sec.heading}
              </h2>
              <p className="text-sm text-gray-650 dark:text-slate-350 leading-relaxed text-justify">
                {sec.text}
              </p>
            </div>
          ))}

          {/* Alert box */}
          {p.box_alert && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-justify font-bold">{p.box_alert}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
