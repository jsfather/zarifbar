import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ShieldCheck, Truck, Warehouse, BadgeCheck, PhoneCall, CheckCircle } from 'lucide-react';
import { DEFAULT_AREAS_DATA, AreasData, RegionalAreaData } from '../data/areas_defaults';

interface AreasViewProps {
  areasDataObj?: string; // from settings.areas_data
  onBackToHome: () => void;
  phone: string;
}

export default function AreasView({ areasDataObj, onBackToHome, phone }: AreasViewProps) {
  const [data, setData] = useState<AreasData>(DEFAULT_AREAS_DATA);
  const [activeTab, setActiveTab] = useState<'north' | 'west' | 'east' | 'karaj'>('north');

  // Hydrate data from database settings if exists
  useEffect(() => {
    if (areasDataObj) {
      try {
        const parsed = JSON.parse(areasDataObj);
        setData({
          title: parsed.title || DEFAULT_AREAS_DATA.title,
          subtitle: parsed.subtitle || DEFAULT_AREAS_DATA.subtitle,
          regions: {
            north: parsed.regions?.north || DEFAULT_AREAS_DATA.regions.north,
            west: parsed.regions?.west || DEFAULT_AREAS_DATA.regions.west,
            east: parsed.regions?.east || DEFAULT_AREAS_DATA.regions.east,
            karaj: parsed.regions?.karaj || DEFAULT_AREAS_DATA.regions.karaj,
          }
        });
      } catch (e) {
        console.error("Error setting custom areas data, using defaults", e);
        setData(DEFAULT_AREAS_DATA);
      }
    } else {
      setData(DEFAULT_AREAS_DATA);
    }
  }, [areasDataObj]);

  const activeRegion: RegionalAreaData = data.regions[activeTab];

  return (
    <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-7xl mx-auto px-4 md:px-8 space-y-8 text-right" dir="rtl">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-extrabold text-xs px-4 py-2 rounded-full border border-blue-100 shadow-sm">
          <MapPin className="w-4 h-4 text-blue-600 animate-pulse" />
          محدوده سرویس‌دهی و شعب فعال اتوبار ظریف بار تهران
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-snug">
          {data.title}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
          {data.subtitle}
        </p>
      </div>

      {/* REGIONAL TAB CHOOSER */}
      <div className="flex justify-center border-b border-gray-100 pb-4 max-w-2xl mx-auto">
        <div className="flex flex-wrap md:flex-nowrap gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-full">
          {[
            { key: 'north', name: 'شمال تهران', color: 'bg-blue-600' },
            { key: 'west', name: 'غرب تهران', color: 'bg-blue-600' },
            { key: 'east', name: 'شرق تهران', color: 'bg-blue-600' },
            { key: 'karaj', name: 'شعبه کرج / البرز', color: 'bg-blue-600' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 ${
                activeTab === tab.key
                  ? `${tab.color} text-white shadow-md`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE REGION CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
        
        {/* RIGHT COLUMN: LEAD BRIEF & DIRECT CALL DIRECTORY */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* LEAD BRIEF CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-amber-400 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              شعبه مرکزی {activeRegion.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed text-justify">
              {activeRegion.lead}
            </p>
            <div className="border-t border-slate-700/60 pt-4 flex justify-between items-center text-xs text-slate-400 font-bold">
              <span>وضعیت پاسخگویی: ۲۴ ساعته</span>
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                فعال و برخط
              </span>
            </div>
          </div>

          {/* TELEPHONE DIRECTORY CARDS */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <PhoneCall className="w-5 h-5 text-blue-600" />
              شماره تماس‌های مستقیم {activeRegion.name}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {(activeRegion.phones || []).map((ph, idx) => (
                <a
                  key={idx}
                  href={`tel:${ph.value}`}
                  className="flex justify-between items-center p-3.5 rounded-2xl bg-gray-50/50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-250 group group-hover:scale-[1.01]"
                >
                  <span className="text-xs font-bold text-gray-600 group-hover:text-blue-950 transition-colors">
                    {ph.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 font-sans tracking-wide" dir="ltr">
                      {ph.value}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                      <Phone className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold text-center mt-2 leading-relaxed">
              با کلیک فوق العاده راحت روی دکمه‌های بالا مستقیما به شعبه متصل شوید.
            </div>
          </div>

          {/* ACCREDITATION STAT */}
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-blue-900">نرخ مصوب اتحادیه باربری</h4>
              <p className="text-[10px] text-blue-700 mt-0.5 leading-relaxed font-bold">
                تمام تعرفه‌های محاسبه شده تحت کنترل تعزیرات بوده و در پایان کار هیچگونه افزایش قیمتی نخواهید داشت.
              </p>
            </div>
          </div>

        </div>

        {/* LEFT COLUMN: DETAILED DISCLOSURES SECTIONS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 border-b-2 border-blue-600 pb-3 inline-block">
                جزئیات و مطالب تفصیلی با ناوبری {activeRegion.name}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-bold">
                توضیحات جامع پیرامون تجهیزات، بسته‌بندی، اسباب‌کشی و ملزومات بکاررفته در مناطق {activeRegion.name}:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(activeRegion.sections || []).map((sec, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm font-black text-slate-800">
                      {sec.title}
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mr-7 text-justify whitespace-pre-wrap">
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CALL TO ACTION BUTTON */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-6 rounded-2xl">
              <div>
                <strong className="text-xs text-slate-900 block font-black">اسباب کشی در {activeRegion.name} همین امروز!</strong>
                <span className="text-[10px] text-gray-400 font-bold block mt-1">سراسری با کادر باسابقه و تایید صلاحیت شده</span>
              </div>
              <button
                onClick={() => {
                  onBackToHome();
                  setTimeout(() => {
                    const el = document.getElementById('price-calc-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl px-6 py-3 transition-colors text-xs"
              >
                محاسبه قیمت و استعلام کرونولوژی هزینه
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
