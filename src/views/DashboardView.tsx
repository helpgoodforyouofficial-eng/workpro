/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Eye,
  EyeOff,
  PlusCircle,
  TrendingUp,
  Bolt,
  Circle,
  Leaf,
  Radio,
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const DashboardView: React.FC = () => {
  const {
    filterDate,
    setFilterDate,
    yesterdayDate,
    isPrivacyOn,
    togglePrivacy,
    setActiveView,
    getShopCashStats,
    getBackCashTotal,
    getYesterdayClosingCash,
    getCalculatedYesterdaySale,
    getEasyloadSaleSummary,
    getBachatProfit,
    getRemainingPets,
    getTotalBottleSalesValue,
    getTotalPendingMarketBalance,
    dailyTransactions
  } = usePOS();

  // Calculations
  const shopStats = getShopCashStats(filterDate);
  const backCashTotal = getBackCashTotal(filterDate);
  const remainingPets = getRemainingPets();
  const totalSalesVal = getTotalBottleSalesValue();
  const pendingBalance = getTotalPendingMarketBalance();

  const yesterdayClosing = getYesterdayClosingCash(filterDate);
  const yesterdayOpening = getShopCashStats(yesterdayDate).opening;
  const todayOpening = shopStats.opening;
  const calculatedYesterdaySale = getCalculatedYesterdaySale(filterDate);

  const easyloadToday = getEasyloadSaleSummary(filterDate);
  const easyloadYesterday = getEasyloadSaleSummary(yesterdayDate);
  const bachat = getBachatProfit(filterDate);

  const formatPrivateAmount = (val: number, isCurrency = true) => {
    if (isPrivacyOn) return isCurrency ? 'Rs. ****' : '****';
    return isCurrency ? `Rs. ${val.toLocaleString()}` : val.toLocaleString();
  };

  const formattedDate = new Date(filterDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="space-y-4 pb-10">
      {/* Welcome Card with Date Picker */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Assalam-o-Alaikum! 👋
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-500">
            <span>Tareekh:</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Dynamic Date Filter Picker */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="py-1.5 px-3.5 bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold text-xs rounded-full shadow-xs cursor-pointer focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={togglePrivacy}
            title={isPrivacyOn ? 'Show Values' : 'Hide Values (Privacy)'}
            className={`p-2 rounded-full text-xs font-bold transition-colors ${
              isPrivacyOn
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isPrivacyOn ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Dashboard Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Back Cash Box */}
        <div className="relative rounded-2xl p-4 text-center text-white bg-[#2980b9] shadow-md shadow-[#2980b9]/20 flex flex-col justify-center min-h-[105px]">
          <button
            type="button"
            onClick={togglePrivacy}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            {isPrivacyOn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div
            onClick={() => setActiveView('back_cash')}
            className="cursor-pointer select-none group"
          >
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:scale-105 transition-transform">
              {formatPrivateAmount(backCashTotal)}
            </h3>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 opacity-90">
              Back Cash
            </p>
          </div>
        </div>

        {/* Shop Cash Box */}
        <div className="relative rounded-2xl p-4 text-center text-white bg-[#27ae60] shadow-md shadow-[#27ae60]/20 flex flex-col justify-center min-h-[105px]">
          <button
            type="button"
            onClick={togglePrivacy}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            {isPrivacyOn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div
            onClick={() => setActiveView('daily_cash')}
            className="cursor-pointer select-none group"
          >
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:scale-105 transition-transform">
              {formatPrivateAmount(shopStats.balance)}
            </h3>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 opacity-90">
              Shop Cash (Galla)
            </p>
          </div>
        </div>

        {/* Pending Box */}
        <div
          onClick={() => setActiveView('customer')}
          className="rounded-2xl p-4 text-center text-white bg-[#e67e22] shadow-md shadow-[#e67e22]/20 flex flex-col justify-center min-h-[105px] cursor-pointer group"
        >
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:scale-105 transition-transform">
            Rs. {pendingBalance.toLocaleString()}
          </h3>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 opacity-90">
            Pending Market
          </p>
        </div>

        {/* Pets / Bottle Stock Box */}
        <div className="relative rounded-2xl p-4 text-center text-white bg-[#2c3e50] shadow-md shadow-[#2c3e50]/20 flex flex-col justify-center min-h-[105px]">
          <button
            type="button"
            onClick={togglePrivacy}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            {isPrivacyOn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div
            onClick={() => setActiveView('bottle_stock')}
            className="cursor-pointer select-none group"
          >
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:scale-105 transition-transform">
              {formatPrivateAmount(remainingPets, false)} <span className="text-xs font-normal">Pets</span>
            </h3>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 opacity-90">
              Pets Stock
            </p>
          </div>
        </div>

        {/* Total Sales Value Box (Span 2 cols) */}
        <div className="col-span-2 relative rounded-2xl p-4 text-center text-white bg-[#00BFA5] shadow-md shadow-[#00BFA5]/20 flex flex-col justify-center">
          <button
            type="button"
            onClick={togglePrivacy}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            {isPrivacyOn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div onClick={() => setActiveView('bottle_stock')} className="cursor-pointer select-none">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {formatPrivateAmount(totalSalesVal)}
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-wider mt-0.5 opacity-90">
              Total Sales Value
            </p>
          </div>
        </div>
      </div>

      {/* Easyload Ledger Section (Matching load_index.php) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#e67e22]" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
              Easy Load Ledger ({formattedDate})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('daily_cash')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2c3e50] hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Load Purchase</span>
          </button>
        </div>

        {/* 4 Network Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Jazz */}
          <div className="p-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/60 text-xs space-y-1">
            <span className="font-bold text-amber-800 flex items-center gap-1">
              <Bolt className="w-3.5 h-3.5" /> JAZZ
            </span>
            <div className="flex justify-between text-slate-500">
              <span>Open:</span>
              <b>Rs. 9,800</b>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Purchase:</span>
              <b>Rs. 5,000</b>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Close:</span>
              <b>Rs. 7,600</b>
            </div>
            <div className="pt-1 border-t border-amber-200/60 flex justify-between font-bold text-emerald-700">
              <span>Today Sale:</span>
              <span>Rs. {easyloadToday.jazz.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Yest Sale:</span>
              <span>Rs. {easyloadYesterday.jazz.toLocaleString()}</span>
            </div>
          </div>

          {/* Telenor */}
          <div className="p-3 rounded-xl border-l-4 border-blue-500 bg-blue-50/60 text-xs space-y-1">
            <span className="font-bold text-blue-700 flex items-center gap-1">
              <Circle className="w-3.5 h-3.5" /> TELENOR
            </span>
            <div className="flex justify-between text-slate-500">
              <span>Open:</span>
              <b>Rs. 6,200</b>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Purchase:</span>
              <b>Rs. 3,000</b>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Close:</span>
              <b>Rs. 4,900</b>
            </div>
            <div className="pt-1 border-t border-blue-200/60 flex justify-between font-bold text-emerald-700">
              <span>Today Sale:</span>
              <span>Rs. {easyloadToday.telenor.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Yest Sale:</span>
              <span>Rs. {easyloadYesterday.telenor.toLocaleString()}</span>
            </div>
          </div>

          {/* Zong */}
          <div className="p-3 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/60 text-xs space-y-1">
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> ZONG
            </span>
            <div className="flex justify-between text-slate-500">
              <span>Open:</span>
              <b>Rs. 8,500</b>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Purchase:</span>
              <b>Rs. 5,000</b>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Close:</span>
              <b>Rs. 6,800</b>
            </div>
            <div className="pt-1 border-t border-emerald-200/60 flex justify-between font-bold text-emerald-700">
              <span>Today Sale:</span>
              <span>Rs. {easyloadToday.zong.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Yest Sale:</span>
              <span>Rs. {easyloadYesterday.zong.toLocaleString()}</span>
            </div>
          </div>

          {/* Ufone */}
          <div className="p-3 rounded-xl border-l-4 border-orange-500 bg-orange-50/60 text-xs space-y-1">
            <span className="font-bold text-orange-700 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" /> UFONE
            </span>
            <div className="flex justify-between text-slate-500">
              <span>Open:</span>
              <b>Rs. 5,100</b>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Purchase:</span>
              <b>Rs. 2,000</b>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Close:</span>
              <b>Rs. 4,300</b>
            </div>
            <div className="pt-1 border-t border-orange-200/60 flex justify-between font-bold text-emerald-700">
              <span>Today Sale:</span>
              <span>Rs. {easyloadToday.ufone.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Yest Sale:</span>
              <span>Rs. {easyloadYesterday.ufone.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Load Sales Overview Bar */}
        <div className="bg-[#34495e] text-white p-3 rounded-xl text-center">
          <small className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
            Total Load Sales Overview
          </small>
          <div className="flex items-center justify-around text-xs">
            <div>
              <span className="text-emerald-400 font-bold block text-[11px]">Selected Date</span>
              <b className="text-sm">Rs. {easyloadToday.total.toLocaleString()}</b>
            </div>
            <div className="h-6 w-px bg-slate-600 border-dashed" />
            <div>
              <span className="text-slate-300 font-bold block text-[11px]">Day Before</span>
              <b className="text-sm">Rs. {easyloadYesterday.total.toLocaleString()}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Yesterday Report / Calculation Boxes Layout (3 purple boxes) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#7d3c98] text-white p-3 rounded-xl text-center shadow-xs">
          <h4 className="text-xs font-extrabold sm:text-sm">Rs. {yesterdayOpening.toLocaleString()}</h4>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Yest. Opening</p>
        </div>

        <div className="bg-[#6c3483] text-white p-3 rounded-xl text-center shadow-xs">
          <h4 className="text-xs font-extrabold sm:text-sm">Rs. {yesterdayClosing.toLocaleString()}</h4>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Yest. Closing</p>
        </div>

        <div className="bg-[#512e5f] text-white p-3 rounded-xl text-center shadow-xs">
          <h4 className="text-xs font-extrabold sm:text-sm">Rs. {todayOpening.toLocaleString()}</h4>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Today Opening</p>
        </div>
      </div>

      {/* Calculated Yesterday Sale Box */}
      <div className="bg-[#8e44ad] text-white p-4 rounded-2xl text-center shadow-md shadow-[#8e44ad]/20">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight">
          Rs. {calculatedYesterdaySale.toLocaleString()}
        </h3>
        <p className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">
          Calculated Yesterday Sale
        </p>
      </div>

      {/* 🔥 DAILY BACHAT / PROFIT SUMMARY BOX (Matching PHP) */}
      <div className="bg-[#16a085] text-white p-4 sm:p-5 rounded-2xl shadow-md shadow-[#16a085]/20 space-y-3">
        <div className="flex items-center justify-between border-b border-white/20 pb-2.5 text-xs font-bold uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>📊 Kal ki Bachat Summary</span>
          </span>
          <span className="text-white/80 font-mono">(Profit Report)</span>
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-white/90">
              Load Bachat (2.4% of Rs. {bachat.dayBeforeLoadSale.toLocaleString()}):
            </span>
            <b className="font-mono">Rs. {bachat.calculatedLoadBachat.toFixed(2)}</b>
          </div>

          <div className="flex justify-between">
            <span className="text-white/90">
              Shop Bachat (8% of Rs. {bachat.calculatedShopSale.toLocaleString()}):
            </span>
            <b className="font-mono">Rs. {bachat.calculatedShopBachat.toFixed(2)}</b>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base border-t border-dashed border-white/30 pt-2.5 mt-2">
            <span className="font-bold">Total Asal Bachat:</span>
            <b className="text-[#f1c40f] font-mono text-lg font-black drop-shadow-xs">
              Rs. {bachat.totalNetBachat.toFixed(2)}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};
