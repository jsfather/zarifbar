import * as jalaali from 'jalaali-js';

export const gregorianToJalali = (gregorianDate: string): string => {
  // Input format: YYYY-MM-DD (Gregorian)
  if (!gregorianDate) return '';
  
  const [year, month, day] = gregorianDate.split('-').map(Number);
  const { jy, jm, jd } = jalaali.toJalaali(year, month, day);
  
  // Return in YYYY-MM-DD format (Jalali)
  return `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`;
};

export const jalaliToGregorian = (jalaliDate: string): string => {
  // Input format: YYYY-MM-DD (Jalali)
  if (!jalaliDate) return '';
  
  const [jy, jm, jd] = jalaliDate.split('-').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  
  // Return in YYYY-MM-DD format (Gregorian)
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
};

export const formatJalaliDate = (jalaliDate: string): string => {
  // Format: YYYY/MM/DD for display
  if (!jalaliDate) return '';
  return jalaliDate.replace(/-/g, '/');
};

export const getCurrentJalaliDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  const { jy, jm, jd } = jalaali.toJalaali(year, month, day);
  return `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`;
};
