import React, { useState, useEffect } from 'react';
import { Sparkles, Calculator, Calendar, ArrowLeft, ArrowRight, CheckCircle2, Phone, Building, User, Info, Check, MessageSquare } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  desc?: string;
}

export interface EstimatorField {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'number-buttons' | 'radio' | 'select' | 'date';
  required: boolean;
  placeholder?: string;
  options?: Option[];
}

export interface EstimatorStep {
  title: string;
  description: string;
  fields: EstimatorField[];
}

export interface EstimatorConfig {
  notifications: {
    step_alert?: string;
    step_alert_step?: number;
    price_disclaimer?: string;
    success_title?: string;
    success_message?: string;
  };
  steps: EstimatorStep[];
}

export const DEFAULT_ESTIMATOR_CONFIG: EstimatorConfig = {
  notifications: {
    step_alert: "کاربر گرامی، قیمت نهایی شامل **بیمه مسئولیت بار تا سقف ۱۰۰ میلیون تومان رایگان** از طرف شرکت بزرگ ظریف بار صادر خواهد شد.",
    step_alert_step: 1,
    price_disclaimer: "محاسبه بر اساس نرخ اتحادیه صنف باربری تهران سال ۱۴۰۵",
    success_title: "درخواست استعلام شما با موفقیت ثبت شد!",
    success_message: "کد پیگیری شما صادر گردید. کارشناسان پشتیبان ظریف بار تا ۱۵ دقیقه آینده جهت هماهنگی نهایی و صدور بیمه‌نامه رایگان بار با شما تماس خواهند گرفت."
  },
  steps: [
    {
      title: "انتخاب خدمت",
      description: "نوع خدمت مورد نیاز شما چیست؟",
      fields: [
        {
          name: "service_type",
          label: "نوع خدمت",
          type: "select",
          required: true,
          options: [
            { value: "packing", label: "بسته‌بندی کامل و اسباب‌کشی لوکس", desc: "کارتن، سلفون، کارگر، کامیونت مسقف پتودار" },
            { value: "workers", label: "کارگر خالی اسباب‌کشی (بدون کامیون)", desc: "اعزام نیروی ورزیده برای تخلیه و چیدمان" },
            { value: "transport", label: "وانت بار یا نیسان شبانه‌روزی", desc: "جابجایی بارهای سبک و سریع با راننده پتو دار" },
            { value: "storage", label: "اجاره انبار موقت کانکسی", desc: "دپوی مطمئن وسایل با کلید شخصی و بیمه کامل" }
          ]
        }
      ]
    },
    {
      title: "مشخصات ملک",
      description: "جزییات مبدا و مقصد خود را وارد کنید",
      fields: [
        {
          name: "origin_city",
          label: "شهر مبدا",
          type: "text",
          required: true,
          placeholder: "مثال: تهران"
        },
        {
          name: "dest_city",
          label: "شهر مقصد",
          type: "text",
          required: true,
          placeholder: "مثال: تهران"
        },
        {
          name: "floors",
          label: "تعداد طبقات عبور بار",
          type: "number-buttons",
          required: true,
          options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" }
          ]
        },
        {
          name: "has_elevator",
          label: "آیا ساختمان مجهز به آسانسور بزرگ جهت جابه جایی بار است؟",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "بله، آسانسور دارد" },
            { value: "no", label: "خیر، پله‌رو" }
          ]
        }
      ]
    },
    {
      title: "اطلاعات تماس",
      description: "اطلاعات تماس خود را ثبت کنید تا با شما تماس بگیریم",
      fields: [
        {
          name: "full_name",
          label: "نام و نام خانوادگی شما",
          type: "text",
          required: true,
          placeholder: "مثال: آقای حسینی"
        },
        {
          name: "phone",
          label: "شماره موبایل جهت هماهنگی",
          type: "tel",
          required: true,
          placeholder: "مثال: 09123456789"
        },
        {
          name: "moving_date",
          label: "تاریخ مد نظر برای اثاث‌کشی",
          type: "date",
          required: true,
          placeholder: ""
        },
        {
          name: "description",
          label: "توضیحات بیشتر (مثال: حمل ساید یا گاوصندوق)",
          type: "text",
          required: false,
          placeholder: "اگر قصد حمل وسایل خاص دارید بنویسید..."
        }
      ]
    }
  ]
};

