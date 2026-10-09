/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DailyTransaction,
  BackCashTransaction,
  WholesalerBill,
  CustomerBill,
  EasyloadRecord,
  BottleItem,
  StockTransaction,
  SystemSettings
} from '../types/pos';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (dateStr: string): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = getTodayDateString();
const yesterday = getYesterdayDateString(today);

export const initialBottleItems: BottleItem[] = [
  { id: '1', item_name: 'Pepsi 1.5L', category: 'Cold Drinks', total_stock: 45, unit_price: 180, commission_per_unit: 165, salesman_price: 170 },
  { id: '2', item_name: 'Coca Cola 1.5L', category: 'Cold Drinks', total_stock: 60, unit_price: 180, commission_per_unit: 165, salesman_price: 170 },
  { id: '3', item_name: '7Up 1.5L', category: 'Cold Drinks', total_stock: 35, unit_price: 180, commission_per_unit: 165, salesman_price: 170 },
  { id: '4', item_name: 'Sprite 1.5L', category: 'Cold Drinks', total_stock: 40, unit_price: 180, commission_per_unit: 165, salesman_price: 170 },
  { id: '5', item_name: 'Marinda 1.5L', category: 'Cold Drinks', total_stock: 25, unit_price: 180, commission_per_unit: 165, salesman_price: 170 },
  { id: '6', item_name: 'Dew 1.5L', category: 'Cold Drinks', total_stock: 30, unit_price: 180, commission_per_unit: 165, salesman_price: 170 },
  { id: '7', item_name: 'Pepsi 500ml', category: 'Cold Drinks', total_stock: 85, unit_price: 80, commission_per_unit: 72, salesman_price: 75 },
  { id: '8', item_name: 'Coca Cola 500ml', category: 'Cold Drinks', total_stock: 90, unit_price: 80, commission_per_unit: 72, salesman_price: 75 },
  { id: '9', item_name: 'Sting Berry 300ml', category: 'Cold Drinks', total_stock: 120, unit_price: 70, commission_per_unit: 62, salesman_price: 65 },
  { id: '10', item_name: 'Nestle Pure Life 1.5L', category: 'Mineral Water', total_stock: 50, unit_price: 110, commission_per_unit: 95, salesman_price: 100 },
  { id: '11', item_name: 'Aquafina 1.5L', category: 'Mineral Water', total_stock: 40, unit_price: 100, commission_per_unit: 88, salesman_price: 92 },
  { id: '12', item_name: 'Milkpak 1000ml', category: 'Dairy', total_stock: 35, unit_price: 290, commission_per_unit: 275, salesman_price: 280 }
];

export const initialEasyloadRecords: Record<string, EasyloadRecord> = {
  [yesterday]: {
    date_recorded: yesterday,
    jazz_opening: 12500,
    jazz_purchase: 10000,
    jazz_closing: 9800,
    telenor_opening: 8400,
    telenor_purchase: 5000,
    telenor_closing: 6200,
    zong_opening: 11000,
    zong_purchase: 8000,
    zong_closing: 8500,
    ufone_opening: 6500,
    ufone_purchase: 5000,
    ufone_closing: 5100,
    total_commission_earned: 672
  },
  [today]: {
    date_recorded: today,
    jazz_opening: 9800,
    jazz_purchase: 5000,
    jazz_closing: 7600,
    telenor_opening: 6200,
    telenor_purchase: 3000,
    telenor_closing: 4900,
    zong_opening: 8500,
    zong_purchase: 5000,
    zong_closing: 6800,
    ufone_opening: 5100,
    ufone_purchase: 2000,
    ufone_closing: 4300,
    total_commission_earned: 360
  }
};

export const initialDailyTransactions: DailyTransaction[] = [
  {
    id: 'dt-1',
    type: 'opening',
    amount: 35000,
    description: 'Subha Ka Opening Cash ⭐',
    transaction_date: yesterday,
    created_by: 'admin'
  },
  {
    id: 'dt-2',
    type: 'in',
    amount: 14500,
    description: 'General Store Cash Sale',
    transaction_date: yesterday,
    created_by: 'user'
  },
  {
    id: 'dt-3',
    type: 'out',
    amount: 10000,
    description: 'Easyload Purchase (JAZZ) - Paid: Rs. 10,000 | Received: Rs. 10,240',
    transaction_date: yesterday,
    created_by: 'admin'
  },
  {
    id: 'dt-4',
    type: 'opening',
    amount: 38200,
    description: 'Subha Ka Opening Cash ⭐',
    transaction_date: today,
    created_by: 'admin'
  },
  {
    id: 'dt-5',
    type: 'in',
    amount: 8500,
    description: 'Morning Karyana Cash Sale',
    transaction_date: today,
    created_by: 'user'
  },
  {
    id: 'dt-6',
    type: 'out',
    amount: 5000,
    description: 'Easyload Purchase (ZONG) - Paid: Rs. 5,000 | Received: Rs. 5,120',
    transaction_date: today,
    created_by: 'admin'
  }
];

