import React from 'react';
import { Phone, Mail, MapPin, Instagram, Paperclip, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  phone: string;
  phone_alt: string;
  email: string;
  address: string;
}

export default function Footer({ onNavigate, phone, phone_alt, email, address }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100 pt-16 pb-8 border-t border-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* About Company */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ظریف بار</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed text-justify">
            سامانه حمل اثاثیه و ترابری ظریف بار، برترین ارائه‌دهنده خدمات لوکس و مطمئن اسباب‌کشی منزل، جابجایی کالای اداری، حمل با نیسان و وانت مجهز به همراه مدرن‌ترین متد بسته‌بندی در شهر تهران و سراسر کشور.
          </p>
          <div className="pt-2 flex items-center gap-4 text-slate-400">
            <a href="https://instagram.com/zarifbar" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300">سئو بهینه‌سازی شده</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-md font-bold text-white mb-6 border-r-2 border-blue-500 pr-3">دسترسی سریع</h3>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li>
              <button onClick={() => onNavigate('/')} className="hover:text-blue-400 transition-colors cursor-pointer text-right">صفحه نخست</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/services')} className="hover:text-blue-400 transition-colors cursor-pointer text-right">خدمات اسباب‌کشی</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/blog')} className="hover:text-blue-400 transition-colors cursor-pointer text-right">مطالب وبلاگ و دانستنی‌ها</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/about')} className="hover:text-blue-400 transition-colors cursor-pointer text-right">درباره اتوبار ظریف بار</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/contact')} className="hover:text-blue-400 transition-colors cursor-pointer text-right">تماس با پشتیبانی</button>
            </li>
          </ul>
        </div>

        {/* Services Dropdown */}
        <div>
          <h3 className="text-md font-bold text-white mb-6 border-r-2 border-blue-500 pr-3">خدمات متمایز ما</h3>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li>
              <button onClick={() => onNavigate('/services/packing')} className="hover:text-blue-400 transition-colors text-right">بسته‌بندی ضربه‌گیر ۵ لایه</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/services/workers')} className="hover:text-blue-400 transition-colors text-right">کارگران حرفه‌ای و ورزیده سنگین بار</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/services/transport')} className="hover:text-blue-400 transition-colors text-right">حمل با وانت سقف‌دار و نیسان ممتاز</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/services/storage')} className="hover:text-blue-400 transition-colors text-right">انبارداری بهداشتی و بهینه موقت</button>
            </li>
          </ul>
        </div>

        {/* Contact info info */}
        <div>
          <h3 className="text-md font-bold text-white mb-6 border-r-2 border-blue-500 pr-3">اطلاعات ارتباطی</h3>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <span className="block text-xs text-slate-500 font-medium">شماره تماس سراسری:</span>
                <a href={`tel:${phone}`} className="hover:text-white font-bold transition-colors" dir="ltr">{phone}</a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-xs text-slate-500 font-medium">خط اضطراری فرعی:</span>
                <a href={`tel:${phone_alt}`} className="hover:text-white transition-colors" dir="ltr">{phone_alt}</a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="block text-xs text-slate-500">دفتر مرکزی تهران:</span>
                <span className="text-xs leading-relaxed block text-slate-300">{address}</span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p className="text-center md:text-right">
          تمامی حقوق برای ظریف بار محفوظ می باشد | طراحی و توسعه: <a href="https://farinohub.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">آژانس دیجیجتال مارکتینگ فارینو</a>
        </p>
        <div className="flex gap-4 items-center">
          <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-300 transition-colors text-slate-400 font-medium">ضوابط و حریم خصوصی</button>
        </div>
      </div>
    </footer>
  );
}
