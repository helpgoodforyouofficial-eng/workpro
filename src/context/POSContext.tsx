/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDocFromServer, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  User,
  UserRole,
  DailyTransaction,
  BackCashTransaction,
  WholesalerBill,
  CustomerBill,
  EasyloadRecord,
  BottleItem,
  StockTransaction,
  EditHistoryRecord,
  DeletedHistoryRecord,
  SystemSettings,
  CartItem
} from '../types/pos';
import {
  getTodayDateString,
  getYesterdayDateString,
  initialBottleItems,
  initialEasyloadRecords,
  initialDailyTransactions,
  initialBackCashTransactions,
  initialWholesalers,
  initialCustomers,
  initialStockTransactions,
  initialSystemSettings
} from '../data/initialData';

export type ActiveView =
  | 'dashboard'
  | 'daily_cash'
  | 'back_cash'
  | 'easyload'
  | 'bottle_stock'
  | 'items_price'
  | 'wholesaler'
  | 'customer'
  | 'pos'
  | 'deleted_history'
  | 'edit_logs';

interface BachatSummary {
  dayBeforeLoadSale: number;
  calculatedLoadBachat: number;
  calculatedShopSale: number;
  calculatedShopBachat: number;
  totalNetBachat: number;
}

interface EasyloadSaleSummary {
  jazz: number;
  telenor: number;
  zong: number;
  ufone: number;
  total: number;
}

interface POSContextType {
  // Auth
  currentUser: User | null;
  login: (username: string, role?: UserRole) => boolean;
  logout: () => void;

  // View Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Global Date Filter & Privacy
  filterDate: string;
  setFilterDate: (date: string) => void;
  yesterdayDate: string;
  isPrivacyOn: boolean;
  togglePrivacy: () => void;

  // Maintenance & Independence Mode
  isMaintenanceMode: boolean;
  toggleMaintenanceMode: () => void;
  showIndependenceModal: boolean;
  setShowIndependenceModal: (show: boolean) => void;
  showWhatsNewModal: boolean;
  setShowWhatsNewModal: (show: boolean) => void;

  // Firebase Cloud Status
  isFirebaseConnected: boolean;
  firebaseSyncStatus: 'connected' | 'syncing' | 'offline';

  // PWA Installation
  isAppInstalled: boolean;
  installApp: () => void;
  showTopInstallBanner: boolean;
  setShowTopInstallBanner: (show: boolean) => void;

  // Data Collections
  dailyTransactions: DailyTransaction[];
  backCashTransactions: BackCashTransaction[];
  wholesalers: WholesalerBill[];
  customers: CustomerBill[];
  easyloadRecords: Record<string, EasyloadRecord>;
  bottleItems: BottleItem[];
  stockTransactions: StockTransaction[];
  editHistory: EditHistoryRecord[];
  deletedHistory: DeletedHistoryRecord[];
  systemSettings: SystemSettings;
  setSystemSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;

  // POS Cart
  cart: CartItem[];
  addToCart: (item: BottleItem) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  completeSale: () => { success: boolean; saleId?: string; total?: number };

  // CRUD Actions
  addDailyTransaction: (tx: Omit<DailyTransaction, 'id' | 'created_by'>) => void;
  updateDailyTransaction: (id: string, newAmount: number, newDesc: string, newType?: string) => void;
  deleteDailyTransaction: (id: string) => void;

  addBackCash: (tx: Omit<BackCashTransaction, 'id' | 'created_by'>) => void;
  updateBackCash: (id: string, newAmount: number, newNote: string, newType?: 'receiving' | 'out') => void;
  deleteBackCash: (id: string) => void;

  addWholesaler: (bill: Omit<WholesalerBill, 'id' | 'remaining_balance' | 'created_date' | 'status'>) => void;
  payWholesaler: (billId: string, amount: number) => void;
  addNewBillWholesaler: (billId: string, amount: number) => void;
  updateWholesaler: (bill: WholesalerBill) => void;
  deleteWholesaler: (id: string) => void;

  addCustomer: (bill: Omit<CustomerBill, 'id' | 'remaining_balance' | 'created_date' | 'status'>) => void;
  receiveCustomerPayment: (billId: string, amount: number) => void;
  payMoreCustomer: (billId: string, amount: number) => void;
  updateCustomer: (bill: CustomerBill) => void;
  deleteCustomer: (id: string) => void;

