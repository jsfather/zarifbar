import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

interface ContactViewProps {
  phone: string;
  phoneAlt: string;
  email: string;
  address: string;
  workingHours: string;
  title?: string;
  subtitle?: string;
}

export default function ContactView({ phone, phoneAlt, email, address, workingHours, title, subtitle }: ContactViewProps) {
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNum.trim()) {
      alert('لطفا فیلدهای ستاره دار را به دقت پر کنید.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone: phoneNum,
          message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setName('');
        setPhoneNum('');
        setMessage('');
      } else {
        alert('خطایی در ارسال رخ داد. مجدداً اقدام کنید.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در برقراری ارتباط با بانک اطلاعاتی.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-7xl mx-auto px-4 md:px-8" dir="rtl">
      
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-xs bg-blue-100 text-blue-700 font-extrabold px-3 py-1.5 rounded-full uppercase">
          پشتیبانی سراسری و فوری
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {title || 'تماس با واحد پشتیبانی ظریف بار'}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {subtitle || 'هر گونه سوال، انتقاد، پیشنهاد یا مغایرت فاکتور دارید؟ تیم بازرسی ما ۲۴ ساعته همواره آماده شنیدن نظرات پرارزش شماست.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Contact info channels */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-950 text-white rounded-3xl p-6 md:p-10 flex flex-col justify-between shadow-xl space-y-10">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-yellow-300">راه‌های ارتباطی مستقیم با تلفن ۴ رقمی</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              ظریف بار با توسعه خط ویژه شبکه‌ای، فرآیند مشاوره را تسریع کرده است. بدون نیاز به پیش‌شماره در تهران، با شماره ۴ رقمی تماس بگیرید.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">تلفن شبانه‌روزی (بدون پیش‌شماره)</span>
                  <a href={`tel:${phone}`} className="text-lg font-black tracking-wider hover:text-yellow-400 text-white" dir="ltr">{phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">تماس مستقیم با مدیریت/پیگیری فاکتور</span>
                  <a href={`tel:${phoneAlt}`} className="text-sm font-bold hover:text-white text-slate-200" dir="ltr">{phoneAlt}</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">پست الکترونیکی مرکزی</span>
                  <span className="text-xs font-semibold text-slate-200">{email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">آدرس دفتر مرکزی و پشتیبانی مشتریان</span>
                  <span className="text-xs text-slate-200 leading-relaxed block">{address}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">ساعت کار دفتر مرکزی</span>
                  <span className="text-xs text-slate-200 font-bold block">{workingHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              * رانندگان و کارگران ما موظف به رعایت کامل پروتکل‌های اخلاقی و ارایه فاکتور ممهور به مهر برجسته ظریف بار می‌باشند.
            </p>
          </div>

        </div>

        {/* Form panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm flex flex-col justify-center">
          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">پیام شما با موفقیت ارسال شد</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                از ارتباط شما سپاسگزاریم. انتقادات و پیشنهادات شما مستقیم توسط مدیران بازرسی بررسی شده و در صورت لزوم تا ۴۸ ساعت آینده تماس گرفته خواهد شد.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-bold underline"
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">فرم تماس مستقیم یا ثبت پیشنهادات</h3>
                <p className="text-xs text-gray-400">تکمیل موارد دارای ستاره (*) الزامی است.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">نام و نام خانوادگی شما *</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: حسینی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">شماره تماس شما *</label>
                  <input 
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="مثال: 09121112233"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-semibold text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">توضیحات، انتقادات، یا متن پیام</label>
                <textarea 
                  rows={5}
                  placeholder="پیشنهاد یا انتقاد خود را درباره پرسنل، راننده، یا هزینه‌های اعلام‌شده بنویسید..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl py-3.5 px-6 font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'در حال ارسال پیام...' : 'ارسال نهایی پیام'}
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