interface EstimatorProps {
  baseTruck: number;
  perWorker: number;
  packService: number;
  onSuccess: () => void;
  configString?: string;
}

export default function Estimator({ baseTruck, perWorker, packService, onSuccess, configString }: EstimatorProps) {
  const [config, setConfig] = useState<EstimatorConfig>(DEFAULT_ESTIMATOR_CONFIG);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form values state
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Parse custom config when received
  useEffect(() => {
    if (configString) {
      try {
        const parsed = JSON.parse(configString);
        if (parsed && Array.isArray(parsed.steps) && parsed.notifications) {
          setConfig(parsed);
          
          // Seed initial default values for radio/select types to avoid empty selection
          const initialVals: Record<string, any> = {};
          parsed.steps.forEach((s: any) => {
            s.fields.forEach((f: any) => {
              if (f.type === 'select' || f.type === 'radio' || f.type === 'number-buttons') {
                if (f.options && f.options.length > 0) {
                  initialVals[f.name] = f.options[0].value;
                }
              }
            });
          });
          setFormValues(prev => ({ ...initialVals, ...prev }));
        }
      } catch (err) {
        console.error("Failed to parse dynamic form config, using seed defaults:", err);
      }
    }
  }, [configString]);

  // Seed default variables initially
  useEffect(() => {
    const initialVals: Record<string, any> = {};
    config.steps.forEach((s) => {
      s.fields.forEach((f) => {
        if (!formValues[f.name]) {
          if (f.type === 'select' || f.type === 'radio' || f.type === 'number-buttons') {
            if (f.options && f.options.length > 0) {
              initialVals[f.name] = f.options[0].value;
            }
          }
        }
      });
    });
    if (Object.keys(initialVals).length > 0) {
      setFormValues(prev => ({ ...initialVals, ...prev }));
    }
  }, [config]);

  const updateField = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFieldValue = (name: string, fallback: any = '') => {
    return formValues[name] !== undefined ? formValues[name] : fallback;
  };

  // Calculate live dynamic estimation in Tomans
  const calculatePrice = () => {
    const srv = getFieldValue('service_type', 'packing');
    const fl = Number(getFieldValue('floors', 1));
    const elev = getFieldValue('has_elevator', 'yes');

    let cost = 0;
    if (srv === 'packing') {
      cost = baseTruck + packService + (perWorker * 3); // truck + pack + 3 workers
    } else if (srv === 'workers') {
      cost = perWorker * 4; // 4 workers minimum
    } else if (srv === 'transport') {
      cost = baseTruck; // truck only with basic driver
    } else {
      cost = baseTruck + 2000000; // storage deposit
    }

    // Floor factor (if no elevator, add 150,000 per extra floor)
    if (elev === 'no' && fl > 1) {
      cost += (fl - 1) * 150000;
    }

    return cost;
  };

  const currentPrice = calculatePrice();

  const handleNext = () => {
    // Validate current step fields
    const currentStepFields = config.steps[step - 1]?.fields || [];
    for (const f of currentStepFields) {
      if (f.required) {
        const val = getFieldValue(f.name);
        if (val === undefined || val === null || String(val).trim() === '') {
          alert(`لطفا فیلد "${f.label}" را پر کنید.`);
          return;
        }
      }
    }

    if (step < config.steps.length) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate current step fields final check
    const currentStepFields = config.steps[step - 1]?.fields || [];
    for (const f of currentStepFields) {
      if (f.required) {
        const val = getFieldValue(f.name);
        if (val === undefined || val === null || String(val).trim() === '') {
          alert(`لطفا فیلد "${f.label}" را پر کنید.`);
          return;
        }
      }
    }

    setLoading(true);

    // Map fields for standard quote endpoint
    const fullName = getFieldValue('full_name', getFieldValue('name', 'بدون نام'));
    const phoneNum = getFieldValue('phone', '');
    const originCity = getFieldValue('origin_city', 'تهران');
    const destCity = getFieldValue('dest_city', 'تهران');
    const movingDate = getFieldValue('moving_date', new Date().toISOString().split('T')[0]);
    const serviceType = getFieldValue('service_type', 'packing');
    const hasElevator = getFieldValue('has_elevator', 'yes');
    const floorsVal = Number(getFieldValue('floors', 1));

    // Gather extra custom fields to display in description for admin panel
    const customFieldsDesc: string[] = [];
    config.steps.forEach(s => {
      s.fields.forEach(f => {
        // Skip standard keys that have direct db mapping
        const standardKeys = ['full_name', 'phone', 'origin_city', 'dest_city', 'moving_date', 'service_type', 'has_elevator', 'floors'];
        if (!standardKeys.includes(f.name)) {
          const val = getFieldValue(f.name);
          if (val !== undefined && val !== '') {
            customFieldsDesc.push(`${f.label}: ${val}`);
          }
        }
      });
    });

    const userDesc = getFieldValue('description', '');
    let finalDesc = userDesc;
    if (customFieldsDesc.length > 0) {
      finalDesc = `${userDesc ? userDesc + '\n' : ''}فیلدهای سفارشی:\n${customFieldsDesc.join('\n')}`;
    }

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: phoneNum,
          origin_city: originCity,
          dest_city: destCity,
          moving_date: movingDate,
          service_type: serviceType,
          has_elevator: hasElevator,
          floors: floorsVal,
          estimated_price: currentPrice,
          description: finalDesc,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess();
      } else {
        alert('خطایی در ثبت اطلاعات پیش آمد. لطفا دوباره تلاش کنید.');
      }
    } catch (err) {
      console.error(err);
      alert('ارتباط با سرور برقرار نشد.');
    } finally {
      setLoading(false);
    }
  };

  const activeStep = config.steps[step - 1];
  const stepAlert = config.notifications.step_alert;
  const alertStep = config.notifications.step_alert_step || 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300" id="cost-estimator">
      {/* Header bar and indicators */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-slate-800 dark:to-slate-950 text-white p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-yellow-300 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-white">محاسبه‌گر پیشرفته هزینه اسباب‌کشی</h2>
              <p className="text-xs text-blue-100 dark:text-slate-300 font-medium">استعلام آنلاین قیمت تضمین‌شده بدون تغییر</p>
            </div>
          </div>
          <span className="text-xs bg-yellow-400 dark:bg-blue-600 text-blue-950 dark:text-white font-black px-3 py-1.5 rounded-full shadow-sm">
            شبانه‌روزی
          </span>
        </div>

        {/* Dynamic Step indicators */}
        {config.steps.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center relative gap-2 pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-300/40 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
              
              {config.steps.map((s, idx) => {
                const sNum = idx + 1;
                return (
                  <div 
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all ${
                      step >= sNum 
                        ? 'bg-yellow-400 dark:bg-blue-500 text-blue-950 dark:text-white scale-110 shadow-md' 
                        : 'bg-blue-300 dark:bg-slate-800 text-blue-900 dark:text-slate-400'
                    }`}
                  >
                    {sNum}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] md:text-xs text-blue-100 dark:text-slate-400 font-bold">
              {config.steps.map((s, idx) => (
                <span key={idx} className={step === idx + 1 ? 'text-yellow-300 dark:text-blue-400 font-extrabold scale-105' : ''}>
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {submitted ? (
          <div className="text-center py-10 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              {config.notifications.success_title || 'درخواست استعلام شما با موفقیت ثبت شد!'}
            </h3>
            <p className="text-sm text-gray-550 dark:text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
              {config.notifications.success_message || 'کد پیگیری شما صادر گردید. کارشناسان پشتیبان ظریف بار تا ۱۵ دقیقه آینده جهت هماهنگی نهایی تماس میگیرند.'}
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 max-w-xs mx-auto mb-6">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">هزینه حدودی برآورد شده:</div>
              <div className="text-xl font-black text-blue-900 dark:text-blue-200 font-sans" dir="ltr">
                {formatPrice(currentPrice)} <span className="text-xs font-normal">تومان</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormValues({});
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold underline"
            >
              ثبت استعلام جدید
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (step === config.steps.length) { handleSubmit(e); } else { handleNext(); } }} className="space-y-6">
            
            {/* Dynamic Step Fields rendering */}
            {activeStep && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-250">
                <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
                  <label className="block text-sm font-black text-slate-900 dark:text-slate-100">{activeStep.description}</label>
                </div>

                <div className="space-y-5">
                  {activeStep.fields.map((f, idx) => {
                    return (
                      <div key={idx} className="space-y-2">
                        <label className="block text-xs font-bold text-gray-600 dark:text-slate-300">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>

                        {/* Rendering by Type */}
                        {f.type === 'select' && f.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {f.options.map((opt, oIdx) => (
                              <div 
                                key={oIdx}
                                onClick={() => updateField(f.name, opt.value)}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                  getFieldValue(f.name) === opt.value
                                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-500 shadow-sm' 
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    getFieldValue(f.name) === opt.value ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 dark:border-slate-700'
                                  }`}>
                                    {getFieldValue(f.name) === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                  </div>
                                  <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200">{opt.label}</span>
                                </div>
                                {opt.desc && <p className="text-[10px] text-gray-500 dark:text-slate-400 pr-6">{opt.desc}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {f.type === 'radio' && f.options && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            {f.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => updateField(f.name, opt.value)}
                                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all text-right flex items-center justify-between ${
                                  getFieldValue(f.name) === opt.value 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                <span>{opt.label}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  getFieldValue(f.name) === opt.value ? 'border-white bg-white' : 'border-gray-400'
                                }`}>
                                  {getFieldValue(f.name) === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {f.type === 'number-buttons' && f.options && (
                          <div className="flex flex-wrap gap-2">
                            {f.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => updateField(f.name, opt.value)}
                                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${
                                  String(getFieldValue(f.name)) === String(opt.value) 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow' 
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {f.type === 'text' && (
                          <input 
                            type="text" 
                            required={f.required}
                            placeholder={f.placeholder || ''}
                            value={getFieldValue(f.name)}
                            onChange={(e) => updateField(f.name, e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                          />
                        )}

                        {f.type === 'tel' && (
                          <input 
                            type="tel" 
                            required={f.required}
                            placeholder={f.placeholder || ''}
                            value={getFieldValue(f.name)}
                            onChange={(e) => updateField(f.name, e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-semibold text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                            dir="ltr"
                          />
                        )}

                        {f.type === 'date' && (
                          <input 
                            type="date" 
                            required={f.required}
                            value={getFieldValue(f.name)}
                            onChange={(e) => updateField(f.name, e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100"
                          />
                        )}

                      </div>
                    );
                  })}
                </div>
                
                {/* Dynamically show the Alert notification inside Step */}
                {stepAlert && step === alertStep && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-900/30 flex gap-3 text-amber-900 dark:text-amber-200 text-xs leading-relaxed animate-pulse">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p>{stepAlert}</p>
                  </div>
                )}
              </div>
            )}

            {/* Estimates preview container shown for last steps */}
            {step === config.steps.length && (
              <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 mt-2">
                <div className="text-xs text-gray-400 dark:text-slate-400 font-bold mb-1">خلاصه پیش فاکتور تخمینی شما:</div>
                <div className="flex md:flex-row flex-col justify-between items-center gap-2">
                  <span className="text-[10px] md:text-xs text-slate-650 dark:text-slate-400 text-center md:text-right">
                    {config.notifications.price_disclaimer || "محاسبه بر اساس نرخ اتحادیه صنف باربری تهران سال ۱۴۰۵"}
                  </span>
                  <strong className="text-lg text-blue-900 dark:text-blue-300 font-sans" dir="ltr">
                    {formatPrice(currentPrice)} <span className="text-xs text-slate-500 font-normal">تومان</span>
                  </strong>
                </div>
              </div>
            )}

            {/* Actions Panel */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-800 font-bold text-xs md:text-sm transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  مرحله قبلی
                </button>
              ) : (
                <div />
              )}

              {step < config.steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-indigo-500/20 font-bold text-xs md:text-sm transition-all cursor-pointer"
                >
                  مرحله بعدی
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-605 hover:bg-green-700 text-white px-7 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all shadow-md cursor-pointer"
                >
                  {loading ? 'در حال ارسال...' : 'ثبت قطعی و ارسال'}
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
