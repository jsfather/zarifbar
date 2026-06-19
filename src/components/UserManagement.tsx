import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { apiFetch } from '../lib/api';
import { 
  UserPlus, Edit2, Trash2, KeyRound, ShieldAlert, Check, X, Shield, User as UserIcon, AlertCircle, RotateCw
} from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
  onToast: (msg: string) => void;
}

export default function UserManagement({ currentUser, onToast }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'writer'>('writer');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setErrorMsg('خطا در بارگذاری لیست کاربران.');
      }
    } catch (err) {
      setErrorMsg('ارتباط با سرور برقرار نشد.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('writer');
    setEditingUser(null);
    setIsAdding(false);
    setErrorMsg('');
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (user: User) => {
    resetForm();
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPassword('');
    setFormRole(user.role);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formName.trim() || !formUsername.trim()) {
      setErrorMsg('لطفاً نام و نام کاربری را پر نمایید.');
      return;
    }
    if (isAdding && !formPassword.trim()) {
      setErrorMsg('رمز عبور برای کاربر جدید الزامی است.');
      return;
    }

    const payload: Record<string, string> = {
      name: formName.trim(),
      username: formUsername.trim().toLowerCase(),
      role: formRole
    };
    if (formPassword.trim()) {
      payload.password = formPassword.trim();
    }

    try {
      if (isAdding) {
        const res = await apiFetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          onToast('کاربر جدید با موفقیت به سیستم اضافه شد.');
          resetForm();
          fetchUsers();
        } else {
          setErrorMsg(data.error || 'خطا در ثبت کاربر جدید.');
        }
      } else if (editingUser) {
        const res = await apiFetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          onToast('اطلاعات کاربر با موفقیت ویرایش گردید.');
          resetForm();
          fetchUsers();
        } else {
          setErrorMsg(data.error || 'خطا در بروزرسانی اطلاعات کاربر.');
        }
      }
    } catch (err) {
      setErrorMsg('ارتباط با سرور قطع شده است.');
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (username === 'admin') {
      alert('حذف ادمین پیش‌فرض و اصلی سیستم امکان‌پذیر نیست.');
      return;
    }
    if (currentUser.id === id) {
      alert('شما نمی‌توانید حساب کاربری خودتان را حذف نمایید.');
      return;
    }

    if (!window.confirm(`آیا از حذف حساب کاربری «${username}» اطمینان دارید؟`)) {
      return;
    }

    try {
      const res = await apiFetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        onToast('حساب کاربری با موفقیت حذف شد.');
        fetchUsers();
      } else {
        alert(data.error || 'خطا در حذف کاربر.');
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <UserIcon className="w-5.5 h-5.5 text-amber-500" />
            مدیریت همکاران و دسترسی‌های کاربران
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعریف نویسندگان جدید وبلاگ، همکاران بخش پاسخگویی، ایجاد دسترسی مدیریت و تغییر کلمات عبور
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={fetchUsers}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            بروزرسانی لیست
          </button>
          
          {!isAdding && !editingUser && (
            <button 
              type="button"
              onClick={handleStartAdd}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/15"
            >
              <UserPlus className="w-4 h-4" />
              افزودن همکار جدید
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editor / Creater Box */}
      {(isAdding || editingUser) && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200/50 shadow-md shadow-amber-500/5 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4.5 h-4.5 text-amber-500" />
              {isAdding ? 'تعریف حساب دسترسی جدید همکار' : `ویرایش و تغییر مشخصات کاربر: ${editingUser?.username}`}
            </h3>
            <button 
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="انصراف"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">نام کامل همکار (فارسی)</label>
              <input 
                type="text" 
                required
                placeholder="مثال: علیرضا محمدی"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">نام کاربری انگلیسی (جهت لاگین)</label>
              <input 
                type="text" 
                required
                disabled={editingUser && editingUser.username === 'admin'}
                placeholder="مثال: alireza"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 text-left font-sans disabled:opacity-50"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">
                {isAdding ? 'کلمه عبور / پسورد' : 'کلمه عبور جدید (اختیاری)'}
              </label>
              <input 
                type="password" 
                required={isAdding}
                placeholder={isAdding ? 'حداقل ۶ کاراکتر' : 'خالی بگذارید = بدون تغییر'}
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="w-full bg-gray-150 border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 text-left font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">نقش و سطح دسترسی</label>
              <select
                disabled={editingUser && editingUser.username === 'admin'}
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as 'admin' | 'writer')}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 disabled:opacity-50"
              >
                <option value="writer">نویسنده محتوا و بلاگ (محدود)</option>
                <option value="admin">مدیر کل سیستم (مشاهده همه چیز)</option>
              </select>
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
              >
                انصراف و بستن
              </button>
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10"
              >
                <Check className="w-4 h-4" />
                {isAdding ? 'ذخیره و ایجاد همکار' : 'ثبت تغییرات و تغییر پسورد'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-black text-slate-800">لیست تمامی حساب‌های ثبت شده در سیستم ({users.length} نفر)</span>
          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            فقط مدیر کل قادر به افزودن یا ویرایش همکاران است.
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-bold">در حال بارگذاری کاربران...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-bold">هیچ کاربری یافت نشد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/50 text-slate-500 font-black">
                <tr>
                  <th className="py-3.5 px-6">نام همکار</th>
                  <th className="py-3.5 px-6">نام کاربری (لاگین)</th>
                  <th className="py-3.5 px-6">سطح دسترسی نقش</th>
                  <th className="py-3.5 px-6 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold text-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-950 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                        {user.name[0]}
                      </div>
                      {user.name}
                      {currentUser.id === user.id && (
                        <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-bold">حساب شما</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-left" dir="ltr">{user.username}</td>
                    <td className="py-4 px-6">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] px-2.5 py-1 rounded-full font-black">
                          <Shield className="w-3.5 h-3.5 fill-rose-50" />
                          مدیر ارشد کل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] px-2.5 py-1 rounded-full font-black">
                          <UserIcon className="w-3.5 h-3.5" />
                          همکار / نویسنده
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleStartEdit(user)}
                          className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-lg text-[11px] font-black transition-colors"
                          title="ویرایش کاربر"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          ویرایش و رمز عبور
                        </button>
                        
                        {user.username !== 'admin' && currentUser.id !== user.id && (
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 px-3 rounded-lg text-[11px] font-black transition-colors"
                            title="حذف کاربر"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