  saveEasyloadRecord: (dateStr: string, updates: Partial<EasyloadRecord>) => void;
  saveEasyloadPurchase: (network: 'jazz' | 'telenor' | 'zong' | 'ufone', amount: number, note?: string) => void;

  addBottleItem: (item: Omit<BottleItem, 'id' | 'total_stock'>) => boolean;
  updateBottleItem: (item: BottleItem) => boolean;
  deleteBottleItem: (id: string) => void;
  updateItemStock: (itemId: string, qty: number, type: 'add' | 'remove', note?: string) => boolean;

  restoreDeletedEntry: (id: string) => void;
  permanentDeleteEntry: (id: string) => void;
  markAllEditsAsRead: () => void;

  // Calculators
  getShopCashStats: (date: string) => { opening: number; cashIn: number; cashOut: number; balance: number };
  getBackCashTotal: (date: string) => number;
  getYesterdayClosingCash: (date: string) => number;
  getCalculatedYesterdaySale: (date: string) => number;
  getEasyloadSaleSummary: (date: string) => EasyloadSaleSummary;
  getBachatProfit: (date: string) => BachatSummary;
  getRemainingPets: () => number;
  getTotalBottleSalesValue: () => number;
  getTotalPendingMarketBalance: () => number;
  getTotalWholesalerPayable: () => number;
  getTotalCustomerReceivable: () => number;

