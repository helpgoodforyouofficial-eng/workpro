/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, User, LogIn, Briefcase, ShoppingBag } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { TajLogo } from '../components/TajLogo';
import { UserRole } from '../types/pos';

export const LoginView: React.FC = () => {
  const { login } = usePOS();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [role, setRole] = useState<UserRole>('admin');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username darj karein!');
      return;
    }
    const success = login(username.trim(), role);
    if (!success) {
      setError('Ghalat Username ya Password!');
    }
  };

  const handleQuickLogin = (uname: string, urole: UserRole) => {
    setUsername(uname);
    setRole(urole);
    login(uname, urole);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 w-full max-w-sm text-center relative overflow-hidden">
        {/* Subtle top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-600" />

        {/* Taj Logo Emblem */}
        <div className="flex justify-center mb-4">
          <TajLogo size="lg" />
        </div>

        <h2 className="text-2xl font-black text-[#2c3e50] tracking-tight flex items-center justify-center gap-1.5">
          <span>Taj POS Pro</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white rounded font-mono font-bold">
            v15.8.2
          </span>
        </h2>
        <p className="text-xs text-[#95a5a6] font-medium mt-1">Please login to your account</p>
        <p className="text-xs text-amber-600 font-urdu font-bold mt-0.5">تاج کریانہ اینڈ موبائل شاپ</p>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 text-xs text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Username (e.g. admin)"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Password"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
            >
              <option value="admin">👑 Admin (مالک / Full Control)</option>
              <option value="manager">📋 Manager (منیجر / Accounts & Stock)</option>
              <option value="cashier">💵 Cashier (کاؤنٹر کیشئر / Sales & Cash)</option>
              <option value="salesman">🚚 Salesman (سیلز مین / Customer Supply)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2980b9] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Now</span>
          </button>
        </form>

        {/* Quick Click Demo Logins */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Quick One-Click Demo Roles
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('Malik (Admin)', 'admin')}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Munshi (Manager)', 'manager')}
              className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              <span>Manager</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Counter Boy', 'cashier')}
              className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Cashier</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Rider', 'salesman')}
              className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              <span>Salesman</span>
            </button>
          </div>
        </div>

        {/* Footer Text from PHP code */}
        <div className="mt-8 text-[10px] text-[#bdc3c7] font-bold tracking-widest uppercase">
          POWERED BY WASI DEVELOPER • v15.8.2
        </div>
      </div>
    </div>
  );
};
