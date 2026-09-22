import React from 'react';
import { 
  Bus, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  LogOut, 
  Bell, 
  Bot, 
  Wifi, 
  WifiOff, 
  LayoutDashboard, 
  MapPin, 
  Phone 
} from 'lucide-react';
import { Language, AdminUser } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: 'public' | 'dashboard' | 'admin_login';
  setActiveView: (view: 'public' | 'dashboard' | 'admin_login') => void;
  currentUser: AdminUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  isOnline: boolean;
  alertCount: number;
  onOpenAlerts: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode,
  activeView,
  setActiveView,
  currentUser,
  onOpenLogin,
  onLogout,
  isOnline,
  alertCount,
  onOpenAlerts,
  onOpenChat,
}) => {
  const isBn = lang === 'bn';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('public')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-serif">
                {isBn ? 'দ্বীপাচল এন্টারপ্রাইজ' : 'Dwipachal Enterprise'}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {isBn ? 'পরিবহন ও ট্যুরিজম' : 'Fleet & Logistics'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {isBn ? 'নিরাপদ, বিলাসবহুল ও নির্ভরযোগ্য পরিবহন সেবা' : 'Luxury Coach & Inter-district Transport'}
            </p>
          </div>
        </div>

        {/* Public Navigation Links */}
        {activeView === 'public' && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => {
                document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isBn ? 'আমাদের বহর' : 'Our Fleet'}
            </button>
            <button 
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isBn ? 'ভাড়া ও যোগাযোগ' : 'Rent & Contact'}
            </button>
            <button 
              onClick={() => {
                document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isBn ? 'গ্রাহক মতামত' : 'Customer Reviews'}
            </button>
          </nav>
        )}

        {/* Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online status indicator */}
          <div 
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md text-slate-500 dark:text-slate-400"
            title={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-500" />
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isBn ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* AI Chatbot button */}
          <button
            onClick={onOpenChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 text-xs font-semibold transition-colors cursor-pointer"
            title="AI Support"
          >
            <Bot className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{isBn ? 'এআই চ্যাট' : 'AI Help'}</span>
          </button>

          {/* Admin / Portal switcher */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView(activeView === 'dashboard' ? 'public' : 'dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  activeView === 'dashboard'
                    ? 'bg-slate-800 text-white dark:bg-slate-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{activeView === 'dashboard' ? (isBn ? 'পাবলিক পোর্টাল' : 'Public Portal') : (isBn ? 'ফ্লিট ড্যাশবোর্ড' : 'Fleet Dashboard')}</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                title={isBn ? 'লগআউট' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
              <span>{isBn ? 'অ্যাডমিন লগইন' : 'Admin Login'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
