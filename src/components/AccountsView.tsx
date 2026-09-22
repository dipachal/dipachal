import React, { useState } from 'react';
import { 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Filter, 
  DollarSign, 
  Calendar, 
  Tag, 
  AlertCircle,
  X,
  CreditCard
} from 'lucide-react';
import { Booking, Language, Transaction } from '../types';
import { formatCurrency, formatDate, toBnNumber } from '../utils/helpers';

interface AccountsViewProps {
  transactions: Transaction[];
  bookings: Booking[];
  language: Language;
  onAddTransaction: (tx: Transaction) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  transactions,
  bookings,
  language,
  onAddTransaction,
}) => {
  const isBn = language === 'bn';
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newCategoryBn, setNewCategoryBn] = useState('জাহাজ ফুয়েল ও পরিবহন');
  const [newAmount, setNewAmount] = useState<number>(3000);
  const [newMethod, setNewMethod] = useState<'cash' | 'bkash' | 'nagad' | 'bank'>('cash');
  const [newDescBn, setNewDescBn] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const dueBookings = bookings.filter(b => b.dueAmount > 0);
  const totalPendingDue = dueBookings.reduce((sum, b) => sum + b.dueAmount, 0);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Transaction = {
      id: `tx-${Date.now()}`,
      date: newDate,
      type: newType,
      categoryBn: newCategoryBn,
      categoryEn: newCategoryBn,
      amount: newAmount,
      paymentMethod: newMethod,
      descriptionBn: newDescBn || (newType === 'income' ? 'জমা' : 'খরচ'),
      descriptionEn: newDescBn || (newType === 'income' ? 'Income' : 'Expense')
    };

    onAddTransaction(created);
    setIsAddModalOpen(false);
    setNewDescBn('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isBn ? 'আয়-ব্যয় হিসাব ও ক্যাশ লেজার' : 'Accounts & Financial Ledger'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn 
              ? 'দ্বীপাচল এন্টারপ্রাইজের দৈনন্দিন আয়, খরচ ও বকেয়া পাওনার হিসাব' 
              : 'Daily cashflow, package expenses, ticket collections and dues'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন লেনদেন / খরচ যুক্ত করুন' : 'Add Transaction'}</span>
        </button>
      </div>

      {/* Financial Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">{isBn ? 'সর্বমোট আয় (জমা)' : 'Total Incomes'}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {formatCurrency(totalIncome, language)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{isBn ? 'বুকিং ও অগ্রিম কালেকশন' : 'From bookings & advances'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">{isBn ? 'সর্বমোট খরচ (ব্যয়)' : 'Total Expenses'}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {formatCurrency(totalExpense, language)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{isBn ? 'জাহাজ ফুয়েল, হোটেল ও ঘাট ফি' : 'Fuel, hotel, tolls'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">{isBn ? 'ক্যাশ ইন হ্যান্ড (নিট)' : 'Net Balance'}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {formatCurrency(netBalance, language)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">{isBn ? 'সচল উদ্বৃত্ত তহবিল' : 'Active working funds'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase">{isBn ? 'মোট বকেয়া পাওনা' : 'Pending Dues'}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {formatCurrency(totalPendingDue, language)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isBn ? `${toBnNumber(dueBookings.length)} জন যাত্রীর বকেয়া রয়েছে` : `${dueBookings.length} customers have dues`}
          </p>
        </div>
      </div>

      {/* Main Grid: Ledger on Left, Due Debtors list on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'দৈনন্দিন ক্যাশ লেনদেন বিবরণী' : 'Daily Cash Transactions'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'সকল প্রাপ্তি ও পরিশোধের রেকর্ড' : 'All recorded receipts and disbursements'}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'income', 'expense'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterType === type ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'all' && (isBn ? 'সকল' : 'All')}
                  {type === 'income' && (isBn ? 'আয় (জমা)' : 'Incomes')}
                  {type === 'expense' && (isBn ? 'ব্যয় (খরচ)' : 'Expenses')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{isBn ? 'তারিখ' : 'Date'}</th>
                  <th className="py-3 px-4">{isBn ? 'খাত / ক্যাটাগরি' : 'Category'}</th>
                  <th className="py-3 px-4">{isBn ? 'বিবরণ' : 'Description'}</th>
                  <th className="py-3 px-4">{isBn ? 'পেমেন্ট মাধ্যম' : 'Method'}</th>
                  <th className="py-3 px-4 text-right">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {formatDate(tx.date, language)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{tx.categoryBn}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={tx.descriptionBn}>
                      {tx.descriptionBn}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold whitespace-nowrap">
                      <span className={tx.type === 'income' ? 'text-emerald-700' : 'text-rose-600'}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, language)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Due Debtors Panel (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{isBn ? 'বকেয়া পাওনার তালিকা' : 'Pending Customer Dues'}</span>
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {toBnNumber(dueBookings.length)} {isBn ? 'জন' : 'pax'}
            </span>
          </div>

          <div className="space-y-3">
            {dueBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                {isBn ? 'বর্তমানে কোনো বকেয়া পাওনা নেই।' : 'No outstanding dues.'}
              </p>
            ) : (
              dueBookings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{b.customerName}</h4>
                      <p className="text-[11px] text-slate-600">{b.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-700 block">
                        {formatCurrency(b.dueAmount, language)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {b.ticketNo}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 truncate max-w-[150px]">{b.destination}</span>
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="font-bold text-amber-800 hover:underline"
                    >
                      {isBn ? 'তাগাদা দিন (Call)' : 'Remind'}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'নতুন আয় বা ব্যয়ের হিসাব যুক্ত করুন' : 'Record Transaction'}</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'লেনদেনের ধরণ:' : 'Transaction Type:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('income')}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      newType === 'income' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {isBn ? 'আয় (জমা)' : 'Income'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('expense')}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      newType === 'expense' 
                        ? 'bg-rose-600 text-white border-rose-600' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {isBn ? 'ব্যয় (খরচ)' : 'Expense'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'খাত / ক্যাটাগরি:' : 'Category:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'income' ? 'যেমন: বিশেষ টিকিট বুকিং' : 'যেমন: জাহাজ জ্বালানি ও টোল'}
                  value={newCategoryBn}
                  onChange={(e) => setNewCategoryBn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'টাকার পরিমাণ:' : 'Amount (BDT):'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'তারিখ:' : 'Date:'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}
                </label>
                <select
                  value={newMethod}
                  onChange={(e: any) => setNewMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                >
                  <option value="cash">ক্যাশ (Cash)</option>
                  <option value="bkash">বিকাশ (bKash)</option>
                  <option value="nagad">নগদ (Nagad)</option>
                  <option value="bank">ব্যাংক ডিপোজিট (Bank)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'সংক্ষিপ্ত বিবরণ:' : 'Description Notes:'}
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: সেন্টমার্টিন শিপ জ্বালানি ক্রয় ভাউচার নং #৮৯২"
                  value={newDescBn}
                  onChange={(e) => setNewDescBn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
