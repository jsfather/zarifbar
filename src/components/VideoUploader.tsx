import React, { useState } from 'react';
import { Film, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface VideoUploaderProps {
  onUpload: (url: string) => void;
  buttonText?: string;
}

export default function VideoUploader({ onUpload, buttonText = 'انتخاب و آپلود ویدیو' }: VideoUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorName, setErrorName] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      setErrorName('');
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiFetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onUpload(data.url);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          const errData = await response.json().catch(() => ({}));
          setErrorName(errData.error || 'آپلود ویدیو با خطا مواجه شد.');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        setErrorName('خطا در برقراری ارتباط با سرور.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full" dir="rtl">
      <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-105 border border-blue-200 rounded-xl cursor-pointer transition-colors text-xs font-bold text-blue-700">
        <Film className="w-4 h-4" />
        {loading ? 'در حال آپلود ویدیو...' : buttonText}
        <input type="file" className="hidden" onChange={handleFileChange} accept="video/*" />
      </label>
      {success && (
        <span className="flex items-center justify-center gap-1 text-[10px] text-green-600 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5"/> آپلود ویدیو با موفقیت انجام شد
        </span>
      )}
      {errorName && (
        <span className="flex items-center justify-center text-[10px] text-red-500 font-bold">
          ⚠️ {errorName}
        </span>
      )}
    </div>
  );
}
