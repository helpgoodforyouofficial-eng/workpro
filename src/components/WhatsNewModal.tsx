/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const WhatsNewModal: React.FC = () => {
  const { showWhatsNewModal, setShowWhatsNewModal } = usePOS();
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  if (!showWhatsNewModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#2c3e50] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base tracking-tight">What&apos;s New in v15.8.2</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  lang === 'en' ? 'bg-[#e67e22] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ur')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg font-urdu transition-colors ${
                  lang === 'ur' ? 'bg-[#e67e22] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                اردو
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowWhatsNewModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 max-h-72 overflow-y-auto">
          {lang === 'en' ? (
            <div className="space-y-3 text-left">
              <p className="text-xs text-slate-500 font-medium">
                We have released version 15.8 with exciting new features and bug fixes:
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>
                  <span className="font-bold text-slate-900">Items Price Feature:</span> Added a brand new &quot;Items Price&quot; management section in the sidebar for easy price and stock control.
                </li>
                <li>
                  <span className="font-bold text-slate-900">Sidebar Menu Fix:</span> Fixed an issue where the sidebar menu did not open properly upon clicking the 3-lines icon.
                </li>
                <li>
                  <span className="font-bold text-slate-900">Subpixel Border Fix:</span> Resolved the mobile table scroll glitch where item bottom lines temporarily disappeared.
                </li>
                <li>
                  <span className="font-bold text-slate-900">System Maintenance Mode:</span> Added a professional maintenance lock feature with a live countdown timer and multi-language support.
                </li>
                <li>
                  <span className="font-bold text-slate-900">Enhanced UI Stability:</span> Improved overall app responsiveness, offline caching, and PWA capabilities.
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3 text-right" dir="rtl">
              <p className="text-xs text-slate-500 font-medium font-urdu">
                ہم نے ورژن 15.8 میں شاندار نئے فیچرز اور اصلاحات پیش کی ہیں:
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 list-disc pr-4 leading-relaxed font-urdu">
                <li>
                  <span className="font-bold text-slate-900">آئٹمز پرائس فیچر:</span> سائیڈ بار میں نیا &quot;Items Price&quot; مینیو شامل کر دیا گیا ہے جس سے اشیاء کی قیمتوں اور اسٹاک کو آسانی سے مینیج کیا جا سکتا ہے۔
                </li>
                <li>
                  <span className="font-bold text-slate-900">سائیڈ بار مینیو کا حل:</span> اس مسئلے کو مکمل طور پر حل کر دیا گیا ہے جس کی وجہ سے مینیو کھولنے میں دشواری ہوتی تھی۔
                </li>
                <li>
                  <span className="font-bold text-slate-900">لائن کا مسئلہ حل:</span> موبائل اسکرین پر ٹیبل کو اسکرول کرتے وقت نیچے والی گرے لائن غائب ہونے کا مسئلہ ٹھیک کر دیا گیا ہے۔
                </li>
                <li>
                  <span className="font-bold text-slate-900">مینٹیننس موڈ:</span> لائیو کاؤنٹ ڈاؤن ٹائمر اور ملٹی لینگویج سپورٹ کے ساتھ نیا مینٹیننس موڈ شامل کیا گیا ہے۔
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-center">
          <button
            type="button"
            onClick={() => setShowWhatsNewModal(false)}
            className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'en' ? 'Got it, Thanks!' : 'سمجھ گیا، شکریہ!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
