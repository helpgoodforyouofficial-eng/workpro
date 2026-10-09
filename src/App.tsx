/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, Zap, Download } from 'lucide-react';
import { POSProvider, usePOS } from './context/POSContext';
import { Sidebar } from './components/Sidebar';
import { TajLogo } from './components/TajLogo';
import { WhatsNewModal } from './components/WhatsNewModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { IndependenceOverlay } from './components/IndependenceOverlay';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DailyCashView } from './views/DailyCashView';
import { BackCashView } from './views/BackCashView';
import { EasyloadLedgerView } from './views/EasyloadLedgerView';
import { BottleStockView } from './views/BottleStockView';
import { ItemsPriceView } from './views/ItemsPriceView';
import { WholesalerBillsView } from './views/WholesalerBillsView';
import { CustomerBillsView } from './views/CustomerBillsView';
import { POSSaleView } from './views/POSSaleView';
import { DeletedHistoryView } from './views/DeletedHistoryView';
import { EditHistoryLogsView } from './views/EditHistoryLogsView';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    isAppInstalled,
    installApp,
    showTopInstallBanner,
    setShowTopInstallBanner
  } = usePOS();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'daily_cash':
        return <DailyCashView />;
      case 'back_cash':
        return <BackCashView />;
      case 'easyload':
        return <EasyloadLedgerView />;
      case 'bottle_stock':
        return <BottleStockView />;
      case 'items_price':
        return <ItemsPriceView />;
      case 'wholesaler':
        return <WholesalerBillsView />;
      case 'customer':
        return <CustomerBillsView />;
      case 'pos':
        return <POSSaleView />;
      case 'deleted_history':
        return <DeletedHistoryView />;
      case 'edit_logs':
        return <EditHistoryLogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* PWA Install Banner matching PHP */}
      {!isAppInstalled && showTopInstallBanner && (
        <div className="bg-white text-[#2c3e50] px-4 py-2 text-center text-xs font-semibold shadow-md border-b-2 border-[#27ae60] flex items-center justify-center gap-3 sticky top-0 z-30 animate-in slide-in-from-top duration-300">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Install Taj POS App for better experience!</span>
          </span>
          <button
            type="button"
            onClick={installApp}
            className="px-3.5 py-1 bg-[#27ae60] hover:bg-emerald-700 text-white font-bold rounded-full text-[11px] transition-colors shadow-xs active:scale-95 cursor-pointer"
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setShowTopInstallBanner(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm ml-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="md:ml-64 flex-1 flex flex-col min-w-0">
        {/* Top Sticky Navbar */}
        <header className="bg-white px-4 py-3 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-[#2c3e50] hover:bg-slate-100 rounded-xl transition-colors md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="hidden md:flex p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <TajLogo size="sm" showSubtitle={false} />
              <div>
                <span className="font-black text-sm text-[#2c3e50] block tracking-tight leading-tight">
                  Taj POS Pro
                </span>
                <span className="text-[10px] text-amber-600 font-urdu block leading-tight font-bold">
                  تاج کریانہ اینڈ موبائل شاپ
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('pos')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              <span>New Sale</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl">
              <span className="font-bold text-slate-700">{currentUser.username}</span>
              <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                {currentUser.role}
              </span>
            </div>
          </div>
        </header>

        {/* View Content Container */}
        <main className="p-3 sm:p-5 max-w-4xl mx-auto w-full flex-1">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <WhatsNewModal />
      <MaintenanceModal />
      <IndependenceOverlay />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainAppContent />
    </POSProvider>
  );
}
