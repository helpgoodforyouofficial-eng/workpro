/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cog, Wrench, Clock, X } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const MaintenanceModal: React.FC = () => {
  const { isMaintenanceMode, toggleMaintenanceMode, currentUser } = usePOS();
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [secondsLeft, setSecondsLeft] = useState<number>(7190); // ~2 hours

  useEffect(() => {
    if (!isMaintenanceMode) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMaintenanceMode]);

  if (!isMaintenanceMode) return null;

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  const timerStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white text-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-t-8 border-[#e67e22] p-6 text-center relative animate-in zoom-in-95 duration-200">
        {/* Admin dismiss button */}
        {currentUser?.role === 'admin' && (
          <button
            type="button"
            onClick={toggleMaintenanceMode}
            title="Admin Override: Close Maintenance"
            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Language Switch */}
        <div className="flex justify-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-4 py-1 text-xs font-bold rounded-full border transition-all ${
              lang === 'en'
                ? 'bg-[#e67e22] text-white border-[#e67e22] shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('ur')}
            className={`px-4 py-1 text-xs font-bold rounded-full border font-urdu transition-all ${
              lang === 'ur'
                ? 'bg-[#e67e22] text-white border-[#e67e22] shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            اردو
          </button>
        </div>

        {/* Animated Gears Icon */}
        <div className="flex items-center justify-center gap-3 text-[#e67e22] mb-4">
          <Cog className="w-12 h-12 animate-spin [animation-duration:4s]" />
          <Wrench className="w-10 h-10 animate-bounce [animation-duration:2s]" />
        </div>

        {/* Content based on language */}
        {lang === 'en' ? (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">System Under Maintenance</h2>
            <div className="w-16 h-0.5 bg-slate-200 mx-auto my-3" />
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              We are currently upgrading and optimizing the system to improve your experience. Wholesaler Khata and cash book modifications are temporarily paused.
            </p>
          </div>
        ) : (
          <div dir="rtl">
            <h2 className="text-xl font-bold text-slate-800 mb-2 font-urdu">سسٹم کی بہتری کا کام جاری ہے</h2>
            <div className="w-16 h-0.5 bg-slate-200 mx-auto my-3" />
            <p className="text-xs text-slate-500 leading-relaxed mb-5 font-urdu">
              ہم آپ کے تجربے کو مزید بہتر بنانے کے لیے سسٹم میں اہم اپڈیٹس اور اصلاحات کر رہے ہیں۔ اس دوران ہول سیل کھاتا اور کیش بک میں تبدیلیاں عارضی طور پر معطل ہیں۔
            </p>
          </div>
        )}

        {/* Countdown Box */}
        <div className="bg-[#fff5e6] border border-[#ffe0b2] rounded-xl p-3 text-[#d35400] text-xs font-bold flex items-center justify-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          <span>{lang === 'en' ? 'Estimated Time:' : 'تخمینہ وقت:'}</span>
          <span className="font-mono bg-[#e67e22] text-white px-2 py-0.5 rounded text-sm tracking-wider">
            {timerStr}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-2">
          {lang === 'en' ? 'Please wait a moment. The system will be restored shortly.' : 'براہ کرم تھوڑی دیر انتظار فرمائیں۔ سسٹم جلد بحال کر دیا جائے گا۔'}
        </p>

        <p className="text-[10px] text-slate-400">
          {lang === 'en' ? 'Thank you for your patience and cooperation!' : 'شکریہ: تعاون اور صبر کے لیے آپ کا شکریہ!'}
        </p>

        {currentUser?.role === 'admin' && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={toggleMaintenanceMode}
              className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Admin Override: Turn Off Maintenance Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
