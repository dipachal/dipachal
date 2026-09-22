import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Bus, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Language, AdminUser } from '../../types';

interface AdminLoginPageProps {
  lang: Language;
  onLoginSuccess: (user: AdminUser) => void;
  onBackToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  lang,
  onLoginSuccess,
  onBackToPublic,
}) => {
  const isBn = lang === 'bn';

  const [email, setEmail] = useState('admin@dwipachal.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email === 'admin@dwipachal.com' && password === 'admin123') {
      const user: AdminUser = {
        id: 'usr-admin-01',
        name: 'দ্বীপাচল সুপার অ্যাডমিন',
        email: 'admin@dwipachal.com',
        role: 'super_admin',
        permissions: ['all']
      };
      onLoginSuccess(user);
    } else if (email === 'operator@dwipachal.com' && password === 'operator123') {
      const user: AdminUser = {
        id: 'usr-op-02',
        name: 'সেন্ট্রাল রোড ডিসপ্যাচার',
        email: 'operator@dwipachal.com',
        role: 'operator',
        permissions: ['trips', 'tracking']
      };
      onLoginSuccess(user);
    } else {
      // Allow custom email demo login as well
      const user: AdminUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: 'fleet_manager',
        permissions: ['all']
      };
      onLoginSuccess(user);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'operator') => {
    if (role === 'admin') {
      onLoginSuccess({
        id: 'usr-admin-01',
        name: isBn ? 'দ্বীপাচল সুপার অ্যাডমিন' : 'Dwipachal Super Admin',
        email: 'admin@dwipachal.com',
        role: 'super_admin',
        permissions: ['all']
      });
    } else {
      onLoginSuccess({
        id: 'usr-op-02',
        name: isBn ? 'টার্মিনাল ডিসপ্যাচ অফিসার' : 'Terminal Dispatch Officer',
        email: 'operator@dwipachal.com',
        role: 'operator',
        permissions: ['trips', 'tracking']
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600 via-slate-900 to-black" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'পাবলিক পোর্টালে ফিরে যান' : 'Back to Public Portal'}</span>
        </button>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black font-serif text-white tracking-tight">
              {isBn ? 'দ্বীপাচল এন্টারপ্রাইজ' : 'Dwipachal Enterprise'}
            </h2>
            <span className="text-[11px] text-emerald-400 font-bold">
              {isBn ? 'ফ্লিট ম্যানেজমেন্ট সিস্টেম' : 'Fleet Management Portal'}
            </span>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          <div className="text-center pb-2 border-b border-slate-800">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isBn ? 'নিরাপদ অ্যাডমিন অথেন্টিকেশন' : 'Staff Secure Authentication'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn ? 'বাস বহর ও রোড মনিটরিং পোর্টাল পরিচালনা' : 'Sign in to access real-time dispatch and fleet dashboard'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'অফিসিয়াল ইমেইল' : 'Corporate Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dwipachal.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isBn ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isBn ? 'লগইন করুন' : 'Sign In'}
            </button>
          </form>

          {/* Instant Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block text-center">
              {isBn ? 'দ্রুত ডেমো লগইন বাটন (এক ক্লিকে প্রবেশ)' : 'Quick Demo Access:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer text-center"
              >
                {isBn ? '👑 সুপার অ্যাডমিন' : '👑 Super Admin'}
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('operator')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer text-center"
              >
                {isBn ? '🚦 ডিসপ্যাচার' : '🚦 Operator'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
