import React, { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      try {
        const response = await apiFetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onUpload(data.url);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl cursor-pointer transition-colors text-xs font-bold text-indigo-700">
        <Upload className="w-4 h-4" />
        {loading ? 'در حال آپلود...' : 'انتخاب و آپلود تصویر'}
        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
      </label>
      {success && (
        <span className="flex items-center justify-center gap-1 text-[10px] text-green-600 font-bold">
           <CheckCircle2 className="w-3 h-3"/> آپلود با موفقیت انجام شد
        </span>
      )}
    </div>
  );
}
