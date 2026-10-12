/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  User,
  LogIn,
  Briefcase,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { TajLogo } from '../components/TajLogo';
import { UserRole } from '../types/pos';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, loginStaff, login } = usePOS();

  // Tab State: 'admin_google' | 'staff_login' | 'quick_demo'
  const [activeTab, setActiveTab] = useState<'admin_google' | 'staff_login' | 'quick_demo'>('admin_google');

  // Staff Form State
  const [staffUsername, setStaffUsername] = useState<string>('');
  const [staffPassword, setStaffPassword] = useState<string>('');

  // Demo Form State
  const [demoUsername, setDemoUsername] = useState<string>('admin');
  const [demoPassword, setDemoPassword] = useState<string>('admin123');
  const [demoRole, setDemoRole] = useState<UserRole>('admin');

  // Loading & Error
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    const result = await loginWithGoogle();
    setIsGoogleLoading(false);
    if (!result.success) {
      setError(result.error || 'Google se login fail ho gaya. Barahe karam dobara koshish karein.');
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!staffUsername.trim() || !staffPassword.trim()) {
      setError('Barahe karam Username aur Password dono darj karein.');
      return;
    }
    const result = loginStaff(staffUsername, staffPassword);
    if (!result.success) {
      setError(result.error || 'Ghalat details! Barahe karam Admin ki di gayi details darj karein.');
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoUsername.trim()) {
      setError('Username darj karein!');
      return;
    }
    login(demoUsername.trim(), demoRole);
  };

  const handleQuickDemoClick = (uname: string, urole: UserRole) => {
    login(uname, urole);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 w-full max-w-md text-center relative overflow-hidden">
        {/* Subtle top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-600" />

        {/* Taj Logo Emblem */}
        <div className="flex justify-center mb-3">
          <TajLogo size="lg" />
        </div>

        <h2 className="text-2xl font-black text-[#2c3e50] tracking-tight flex items-center justify-center gap-1.5">
          <span>Taj POS Pro</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white rounded font-mono font-bold">
            v15.8.2
          </span>
        </h2>
        <p className="text-xs text-[#95a5a6] font-medium mt-0.5">Cloud POS & Khata Management System</p>
        <p className="text-xs text-amber-600 font-urdu font-bold mt-0.5">تاج کریانہ اینڈ موبائل شاپ</p>

        {/* Login Type Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin_google');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'admin_google'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>👑 Main Admin</span>
            <span className="text-[9px] font-normal text-slate-400">Google Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('staff_login');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'staff_login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>💼 Staff / User</span>
            <span className="text-[9px] font-normal text-slate-400">ID & Password</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('quick_demo');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'quick_demo'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🧪 Demo Mode</span>
            <span className="text-[9px] font-normal text-slate-400">One-Click</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Real Admin Google Login */}
        {activeTab === 'admin_google' && (
          <div className="mt-6 space-y-4 text-left">
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-800">
                <span>👑 Asli Malik / Main Admin Login</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Main Admin apne real Google email address se login karein. Aapko bahesiyat Malik full control milega aur aap naye Staff accounts bana sakenge.
              </p>
            </div>

            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-2xl font-bold text-slate-700 text-sm shadow-sm flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer disabled:opacity-60"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Signing in with Google...' : 'Login with Google (Main Admin)'}</span>
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              <span>Firebase Cloud Auth • Real Email Sync</span>
            </div>
          </div>
        )}

        {/* Tab 2: Staff Login (Created by Admin) */}
        {activeTab === 'staff_login' && (
          <form onSubmit={handleStaffSubmit} className="mt-6 space-y-3.5 text-xs text-left">
            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-purple-900">
              <span className="font-bold">💼 Staff / Mulazim Login:</span>
              <p className="mt-0.5 text-purple-700">
                Admin ki banayi hui Username aur Password details darj karein.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={staffUsername}
                  onChange={e => {
                    setStaffUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. ali_cashier"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={staffPassword}
                  onChange={e => {
                    setStaffPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff Login Now</span>
            </button>
          </form>
        )}

        {/* Tab 3: Quick Demo Mode */}
        {activeTab === 'quick_demo' && (
          <div className="mt-6 text-left space-y-4">
            <p className="text-[11px] text-slate-500">
              Bina password ke direct testing ke liye neeche diye gaye demo buttons use karein:
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickDemoClick('Demo Admin', 'admin')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoClick('Demo Manager', 'manager')}
                className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Demo Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoClick('Demo Cashier', 'cashier')}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Cashier</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoClick('Demo Salesman', 'salesman')}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Salesman</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="mt-8 text-[10px] text-[#bdc3c7] font-bold tracking-widest uppercase">
          POWERED BY WASI DEVELOPER • TAJ POS PRO
        </div>
      </div>
    </div>
  );
};
