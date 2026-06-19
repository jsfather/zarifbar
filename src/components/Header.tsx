import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ShieldCheck, ChevronDown, UserCheck, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  phone: string;
  logoUrl?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function Header({ currentPath, onNavigate, phone, logoUrl, isDarkMode = false, onToggleDarkMode }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    setShowSubMenu(false);
  };

  const services = [
    { title: 'بسته‌بندی اثاثیه منزل', slug: 'packing' },
    { title: 'کارگر خالی و نیروی جابجایی', slug: 'workers' },
    { title: 'وانت بار و نیسان بار', slug: 'transport' },
    { title: 'انبار و اجاره موقت وسایل', slug: 'storage' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-950/95 shadow-md py-3 border-b border-gray-100 dark:border-slate-800/50 backdrop-blur-md' 
          : 'bg-white/80 dark:bg-slate-900/80 py-5 backdrop-blur-sm'
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-2">
        {/* Logo and branding */}
        <div 
          onClick={() => handleLinkClick('/')} 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:bg-blue-700 transition-colors overflow-hidden shrink-0">
             {logoUrl ? (
               <img src={logoUrl} alt="ظریف بار" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             ) : (
               <span className="font-black text-[10px] md:text-xs">LOGO</span>
             )}
          </div>
          <div>
            <span className="text-sm md:text-xl lg:text-2xl font-black text-gray-900 tracking-tight block whitespace-nowrap">
              ظریف بار <span className="hidden md:inline-block text-blue-600 font-medium text-xs md:text-sm">اتوبار مدرن</span>
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex items-center gap-3 xl:gap-5 text-[#475569] dark:text-slate-300 font-semibold text-xs xl:text-sm whitespace-nowrap">
          <button 
            onClick={() => handleLinkClick('/')} 
            className={`transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${currentPath === '/' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            صفحه اصلی
          </button>

          {/* Dynamic Services Submenu */}
          <div 
            className="relative"
            onMouseEnter={() => setShowSubMenu(true)}
            onMouseLeave={() => setShowSubMenu(false)}
          >
            <button 
              className={`flex items-center gap-1 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer whitespace-nowrap ${
                currentPath.startsWith('/services') ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              خدمات ما
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSubMenu && (
              <div className="absolute right-0 top-full pt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 flex flex-col gap-1">
                  {services.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleLinkClick(`/services/${item.slug}`)}
                      className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${
                        currentPath === `/services/${item.slug}` ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-350'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 dark:border-slate-800 my-1"></div>
                  <button
                    onClick={() => handleLinkClick('/services')}
                    className="w-full text-center px-4 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                  >
                    مشاهده تمامی خدمات
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleLinkClick('/blog')} 
            className={`transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${currentPath.startsWith('/blog') ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            وبلاگ و دانستنی‌ها
          </button>

          <button 
            onClick={() => handleLinkClick('/areas')} 
            className={`transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${currentPath === '/areas' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            مناطق تحت پوشش
          </button>

          <button 
            onClick={() => handleLinkClick('/about')} 
            className={`transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${currentPath === '/about' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            درباره ما
          </button>

          <button 
            onClick={() => handleLinkClick('/contact')} 
            className={`transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${currentPath === '/contact' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            تماس با ما
          </button>

          <button 
            onClick={() => handleLinkClick('/privacy')} 
            className={`transition-colors py-2 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${currentPath === '/privacy' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            حریم خصوصی و قوانین
          </button>
        </nav>

        {/* Call to action & Admin toggle */}
        <div className="flex items-center gap-3">
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 md:p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title={isDarkMode ? "حالت روز (روشن)" : "حالت شب (تاریک)"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" /> : <Moon className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />}
            </button>
          )}

          <a 
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl md:rounded-2xl px-2.5 py-1.5 md:px-5 md:py-2.5 shadow-md shadow-blue-500/20 hover:opacity-95 transition-all text-xs md:text-sm font-bold whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 animate-bounce" />
            <span className="hidden sm:inline">تماس سریع:</span>
            <span dir="ltr">{phone}</span>
          </a>

          {/* Hamburguer button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="xl:hidden p-2 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-t border-gray-150/80 dark:border-slate-800/80 absolute top-full left-0 right-0 shadow-2xl py-5 px-6 animate-in slide-in-from-top-4 duration-200 z-[110] max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col gap-2 font-bold text-slate-700 dark:text-slate-200 pb-5">
            <button 
              onClick={() => handleLinkClick('/')} 
              className={`text-right py-3 px-4 rounded-xl text-sm transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                currentPath === '/' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800 border-r-4 border-blue-600 dark:border-blue-500 font-extrabold' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              صفحه اصلی
            </button>
            
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-800/60 rounded-2xl p-3 my-1">
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-black tracking-wider px-4 block pb-2 border-b border-slate-100 dark:border-slate-800/40 mb-2">
                خدمات تخصصی ظریف بار
              </span>
              <div className="flex flex-col gap-1">
                {services.map((child) => (
                  <button
                    key={child.slug}
                    onClick={() => handleLinkClick(`/services/${child.slug}`)}
                    className={`text-right py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      currentPath === `/services/${child.slug}`
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-slate-900/60 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    • {child.title}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleLinkClick('/blog')} 
              className={`text-right py-3 px-4 rounded-xl text-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                currentPath.startsWith('/blog') 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800 border-r-4 border-blue-600 dark:border-blue-500 font-extrabold' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              وبلاگ و دانستنی‌ها
            </button>

            <button 
              onClick={() => handleLinkClick('/areas')} 
              className={`text-right py-3 px-4 rounded-xl text-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                currentPath === '/areas' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800 border-r-4 border-blue-600 dark:border-blue-500 font-extrabold' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              مناطق تحت پوشش
            </button>

            <button 
              onClick={() => handleLinkClick('/about')} 
              className={`text-right py-3 px-4 rounded-xl text-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                currentPath === '/about' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800 border-r-4 border-blue-600 dark:border-blue-500 font-extrabold' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              درباره ما
            </button>

            <button 
              onClick={() => handleLinkClick('/contact')} 
              className={`text-right py-3 px-4 rounded-xl text-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                currentPath === '/contact' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800 border-r-4 border-blue-600 dark:border-blue-500 font-extrabold' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              تماس با ما
            </button>

            <button 
              onClick={() => handleLinkClick('/privacy')} 
              className={`text-right py-3 px-4 rounded-xl text-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                currentPath === '/privacy' 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800 border-r-4 border-blue-600 dark:border-blue-500 font-extrabold' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              حریم خصوصی و قوانین
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
