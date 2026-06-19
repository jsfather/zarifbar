import React from 'react';
import { ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBackToHome: () => void;
  content?: {
    title?: string;
    subtitle?: string;
    intro?: string;
    rules_heading?: string;
    rule_1?: string;
    rule_2?: string;
    rule_3?: string;
    insurance_heading?: string;
    insurance_text?: string;
    privacy_heading?: string;
    privacy_text?: string;
    box_alert?: string;
  };
}

export default function PrivacyPolicyView({ onBackToHome, content }: PrivacyPolicyViewProps) {
  const p = content || {};

  return (
    <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-4xl mx-auto px-4 leading-relaxed animate-in fade-in duration-200" dir="rtl">
      {/* Breadcrumb path */}
      <div className="mb-6 flex items-center gap-2 text-xs text-gray-400 font-bold">
        <button onClick={onBackToHome} className="hover:text-blue-600 transition-colors cursor-pointer">صفحه اصلی</button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 dark:text-slate-350 font-black">ضوابط، قوانین و حریم خصوصی</span>
      </div>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-3 pb-4 border-b border-gray-150 dark:border-slate-800">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-1000 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {p.title || 'ضوابط، مقررات و حریم خصوصی ظریف بار'}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">
            {p.subtitle || 'آخرین بروزرسانی مقررات مدنی اسباب‌کشی: خرداد ماه ۱۴۰۵'}
          </p>
        </div>

        {/* Content body layout */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-xs space-y-8 text-justify transition-colors duration-300">
          
          <div className="space-y-4">
            <h2 className="text-md font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
              مقدمه و تعهد مدنی
            </h2>
            <p className="text-sm text-gray-650 dark:text-slate-350 leading-relaxed text-justify">
              {p.intro || 'کاربر گرامی، ورود به وب‌سایت ظریف بار و استفاده از خدمات مشاوره، محاسبه‌گر هوشمند آنلاین، و رزرو نوبت تلفنی یا اینترنتی به معنای آگاهی کامل و پذیرش بی قید و شرط قوانین درج شده در این صفحه می‌باشد. هدف ما آسودگی خاطر کامل شما در طول اسباب‌کشی و حفظ امانت به مطمئن‌ترین شکل ممکن است.'}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-md font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
              {p.rules_heading || 'قوانین عمومی حمل‌ونقل و صدور فاکتور'}
            </h2>
            <div className="grid grid-cols-1 gap-4 text-xs md:text-sm font-medium text-gray-750 dark:text-slate-300">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {p.rule_1 || 'قیمت‌های نهایی صادر شده: مبالغی که کارشناسان پشتیبانی پس از ثبت استعلام محاسبه‌گر هوشمند به صورت فاکتور کتبی یا پیامکی تایید می‌کنند، قطعی بوده و رانندگان به هیچ عنوان مجاز به دریافت مبالغ اضافه تحت عناوین «انعام، سختی راه پله، پیاده‌روی طولانی» نخواهند بود مگر با هماهنگی مدیریت.'}
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {p.rule_2 || 'لغو نوبت رزرو شده: مشتریان محترم در صورت نیاز به تغییر زمان اسباب‌کشی یا لغو نوبت، موظف هستند حداقل ۲۴ ساعت قبل از اعزام کادر جابجایی موضوع را به کارشناسان ظریف بار اطلاع دهند.'}
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {p.rule_3 || 'کالاهای گران‌قیمت خاص: جابجایی اقلام بسیار گران‌قیمت اعم از وجوه نقد، جواهرات، اسناد ملکی گاوصندوق، لپ‌تاپ‌های شخصی و طلاجات باید توسط خود کارفرما انجام گیرد. کادر فنی به هیچ عنوان مسئولیت انتقال موارد شخصی درون کیف‌های مسافرتی را برعهده نمی‌گیرد.'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-md font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
              {p.insurance_heading || 'بیمه نامه و تضمین خسارت'}
            </h2>
            <p className="text-sm text-gray-650 dark:text-slate-350 leading-relaxed text-justify">
              {p.insurance_text || 'تمامی اثاثیه‌های حمل شده توسط ناوگان کامیونت‌های مسقف ظریف بار، تحت پوشش بیمه نامه معتبر البرز یا ایران تا سقف مشخص شده در فاکتور قرار می‌گیرند. در صورت بروز هرگونه آسیب به وسایلی که بسته‌بندی آنها توسط تیم حرفه‌ای و با تایید ناظر کادر ظریف بار انجام شده باشد، شرکت موظف به پرداخت غرامت معادل قیمت روز کالا یا تعمیر تخصصی آن خواهد بود.'}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-md font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
              {p.privacy_heading || 'سیاست حفظ حریم خصوصی کاربران'}
            </h2>
            <p className="text-sm text-gray-650 dark:text-slate-350 leading-relaxed text-justify">
              {p.privacy_text || 'مجموعه ظریف بار نسبت به حفظ اطلاعات خصوصی مشتریان خود (مانند نام خانوادگی، شماره‌های همراه، آدرس‌های مبدا و مقصد) کاملاً متعهد است. تمامی اطلاعات وارد شده در وب‌سایت ظریف بار در سرورهای امن نگهداری شده و فقط برای فرآیند اعزام خودرو، صدور بیمه نامه حمل بار و بهبود کیفیت خدمات مورد استفاده قرار می‌گیرند. ما هرگز داده‌های شما را در اختیار اشخاص ثالثِ تبلیغاتی قرار نخواهیم داد.'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-justify font-bold">
              {p.box_alert || 'در صورت بروز هرگونه تعارض نامتعارف با پرسنل صحنه جابجایی قبل از هرگونه پرداخت وجه با شماره بازرسی مرکزی ظریف بار تماس حاصل فرمایید تا کارشناس شعبه فوراً مداخله کند.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
