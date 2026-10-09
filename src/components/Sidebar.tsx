/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  Wallet,
  Building2,
  Smartphone,
  Wine,
  Tags,
  Truck,
  Users,
  ShoppingCart,
  Trash2,
  Power,
  ChevronLeft,
  Sparkles,
  Flag,
  Wrench,
  Download,
  Upload,
  Zap,
  CheckCircle2,
  Cloud
} from 'lucide-react';
import { usePOS, ActiveView } from '../context/POSContext';
import { TajLogo } from './TajLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    logout,
    setShowWhatsNewModal,
    setShowIndependenceModal,
    toggleMaintenanceMode,
    isMaintenanceMode,
    exportDataJSON,
    importDataJSON,
    isAppInstalled,
    installApp,
    isFirebaseConnected
  } = usePOS();

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    onClose();
  };

  const confirmLogout = () => {
    if (window.confirm('Kya aap waqai logout karna chahte hain?')) {
      logout();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importDataJSON(text);
      if (success) {
        alert('Data backup kamyabi se import ho gaya!');
      } else {
        alert('Ghalat file format.');
      }
    };
    reader.readAsText(file);
  };

  const allNavItems: Array<{ id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'daily_cash', label: 'Daily Cash Book', icon: Wallet },
    { id: 'back_cash', label: 'Back Cash Manager', icon: Building2 },
    { id: 'easyload', label: 'Easy Load Ledger', icon: Smartphone },
    { id: 'bottle_stock', label: 'Bottle Stock', icon: Wine },
    { id: 'items_price', label: 'Items Price List', icon: Tags },
    { id: 'wholesaler', label: 'Wholesaler Khata', icon: Truck },
    { id: 'customer', label: 'Customer Khata', icon: Users },
    { id: 'pos', label: 'New Sale (POS Counter)', icon: ShoppingCart },
    { id: 'deleted_history', label: 'Deleted Logs (Trash)', icon: Trash2 }
  ];

  const userRole = currentUser?.role || 'admin';
  const navItems = allNavItems.filter(item => {
    if (userRole === 'admin') return true;
    if (userRole === 'manager') return item.id !== 'deleted_history';
    if (userRole === 'cashier') {
      return ['dashboard', 'daily_cash', 'easyload', 'pos', 'items_price'].includes(item.id);
    }
    if (userRole === 'salesman') {
      return ['dashboard', 'customer', 'items_price', 'pos'].includes(item.id);
    }
    return true;
  });

  return (
    <>
      {/* Dark Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#1b263b] text-slate-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="p-4 bg-[#0d1b2a] border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TajLogo size="sm" showSubtitle={false} />
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Taj POS Pro</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded font-mono font-bold">
                  v15.8.2
                </span>
              </h1>
              <p className="text-[10px] text-amber-300 font-urdu">تاج کریانہ اینڈ موبائل شاپ</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 bg-[#162235] border-b border-slate-700/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200 uppercase">
              {currentUser?.username.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-200">{currentUser?.username}</div>
              <div className="text-[10px] text-slate-400 capitalize">{currentUser?.role || 'Admin'}</div>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              userRole === 'admin'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : userRole === 'manager'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : userRole === 'cashier'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {userRole}
          </span>
        </div>

        {/* Firebase Cloud Sync Status Bar */}
        <div className="px-4 py-2 bg-[#121e30] border-b border-slate-700/50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Cloud className={`w-3.5 h-3.5 ${isFirebaseConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Firebase Cloud:</span>
          </div>
          <div className="flex items-center gap-1 font-bold">
            <span className={isFirebaseConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isFirebaseConnected ? 'Connected' : 'Connecting...'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFirebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2980b9] text-white shadow-md shadow-[#2980b9]/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Special Quick Actions Divider */}
          <div className="pt-2 pb-1 px-3">
            <div className="h-px bg-slate-700/60" />
          </div>

          {/* What's New trigger */}
          <button
            type="button"
            onClick={() => {
              setShowWhatsNewModal(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-amber-300 hover:bg-amber-950/30 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>What&apos;s New (v15.8)</span>
          </button>

          {/* 14 August Independence Celebration trigger */}
          <button
            type="button"
            onClick={() => {
              setShowIndependenceModal(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-950/30 rounded-xl transition-colors"
          >
            <Flag className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-urdu">14 اگست جھنڈا اینیمیشن</span>
          </button>

          {/* Maintenance Mode trigger */}
          <button
            type="button"
            onClick={() => {
              toggleMaintenanceMode();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <Wrench className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              {isMaintenanceMode ? 'Close Maintenance Mode' : 'System Maintenance'}
            </span>
          </button>
        </nav>

        {/* Footer Area: Backup & Logout */}
        <div className="p-3 bg-[#0d1b2a] border-t border-slate-700/60 space-y-2">
          {/* Backup / Export buttons */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={exportDataJSON}
              title="Download JSON backup of all POS data"
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 font-medium"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>Data Backup</span>
            </button>

            <label
              title="Import JSON backup file"
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 font-medium cursor-pointer"
            >
              <Upload className="w-3 h-3 text-blue-400" />
              <span>Restore</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          {/* PWA Install Button or Already Installed Badge */}
          {isAppInstalled ? (
            <div className="w-full py-2.5 px-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>✓ Already Installed</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={installApp}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/20 active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>⚡ Install Taj POS App</span>
            </button>
          )}

          {/* Modern Logout Button matching user's PHP CSS */}
          <button
            type="button"
            onClick={confirmLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/30 transition-all active:scale-95"
          >
            <Power className="w-4 h-4" />
            <span>Logout System</span>
          </button>
        </div>
      </aside>
    </>
  );
};