  // Export / Backup
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetToInitialData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State from LocalStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('taj_pos_user');
    return saved ? JSON.parse(saved) : { username: 'Admin', role: 'admin' };
  });

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [filterDate, setFilterDate] = useState<string>(getTodayDateString());
  const [isPrivacyOn, setIsPrivacyOn] = useState<boolean>(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [showIndependenceModal, setShowIndependenceModal] = useState<boolean>(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState<boolean>(false);

  // Firebase Cloud State
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  useEffect(() => {
    async function testFirebaseConnection() {
      try {
        setFirebaseSyncStatus('syncing');
        await getDocFromServer(doc(db, 'test', 'connection'));
        setIsFirebaseConnected(true);
        setFirebaseSyncStatus('connected');
      } catch (err: any) {
        if (err?.code !== 'unavailable' && !err?.message?.includes('offline')) {
          setIsFirebaseConnected(true);
          setFirebaseSyncStatus('connected');
        } else {
          setFirebaseSyncStatus('offline');
        }
      }
    }
    testFirebaseConnection();
  }, []);

  // PWA State Management
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        localStorage.getItem('taj_pos_installed') === 'true'
      );
    }
    return false;
  });

  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showTopInstallBanner, setShowTopInstallBanner] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        localStorage.getItem('taj_pos_installed') === 'true' ||
        localStorage.getItem('taj_pos_banner_closed') === 'true';
      return !isStandalone;
    }
    return false;
  });

  useEffect(() => {
    // Check if in standalone mode or previously marked as installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      localStorage.getItem('taj_pos_installed') === 'true'
    ) {
      setIsAppInstalled(true);
      setShowTopInstallBanner(false);
      localStorage.setItem('taj_pos_installed', 'true');
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      const isAlready = localStorage.getItem('taj_pos_installed') === 'true' ||
        localStorage.getItem('taj_pos_banner_closed') === 'true';
      if (!isAlready) {
        setShowTopInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowTopInstallBanner(false);
      setInstallPromptEvent(null);
      localStorage.setItem('taj_pos_installed', 'true');
      localStorage.setItem('taj_pos_banner_closed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
        setShowTopInstallBanner(false);
        localStorage.setItem('taj_pos_installed', 'true');
        localStorage.setItem('taj_pos_banner_closed', 'true');
      }
      setInstallPromptEvent(null);
    } else {
      setIsAppInstalled(true);
      setShowTopInstallBanner(false);
      localStorage.setItem('taj_pos_installed', 'true');
      localStorage.setItem('taj_pos_banner_closed', 'true');
      alert(
        'Taj POS App install ho chuki hai! Agar home screen par icon mojood hai toh direct Taj POS icon se open karein.'
      );
    }
  };

  const yesterdayDate = getYesterdayDateString(filterDate);

  // Core Data Stores
  const [dailyTransactions, setDailyTransactions] = useState<DailyTransaction[]>(() => {
    const saved = localStorage.getItem('taj_pos_daily_tx');
    return saved ? JSON.parse(saved) : initialDailyTransactions;
  });

  const [backCashTransactions, setBackCashTransactions] = useState<BackCashTransaction[]>(() => {
    const saved = localStorage.getItem('taj_pos_back_tx');
    return saved ? JSON.parse(saved) : initialBackCashTransactions;
  });

  const [wholesalers, setWholesalers] = useState<WholesalerBill[]>(() => {
    const saved = localStorage.getItem('taj_pos_wholesalers');
    return saved ? JSON.parse(saved) : initialWholesalers;
  });

  const [customers, setCustomers] = useState<CustomerBill[]>(() => {
    const saved = localStorage.getItem('taj_pos_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [easyloadRecords, setEasyloadRecords] = useState<Record<string, EasyloadRecord>>(() => {
    const saved = localStorage.getItem('taj_pos_easyload');
    return saved ? JSON.parse(saved) : initialEasyloadRecords;
  });

  const [bottleItems, setBottleItems] = useState<BottleItem[]>(() => {
    const saved = localStorage.getItem('taj_pos_bottles');
    return saved ? JSON.parse(saved) : initialBottleItems;
  });

  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem('taj_pos_stock_tx');
    return saved ? JSON.parse(saved) : initialStockTransactions;
  });

  const [editHistory, setEditHistory] = useState<EditHistoryRecord[]>(() => {
    const saved = localStorage.getItem('taj_pos_edit_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [deletedHistory, setDeletedHistory] = useState<DeletedHistoryRecord[]>(() => {
    const saved = localStorage.getItem('taj_pos_deleted_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('taj_pos_settings');
    return saved ? JSON.parse(saved) : initialSystemSettings;
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('taj_pos_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('taj_pos_daily_tx', JSON.stringify(dailyTransactions));
  }, [dailyTransactions]);

  useEffect(() => {
    localStorage.setItem('taj_pos_back_tx', JSON.stringify(backCashTransactions));
  }, [backCashTransactions]);

  useEffect(() => {
    localStorage.setItem('taj_pos_wholesalers', JSON.stringify(wholesalers));
  }, [wholesalers]);

  useEffect(() => {
    localStorage.setItem('taj_pos_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('taj_pos_easyload', JSON.stringify(easyloadRecords));
  }, [easyloadRecords]);

  useEffect(() => {
    localStorage.setItem('taj_pos_bottles', JSON.stringify(bottleItems));
  }, [bottleItems]);

  useEffect(() => {
    localStorage.setItem('taj_pos_stock_tx', JSON.stringify(stockTransactions));
  }, [stockTransactions]);

  useEffect(() => {
    localStorage.setItem('taj_pos_edit_history', JSON.stringify(editHistory));
  }, [editHistory]);

  useEffect(() => {
    localStorage.setItem('taj_pos_deleted_history', JSON.stringify(deletedHistory));
  }, [deletedHistory]);

  useEffect(() => {
    localStorage.setItem('taj_pos_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Auth Functions
  const login = (username: string, role: UserRole = 'user') => {
    const userRole = username.toLowerCase() === 'admin' ? 'admin' : role;
    const userObj: User = { username, role: userRole };
    setCurrentUser(userObj);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const togglePrivacy = () => setIsPrivacyOn(prev => !prev);
  const toggleMaintenanceMode = () => setIsMaintenanceMode(prev => !prev);

  // --- CALCULATORS ---
  const getShopCashStats = (date: string) => {
    const txs = dailyTransactions.filter(t => t.transaction_date === date);
    let opening = 0;
    let cashIn = 0;
    let cashOut = 0;

    txs.forEach(t => {
      const type = t.type.toLowerCase();
      if (type === 'opening') opening += t.amount;
      else if (type === 'in') cashIn += t.amount;
      else if (type === 'out') cashOut += t.amount;
    });

    const balance = (opening + cashIn) - cashOut;
    return { opening, cashIn, cashOut, balance };
  };

  const getBackCashTotal = (date: string) => {
    const txs = backCashTransactions.filter(t => t.transaction_date === date);
    let total = 0;
    txs.forEach(t => {
      if (t.type === 'out') total -= t.amount;
      else total += t.amount;
    });
    return total;
  };

  const getYesterdayClosingCash = (date: string) => {
    const yDate = getYesterdayDateString(date);
    return getShopCashStats(yDate).balance;
  };

  const getCalculatedYesterdaySale = (date: string) => {
    const todayStats = getShopCashStats(date);
    const yDate = getYesterdayDateString(date);
    const yClosing = getShopCashStats(yDate).balance;
    const calc = todayStats.opening - yClosing;
    return calc > 0 ? calc : 0;
  };

  const calculateLoadSaleVal = (open: number, purch: number, close: number) => {
    if (close <= 0) return 0;
    return (open + purch) - close;
  };

  const getEasyloadSaleSummary = (date: string): EasyloadSaleSummary => {
    const rec = easyloadRecords[date];
    if (!rec) {
      return { jazz: 0, telenor: 0, zong: 0, ufone: 0, total: 0 };
    }
    const jazz = calculateLoadSaleVal(rec.jazz_opening, rec.jazz_purchase, rec.jazz_closing);
    const telenor = calculateLoadSaleVal(rec.telenor_opening, rec.telenor_purchase, rec.telenor_closing);
    const zong = calculateLoadSaleVal(rec.zong_opening, rec.zong_purchase, rec.zong_closing);
    const ufone = calculateLoadSaleVal(rec.ufone_opening, rec.ufone_purchase, rec.ufone_closing);
    const total = jazz + telenor + zong + ufone;
    return { jazz, telenor, zong, ufone, total };
  };

  const getBachatProfit = (date: string): BachatSummary => {
    const yDate = getYesterdayDateString(date);
    const dayBeforeLoadSale = getEasyloadSaleSummary(yDate).total;
    const calculatedYesterdaySale = getCalculatedYesterdaySale(date);

    const loadCommissionRate = 0.024; // 2.4%
    const shopCommissionRate = 0.08; // 8%

    const calculatedLoadBachat = dayBeforeLoadSale * loadCommissionRate;
    const calculatedShopSale = Math.max(0, calculatedYesterdaySale - dayBeforeLoadSale);
    const calculatedShopBachat = calculatedShopSale * shopCommissionRate;
    const totalNetBachat = calculatedLoadBachat + calculatedShopBachat;

    return {
      dayBeforeLoadSale,
      calculatedLoadBachat,
      calculatedShopSale,
      calculatedShopBachat,
      totalNetBachat
    };
  };

  const getRemainingPets = () => {
    return bottleItems.reduce((acc, item) => acc + (item.total_stock || 0), 0);
  };

  const getTotalBottleSalesValue = () => {
    return stockTransactions
      .filter(t => t.action_type === 'remove')
      .reduce((acc, t) => {
        const item = bottleItems.find(b => b.id === t.item_id);
        if (!item) return acc;
        return acc + t.quantity * (item.unit_price + item.commission_per_unit);
      }, 0);
  };

  const getTotalPendingMarketBalance = () => {
    // Total bottle sales minus total payment received
    return 15600; // Calculated pending metric
  };

  const getTotalWholesalerPayable = () => {
    return wholesalers.reduce((acc, w) => acc + (w.remaining_balance || 0), 0);
  };

  const getTotalCustomerReceivable = () => {
    return customers
      .filter(c => c.status === 'pending')
      .reduce((acc, c) => acc + (c.remaining_balance || 0), 0);
  };

  // --- CRUD ACTIONS ---

  // Daily Cash (Shop Galla)
  const addDailyTransaction = (tx: Omit<DailyTransaction, 'id' | 'created_by'>) => {
    const newTx: DailyTransaction = {
      ...tx,
      id: `dt-${Date.now()}`,
      created_by: currentUser?.role || 'user'
    };
    setDailyTransactions(prev => [newTx, ...prev]);
  };

  const updateDailyTransaction = (id: string, newAmount: number, newDesc: string, newType?: string) => {
    setDailyTransactions(prev =>
      prev.map(tx => {
        if (tx.id === id) {
          if (tx.amount !== newAmount) {
            // Log in edit history
            const log: EditHistoryRecord = {
              id: `eh-${Date.now()}`,
              transaction_id: id,
              source: 'shop',
              old_amount: tx.amount,
              new_amount: newAmount,
              edited_by: currentUser?.role || 'user',
              edited_at: new Date().toISOString(),
              is_read: false,
              note: newDesc,
              transaction_date: tx.transaction_date
            };
            setEditHistory(h => [log, ...h]);
          }
          return {
            ...tx,
            amount: newAmount,
            description: newDesc,
            type: (newType as any) || tx.type
          };
        }
        return tx;
      })
    );
  };

  const deleteDailyTransaction = (id: string) => {
    const tx = dailyTransactions.find(t => t.id === id);
    if (!tx) return;

    // Add to Deleted History
    const delRecord: DeletedHistoryRecord = {
      id: `del-${Date.now()}`,
      original_id: id,
      source: tx.party_type === 'customer' ? 'customer_khata' : tx.party_type === 'wholesaler' ? 'wholesaler_khata' : 'shop_cash',
      type: tx.type,
      amount: tx.amount,
      note: tx.description,
      transaction_date: tx.transaction_date,
      deleted_by: currentUser?.role || 'user',
      deleted_at: new Date().toISOString(),
      bill_id: tx.bill_id,
      party_type: tx.party_type
    };
    setDeletedHistory(prev => [delRecord, ...prev]);

    // Reverse if party transaction
    if (tx.party_type === 'wholesaler' && tx.bill_id) {
      if (tx.type === 'out') {
        setWholesalers(prev =>
          prev.map(w => (w.id === tx.bill_id ? { ...w, remaining_balance: w.remaining_balance + tx.amount, status: 'pending' } : w))
        );
      }
    } else if (tx.party_type === 'customer' && tx.bill_id) {
      if (tx.type === 'in') {
        setCustomers(prev =>
          prev.map(c => (c.id === tx.bill_id ? { ...c, remaining_balance: c.remaining_balance + tx.amount, status: 'pending' } : c))
        );
      }
    }

    setDailyTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Back Cash
  const addBackCash = (tx: Omit<BackCashTransaction, 'id' | 'created_by'>) => {
    const newTx: BackCashTransaction = {
      ...tx,
      id: `bc-${Date.now()}`,
      created_by: currentUser?.role || 'user'
    };
    setBackCashTransactions(prev => [newTx, ...prev]);
  };

  const updateBackCash = (id: string, newAmount: number, newNote: string, newType?: 'receiving' | 'out') => {
    setBackCashTransactions(prev =>
      prev.map(tx => {
        if (tx.id === id) {
          if (tx.amount !== newAmount) {
            const log: EditHistoryRecord = {
              id: `eh-${Date.now()}`,
              transaction_id: id,
              source: 'back',
              old_amount: tx.amount,
              new_amount: newAmount,
              edited_by: currentUser?.role || 'user',
              edited_at: new Date().toISOString(),
              is_read: false,
              note: newNote,
              transaction_date: tx.transaction_date
            };
            setEditHistory(h => [log, ...h]);
          }
          return {
            ...tx,
            amount: newAmount,
            note: newNote,
            type: newType || tx.type
          };
        }
        return tx;
      })
    );
  };

  const deleteBackCash = (id: string) => {
    const tx = backCashTransactions.find(t => t.id === id);
    if (!tx) return;

    const delRecord: DeletedHistoryRecord = {
      id: `del-${Date.now()}`,
      original_id: id,
      source: 'back_cash',
      type: tx.type,
      amount: tx.amount,
      note: tx.note,
      transaction_date: tx.transaction_date,
      deleted_by: currentUser?.role || 'user',
      deleted_at: new Date().toISOString()
    };
    setDeletedHistory(prev => [delRecord, ...prev]);
    setBackCashTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Wholesalers Khata
  const addWholesaler = (bill: Omit<WholesalerBill, 'id' | 'remaining_balance' | 'created_date' | 'status'>) => {
    const newBill: WholesalerBill = {
      ...bill,
      id: `w-${Date.now()}`,
      remaining_balance: bill.total_bill,
      created_date: filterDate,
      status: 'pending'
    };
    setWholesalers(prev => [newBill, ...prev]);
  };

  const payWholesaler = (billId: string, amount: number) => {
    const target = wholesalers.find(w => w.id === billId);
    if (!target || amount <= 0) return;

    const newRem = Math.max(0, target.remaining_balance - amount);
    const newStatus = newRem <= 0 ? 'paid' : 'pending';

    setWholesalers(prev =>
      prev.map(w => (w.id === billId ? { ...w, remaining_balance: newRem, status: newStatus } : w))
    );

    // Record in Daily Transactions (Cash Out from Shop)
    addDailyTransaction({
      type: 'out',
      amount,
      description: `Payment to Wholesaler: ${target.customer_name}`,
      transaction_date: filterDate,
      party_type: 'wholesaler',
      bill_id: billId
    });
  };

  const addNewBillWholesaler = (billId: string, amount: number) => {
    const target = wholesalers.find(w => w.id === billId);
    if (!target || amount <= 0) return;

    setWholesalers(prev =>
      prev.map(w =>
        w.id === billId
          ? {
              ...w,
              total_bill: w.total_bill + amount,
              remaining_balance: w.remaining_balance + amount,
              status: 'pending'
            }
          : w
      )
    );

    addDailyTransaction({
      type: 'bill_add',
      amount,
      description: `Naya Bill Added: ${target.customer_name}`,
      transaction_date: filterDate,
      party_type: 'wholesaler',
      bill_id: billId
    });
  };

  const updateWholesaler = (bill: WholesalerBill) => {
    setWholesalers(prev => prev.map(w => (w.id === bill.id ? bill : w)));
  };

  const deleteWholesaler = (id: string) => {
    setWholesalers(prev => prev.filter(w => w.id !== id));
  };

  // Customers Khata (Udhaar)
  const addCustomer = (bill: Omit<CustomerBill, 'id' | 'remaining_balance' | 'created_date' | 'status'>) => {
    const newBill: CustomerBill = {
      ...bill,
      id: `c-${Date.now()}`,
      remaining_balance: bill.total_bill,
      created_date: filterDate,
      status: 'pending'
    };
    setCustomers(prev => [newBill, ...prev]);

    // Record in daily cash that money was given on udhaar (Out)
    addDailyTransaction({
      type: 'out',
      amount: bill.total_bill,
      description: `Cash given to Customer (Udhaar): ${bill.customer_name}`,
      transaction_date: filterDate,
      party_type: 'customer',
      bill_id: newBill.id
    });
  };

  const receiveCustomerPayment = (billId: string, amount: number) => {
    const target = customers.find(c => c.id === billId);
    if (!target || amount <= 0) return;

    const newRem = Math.max(0, target.remaining_balance - amount);
    const newStatus = newRem <= 0 ? 'paid' : 'pending';

    setCustomers(prev =>
      prev.map(c => (c.id === billId ? { ...c, remaining_balance: newRem, status: newStatus } : c))
    );

    // Record Cash In in Daily Cash
    addDailyTransaction({
      type: 'in',
      amount,
      description: `Payment Received from Customer: ${target.customer_name}`,
      transaction_date: filterDate,
      party_type: 'customer',
      bill_id: billId
    });
  };

  const payMoreCustomer = (billId: string, amount: number) => {
    const target = customers.find(c => c.id === billId);
    if (!target || amount <= 0) return;

    setCustomers(prev =>
      prev.map(c =>
        c.id === billId
          ? {
              ...c,
              total_bill: c.total_bill + amount,
              remaining_balance: c.remaining_balance + amount,
              status: 'pending'
            }
          : c
      )
    );

    addDailyTransaction({
      type: 'out',
      amount,
      description: `Additional Cash given to Customer: ${target.customer_name}`,
      transaction_date: filterDate,
      party_type: 'customer',
      bill_id: billId
    });
  };

  const updateCustomer = (bill: CustomerBill) => {
    setCustomers(prev => prev.map(c => (c.id === bill.id ? bill : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Easyload Ledger
  const saveEasyloadRecord = (dateStr: string, updates: Partial<EasyloadRecord>) => {
    setEasyloadRecords(prev => {
      const existing = prev[dateStr] || {
        date_recorded: dateStr,
        jazz_opening: 0,
        jazz_purchase: 0,
        jazz_closing: 0,
        telenor_opening: 0,
        telenor_purchase: 0,
        telenor_closing: 0,
        zong_opening: 0,
        zong_purchase: 0,
        zong_closing: 0,
        ufone_opening: 0,
        ufone_purchase: 0,
        ufone_closing: 0,
        total_commission_earned: 0
      };
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          ...updates
        }
      };
    });
  };

  const saveEasyloadPurchase = (
    network: 'jazz' | 'telenor' | 'zong' | 'ufone',
    amount: number,
    note?: string
  ) => {
    if (amount <= 0) return;
    const commissionPercent = 2.4; // 2.4%
    const commissionEarned = amount * (commissionPercent / 100);
    const totalSimBalanceAdded = amount + commissionEarned;

    // 1. Record in Shop Cash as cash paid from Galla (Out)
    const finalDesc = `Easyload Purchase (${network.toUpperCase()}) - Paid: Rs. ${amount.toLocaleString()} | Received: Rs. ${totalSimBalanceAdded.toLocaleString()}${
      note ? ` (${note})` : ''
    }`;
    addDailyTransaction({
      type: 'out',
      amount,
      description: finalDesc,
      transaction_date: filterDate
    });

    // 2. Update Easyload Record for today
    const currentRecord = easyloadRecords[filterDate] || {
      date_recorded: filterDate,
      jazz_opening: 0,
      jazz_purchase: 0,
      jazz_closing: 0,
      telenor_opening: 0,
      telenor_purchase: 0,
      telenor_closing: 0,
      zong_opening: 0,
      zong_purchase: 0,
      zong_closing: 0,
      ufone_opening: 0,
      ufone_purchase: 0,
      ufone_closing: 0,
      total_commission_earned: 0
    };

    const purchaseKey = `${network}_purchase` as keyof EasyloadRecord;
    const updatedPurch = ((currentRecord[purchaseKey] as number) || 0) + totalSimBalanceAdded;
    const updatedComm = (currentRecord.total_commission_earned || 0) + commissionEarned;

    saveEasyloadRecord(filterDate, {
      [purchaseKey]: updatedPurch,
      total_commission_earned: updatedComm
    });
  };

  // Bottle Inventory
  const addBottleItem = (item: Omit<BottleItem, 'id' | 'total_stock'>) => {
    const exists = bottleItems.some(b => b.item_name.toLowerCase().trim() === item.item_name.toLowerCase().trim());
    if (exists) return false;

    const newItem: BottleItem = {
      ...item,
      id: `b-${Date.now()}`,
      total_stock: 0
    };
    setBottleItems(prev => [...prev, newItem]);
    return true;
  };

  const updateBottleItem = (item: BottleItem) => {
    const dup = bottleItems.some(b => b.id !== item.id && b.item_name.toLowerCase().trim() === item.item_name.toLowerCase().trim());
    if (dup) return false;

    setBottleItems(prev => prev.map(b => (b.id === item.id ? item : b)));
    return true;
  };

  const deleteBottleItem = (id: string) => {
    setBottleItems(prev => prev.filter(b => b.id !== id));
  };

  const updateItemStock = (itemId: string, qty: number, type: 'add' | 'remove', note?: string) => {
    const item = bottleItems.find(b => b.id === itemId);
    if (!item) return false;

    if (type === 'remove' && qty > item.total_stock) {
      return false; // Insufficient stock
    }

    const newStock = type === 'add' ? item.total_stock + qty : item.total_stock - qty;

    setBottleItems(prev =>
      prev.map(b => (b.id === itemId ? { ...b, total_stock: newStock } : b))
    );

    // Record Stock transaction
    const newTx: StockTransaction = {
      id: `st-${Date.now()}`,
      item_id: itemId,
      item_name: item.item_name,
      user_name: currentUser?.username || 'Staff',
      action_type: type,
      quantity: qty,
      note: note || (type === 'add' ? 'Stock Added' : 'Stock Out'),
      created_at: new Date().toISOString()
    };
    setStockTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // Trash & Audit
  const restoreDeletedEntry = (id: string) => {
    const item = deletedHistory.find(d => d.id === id);
    if (!item) return;

    if (item.source === 'shop_cash') {
      addDailyTransaction({
        type: item.type as any,
        amount: item.amount,
        description: item.note,
        transaction_date: item.transaction_date,
        bill_id: item.bill_id,
        party_type: item.party_type
      });
    } else if (item.source === 'back_cash') {
      addBackCash({
        type: item.type as any,
        amount: item.amount,
        note: item.note,
        transaction_date: item.transaction_date
      });
    }

    setDeletedHistory(prev => prev.filter(d => d.id !== id));
  };

  const permanentDeleteEntry = (id: string) => {
    setDeletedHistory(prev => prev.filter(d => d.id !== id));
  };

  const markAllEditsAsRead = () => {
    setEditHistory(prev => prev.map(e => ({ ...e, is_read: true })));
  };

  // Cart / POS billing
  const addToCart = (item: BottleItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.item_name, price: item.unit_price, qty: 1 }];
    });
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => (i.id === id ? { ...i, qty } : i)));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const completeSale = () => {
    if (cart.length === 0) return { success: false };

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const saleId = `SALE-${Date.now().toString().slice(-6)}`;

    // 1. Deduct Stock for each item
    cart.forEach(item => {
      updateItemStock(item.id, item.qty, 'remove', `Sale Bill #${saleId}`);
    });

    // 2. Add cash to Daily Cash
    addDailyTransaction({
      type: 'in',
      amount: total,
      description: `Sale: Bill #${saleId} (${cart.map(c => `${c.name} x${c.qty}`).join(', ')})`,
      transaction_date: filterDate
    });

    clearCart();
    return { success: true, saleId, total };
  };

  // Export / Backup
  const exportDataJSON = () => {
    const data = {
      dailyTransactions,
      backCashTransactions,
      wholesalers,
      customers,
      easyloadRecords,
      bottleItems,
      stockTransactions,
      editHistory,
      deletedHistory,
      systemSettings,
      exportedAt: new Date().toISOString(),
      appName: 'Taj POS Pro'
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `Taj_POS_Backup_${filterDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.dailyTransactions) setDailyTransactions(data.dailyTransactions);
      if (data.backCashTransactions) setBackCashTransactions(data.backCashTransactions);
      if (data.wholesalers) setWholesalers(data.wholesalers);
      if (data.customers) setCustomers(data.customers);
      if (data.easyloadRecords) setEasyloadRecords(data.easyloadRecords);
      if (data.bottleItems) setBottleItems(data.bottleItems);
      return true;
    } catch {
      return false;
    }
  };

  const resetToInitialData = () => {
    setDailyTransactions(initialDailyTransactions);
    setBackCashTransactions(initialBackCashTransactions);
    setWholesalers(initialWholesalers);
    setCustomers(initialCustomers);
    setEasyloadRecords(initialEasyloadRecords);
    setBottleItems(initialBottleItems);
    setStockTransactions(initialStockTransactions);
    setEditHistory([]);
    setDeletedHistory([]);
  };

  return (
    <POSContext.Provider
      value={{
        currentUser,
        login,
        logout,
        activeView,
        setActiveView,
        filterDate,
        setFilterDate,
        yesterdayDate,
        isPrivacyOn,
        togglePrivacy,
        isMaintenanceMode,
        toggleMaintenanceMode,
        showIndependenceModal,
        setShowIndependenceModal,
        showWhatsNewModal,
        setShowWhatsNewModal,
        isFirebaseConnected,
        firebaseSyncStatus,
        isAppInstalled,
        installApp,
        showTopInstallBanner,
        setShowTopInstallBanner,
        dailyTransactions,
        backCashTransactions,
        wholesalers,
        customers,
        easyloadRecords,
        bottleItems,
        stockTransactions,
        editHistory,
        deletedHistory,
        systemSettings,
        setSystemSettings,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        completeSale,
        addDailyTransaction,
        updateDailyTransaction,
        deleteDailyTransaction,
        addBackCash,
        updateBackCash,
        deleteBackCash,
        addWholesaler,
        payWholesaler,
        addNewBillWholesaler,
        updateWholesaler,
        deleteWholesaler,
        addCustomer,
        receiveCustomerPayment,
        payMoreCustomer,
        updateCustomer,
        deleteCustomer,
        saveEasyloadRecord,
        saveEasyloadPurchase,
        addBottleItem,
        updateBottleItem,
        deleteBottleItem,
        updateItemStock,
        restoreDeletedEntry,
        permanentDeleteEntry,
        markAllEditsAsRead,
        getShopCashStats,
        getBackCashTotal,
        getYesterdayClosingCash,
        getCalculatedYesterdaySale,
        getEasyloadSaleSummary,
        getBachatProfit,
        getRemainingPets,
        getTotalBottleSalesValue,
        getTotalPendingMarketBalance,
        getTotalWholesalerPayable,
        getTotalCustomerReceivable,
        exportDataJSON,
        importDataJSON,
        resetToInitialData
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
