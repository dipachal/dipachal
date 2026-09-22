import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  DollarSign, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { Driver, Language } from '../../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  driver: Driver | null;
  onCompletePayment: (driverId: string, amount: number, trxId: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  lang,
  driver,
  onCompletePayment,
}) => {
  const isBn = lang === 'bn';

  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [amount, setAmount] = useState<number>(driver?.pendingPayoutBDT || 0);
  const [accountNumber, setAccountNumber] = useState(driver?.phone || '');
  const [trxId, setTrxId] = useState(`TRX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !driver) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onCompletePayment(driver.id, amount, trxId);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? 'চালক পে-আউট ও ট্রিপ সম্মানী পরিশোধ' : 'Driver Earnings Payout'}
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {driver.name} ({driver.phone})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!' : 'Payment Dispatched Successfully!'}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                TRX ID: {trxId} • ৳{amount.toLocaleString()} BDT
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Payment Method selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isBn ? 'পেমেন্ট চ্যানেল নির্বাচন করুন' : 'Select Channel'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'bkash', label: 'bKash', color: 'border-pink-500 text-pink-600 bg-pink-50/50 dark:bg-pink-950/30' },
                    { id: 'nagad', label: 'Nagad', color: 'border-orange-500 text-orange-600 bg-orange-50/50 dark:bg-orange-950/30' },
                    { id: 'rocket', label: 'Rocket', color: 'border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/30' },
                    { id: 'bank', label: 'Bank', color: 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        method === m.id
                          ? m.color + ' ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'পরিশোধের পরিমাণ (BDT)' : 'Payout Amount (BDT)'}
                  </label>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    {isBn ? 'বকেয়া:' : 'Pending:'} ৳{driver.pendingPayoutBDT.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={100}
                  max={driver.pendingPayoutBDT + 50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 dark:text-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'অ্যাকাউন্ট / মোবাইল নম্বর' : 'Account / Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'ট্রানজ্যাকশন আইডি (TRX ID)' : 'Transaction ID'}
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isBn ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm Payout'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