export const initialBackCashTransactions: BackCashTransaction[] = [
  {
    id: 'bc-1',
    type: 'receiving',
    amount: 25000,
    note: 'Bank se Cash Wapsi / JazzCash Transfer',
    transaction_date: yesterday,
    created_by: 'admin'
  },
  {
    id: 'bc-2',
    type: 'receiving',
    amount: 30000,
    note: 'Safe Lock Deposit',
    transaction_date: today,
    created_by: 'admin'
  },
  {
    id: 'bc-3',
    type: 'out',
    amount: 8000,
    note: 'Dealer Payment Cash Handover',
    transaction_date: today,
    created_by: 'admin'
  }
];

export const initialWholesalers: WholesalerBill[] = [
  {
    id: '1',
    customer_name: 'Pepsi Agency Sadiqabad',
    total_bill: 65000,
    remaining_balance: 18500,
    created_date: yesterday,
    status: 'pending',
    invoice_number: 'PEP-9821',
    agency_dealer_number: '0300-7896541',
    supplier_number: '0312-6549871',
    order_day: 'Monday',
    supply_day: 'Tuesday'
  },
  {
    id: '2',
    customer_name: 'Gourmet Beverages Distributor',
    total_bill: 42000,
    remaining_balance: 0,
    created_date: yesterday,
    status: 'paid',
    invoice_number: 'GRM-4412',
    agency_dealer_number: '0301-4455667',
    supplier_number: '0345-1122334',
    order_day: 'Wednesday',
    supply_day: 'Thursday'
  },
  {
    id: '3',
    customer_name: 'Nestle Pakistan Distributor',
    total_bill: 35000,
    remaining_balance: 12000,
    created_date: today,
    status: 'pending',
    invoice_number: 'NST-2024',
    agency_dealer_number: '0302-9988776',
    supplier_number: '0333-8877665',
    order_day: 'Thursday',
    supply_day: 'Friday'
  }
];

export const initialCustomers: CustomerBill[] = [
  {
    id: '1',
    customer_name: 'Haji Muhammad Aslam',
    total_bill: 14500,
    remaining_balance: 4500,
    created_date: yesterday,
    status: 'pending',
    invoice_number: 'INV-101',
    phone_number: '0300-1234567',
    address: 'Chowk Model Town, Street 4',
    order_day: '2026-10-01',
    supply_day: '2026-10-10'
  },
  {
    id: '2',
    customer_name: 'Malik Zeeshan (Bhatti Bakers)',
    total_bill: 8200,
    remaining_balance: 0,
    created_date: yesterday,
    status: 'paid',
    invoice_number: 'INV-102',
    phone_number: '0313-9876543',
    address: 'Near Old Bus Stand',
    order_day: '2026-10-03',
    supply_day: '2026-10-05'
  },
  {
    id: '3',
    customer_name: 'Chaudhry Rashid Gujjar',
    total_bill: 22000,
    remaining_balance: 12500,
    created_date: today,
    status: 'pending',
    invoice_number: 'INV-103',
    phone_number: '0305-5544332',
    address: 'Gulshan-e-Iqbal, Plot 14',
    order_day: '2026-10-07',
    supply_day: '2026-10-15'
  }
];

export const initialStockTransactions: StockTransaction[] = [
  {
    id: 'st-1',
    item_id: '1',
    item_name: 'Pepsi 1.5L',
    user_name: 'Admin',
    action_type: 'add',
    quantity: 50,
    note: 'Fresh Shipment received',
    created_at: '2026-10-07T10:15:00'
  },
  {
    id: 'st-2',
    item_id: '1',
    item_name: 'Pepsi 1.5L',
    user_name: 'User',
    action_type: 'remove',
    quantity: 5,
    note: 'Sold to Customer Haji Aslam',
    created_at: '2026-10-08T09:30:00'
  }
];

export const initialSystemSettings: SystemSettings = {
  user_can_delete: true,
  maintenance_mode: false
};
