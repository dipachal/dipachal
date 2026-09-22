import React from 'react';
import { 
  Compass, 
  Phone, 
  Mail, 
  PlusCircle, 
  Globe, 
  MapPin,
  Calendar,
  Cloud,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { User } from 'firebase/auth';
import { CompanyInfo, Language } from '../types';

interface HeaderProps {
  company: CompanyInfo;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenNewBooking: () => void;
  activeTab: string;
  firebaseStatus?: { connected: boolean; projectId?: string; syncing?: boolean };
  onRefreshFirestore?: () => void;
  currentUser?: User | null;
  onOpenGoogleDrive?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  company,
  language,
  onLanguageChange,
  onOpenNewBooking,
  firebaseStatus,
  onRefreshFirestore,
  currentUser,
  onOpenGoogleDrive,
}) => {
  const isBn = language === 'bn';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top micro bar for contact info & official email */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {isBn ? 'দ্বীপাচল অফিসিয়াল ম্যানেজমেন্ট সিস্টেম' : 'Dwipachal Official Management System'}
          </span>
          <span className="text-slate-500">|</span>
          <a 
            href={`mailto:${company.email}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Official Email"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.email}</span>
          </a>
          <span className="text-slate-500">|</span>
          <a 
            href={`tel:${company.hotline}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.hotline}</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Firebase connection pill */}
          {firebaseStatus && (
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                firebaseStatus.connected 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
                  : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
              }`}
              title={`Firebase Project: ${firebaseStatus.projectId || 'Connecting...'}`}
            >
              <span className={`w-2 h-2 rounded-full ${firebaseStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'} ${firebaseStatus.syncing ? 'animate-ping' : ''}`} />
              <span>{firebaseStatus.connected ? (isBn ? 'ফায়ারবেজ সক্রিয়' : 'Firebase Live') : (isBn ? 'কানেক্টিং...' : 'Connecting...')}</span>
              {onRefreshFirestore && (
                <button 
                  onClick={onRefreshFirestore}
                  disabled={firebaseStatus.syncing}
                  className="hover:text-white ml-1 p-0.5"
                  title="Sync with Firestore"
                >
                  <RefreshCw className={`w-3 h-3 ${firebaseStatus.syncing ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">
              {isBn ? 'সদরঘাট ও কক্সবাজার' : 'Sadarghat & Cox’s Bazar'}
            </span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            id="lang-toggle-btn"
            onClick={() => onLanguageChange(isBn ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-colors border border-slate-700 cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3" />
            <span className="font-semibold">{isBn ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation brand header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {isBn ? company.nameBn : company.nameEn}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                {isBn ? 'ট্যুর বিডি' : 'Tour BD'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isBn ? company.sloganBn : company.sloganEn}
            </p>
          </div>
        </div>

        {/* Action items */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>
              {new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {onOpenGoogleDrive && (
            <button
              onClick={onOpenGoogleDrive}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-semibold border border-blue-200 transition-colors cursor-pointer"
              title="Google Drive"
            >
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">
                {currentUser ? (currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]) : (isBn ? 'গুগল ড্রাইভ' : 'Google Drive')}
              </span>
            </button>
          )}

          <button
            id="header-new-booking-btn"
            onClick={onOpenNewBooking}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBn ? 'নতুন বুকিং / টিকিট' : 'New Booking / Ticket'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
