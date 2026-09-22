import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  CreditCard,
  ShieldCheck,
  FileText,
  Cloud,
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { CompanyInfo, Language } from '../types';

interface SettingsViewProps {
  company: CompanyInfo;
  language: Language;
  onUpdateCompany: (info: CompanyInfo) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  firebaseStatus?: { connected: boolean; projectId?: string; syncing?: boolean; collectionsFound?: string[] };
  onSyncFromFirestore?: () => void;
  onPushToFirestore?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  company,
  language,
  onUpdateCompany,
  onExportData,
  onImportData,
  onResetData,
  firebaseStatus,
  onSyncFromFirestore,
  onPushToFirestore,
}) => {
  const isBn = language === 'bn';
  const [formData, setFormData] = useState<CompanyInfo>(company);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {isBn ? 'কোম্পানি প্রোফাইল ও সেটিংস' : 'Company Profile & Settings'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {isBn 
            ? 'দ্বীপাচল এন্টারপ্রাইজের অফিশিয়াল তথ্য, যোগাযোগের নম্বর ও ব্যাকআপ সংরক্ষণ' 
            : 'Dwipachal Enterprise official details, hotline, and database backup controls'}
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'প্রতিষ্ঠানের মূল বিবরণ' : 'Primary Enterprise Info'}
              </h3>
            </div>
            {isSaved && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                {isBn ? 'সফলভাবে সংরক্ষিত!' : 'Saved successfully!'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'কোম্পানির নাম (বাংলা):' : 'Company Name (Bangla):'}
              </label>
              <input
                type="text"
                value={formData.nameBn}
                onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'কোম্পানির নাম (English):' : 'Company Name (English):'}
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'স্লোগান / ট্যাগলাইন:' : 'Slogan / Tagline:'}
              </label>
              <input
                type="text"
                value={formData.sloganBn}
                onChange={(e) => setFormData({ ...formData, sloganBn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'অফিসিয়াল ইমেইল:' : 'Official Email:'}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'হটলাইন নম্বর:' : 'Primary Hotline:'}
              </label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'বিকল্প ফোন / হোয়াটসঅ্যাপ:' : 'Alt Phone / WhatsApp:'}
              </label>
              <input
                type="text"
                value={formData.altPhone}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'অফিস ঠিকানা (বাংলা):' : 'Office Address (Bangla):'}
              </label>
              <input
                type="text"
                value={formData.addressBn}
                onChange={(e) => setFormData({ ...formData, addressBn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'ট্রেড লাইসেন্স / রেজি নং:' : 'Registration / License No:'}
              </label>
              <input
                type="text"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isBn ? 'বিকাশ মার্চেন্ট একাউন্ট:' : 'bKash Merchant Account:'}
              </label>
              <input
                type="text"
                value={formData.bkashMerchant}
                onChange={(e) => setFormData({ ...formData, bkashMerchant: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              id="save-company-settings-btn"
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isBn ? 'তথ্য আপডেট করুন' : 'Save Company Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Firebase Cloud Live Database */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {isBn ? 'ফায়ারবেজ ক্লাউড ডেটাবেস সংযোগ' : 'Firebase Cloud Database'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${firebaseStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-xs font-bold text-slate-700">
              {firebaseStatus?.connected ? (isBn ? 'সক্রিয় ও কানেক্টেড' : 'Connected') : (isBn ? 'কানেক্টিং...' : 'Connecting...')}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Firebase Project ID:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
                {firebaseStatus?.projectId || 'gen-lang-client-0724546995'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Firestore Collections:</span>
              <span className="font-medium text-emerald-700">
                {firebaseStatus?.collectionsFound && firebaseStatus.collectionsFound.length > 0
                  ? firebaseStatus.collectionsFound.join(', ')
                  : (isBn ? 'বুকিং, প্যাকেজ, ট্রানজেকশন রেডি' : 'bookings, packages, transactions ready')}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {isBn
              ? 'আপনার ফায়ারবেজ ক্লাউড ডেটাবেসের সাথে সফটওয়্যারটি সরাসরি সংযুক্ত। যেকোনো নতুন বুকিং ও লেনদেন স্বয়ংক্রিয়ভাবে ক্লাউডে সংরক্ষিত হচ্ছে।'
              : 'Software is directly linked to your Firestore database. New bookings and payments persist automatically.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onSyncFromFirestore && (
              <button
                onClick={onSyncFromFirestore}
                disabled={firebaseStatus?.syncing}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${firebaseStatus?.syncing ? 'animate-spin' : ''}`} />
                <span>{isBn ? 'ফায়ারবেজ থেকে ডেটা লোড করুন' : 'Fetch from Firestore'}</span>
              </button>
            )}

            {onPushToFirestore && (
              <button
                onClick={onPushToFirestore}
                disabled={firebaseStatus?.syncing}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'বর্তমান সকল ডেটা ফায়ারবেজে ব্যাকআপ পাঠান' : 'Push All Data to Firebase'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            {isBn ? 'ডেটা ব্যাকআপ ও রিস্টোর' : 'Database Backup & Restore'}
          </h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          {isBn 
            ? 'আপনার সকল বুকিং, টিকিট, প্যাকেজ ও লেনদেনের ডেটা সম্পূর্ণ নিরাপদে ডাউনলোড করে রাখতে পারেন এবং প্রয়োজনে রিস্টোর করতে পারেন।'
            : 'Download a complete JSON snapshot of all bookings, tickets, and accounts, or restore from a backup.'}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {/* Export JSON */}
          <button
            onClick={onExportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'সম্পূর্ণ ডেটা ব্যাকআপ ডাউনলোড (JSON)' : 'Download Backup (JSON)'}</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>{isBn ? 'ব্যাকআপ ফাইল আপলোড করুন' : 'Restore from Backup'}</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </label>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm(isBn ? 'আপনি কি পূর্বাবস্থায় ডেমো ডেটা ফিরিয়ে আনতে চান?' : 'Reset to default starter data?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isBn ? 'ডিফল্ট ডেটা রিসেট' : 'Reset Starter Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
