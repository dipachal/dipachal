import React from 'react';
import { Bus, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigateTo: (view: 'public' | 'dashboard' | 'admin_login') => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigateTo,
}) => {
  const isBn = lang === 'bn';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white font-serif">
                {isBn ? 'দ্বীপাচল এন্টারপ্রাইজ' : 'Dwipachal Enterprise'}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isBn 
                ? 'বাংলাদেশের প্রধান প্রধান রুটে প্রিমিয়াম এসি বাস, রয়েল স্লিপার ও পর্যটন পরিবহন সেবা প্রদানকারী নির্ভরযোগ্য প্রতিষ্ঠান।'
                : 'Bangladesh’s premier fleet management and luxury passenger transport service with 24/7 road assistance.'}
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              {isBn ? 'গভঃ রেজিস্ট্রেশন নং: ডিএইচ-ট্যুর-৮৮৪২' : 'Govt Reg: DH-TOUR-8842'}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isBn ? 'জনপ্রিয় রুটসমূহ' : 'Popular Routes'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• ঢাকা ➔ কক্সবাজার (সরাসরি এসি স্লিপার)</li>
              <li>• ঢাকা ➔ চট্টগ্রাম ➔ টেকনাফ</li>
              <li>• ঢাকা ➔ সেন্টমার্টিন ট্রানজিট এক্সপ্রেস</li>
              <li>• ঢাকা ➔ সিলেট (শ্রীমঙ্গল ও জাফলং)</li>
              <li>• চট্টগ্রাম ➔ কক্সবাজার মেরিন ড্রাইভ</li>
            </ul>
          </div>

          {/* Terminals & Branch Offices */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isBn ? 'টার্মিনাল ও কাউন্টার' : 'Terminals & Counters'}
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div>
                <span className="text-slate-200 font-semibold block">{isBn ? 'ঢাকা সেন্ট্রাল কাউন্টার:' : 'Dhaka Central:'}</span>
                <span>সদরঘাট ও সায়েদাবাদ বাস টার্মিনাল, ঢাকা</span>
              </div>
              <div>
                <span className="text-slate-200 font-semibold block">{isBn ? 'চট্টগ্রাম কাউন্টার:' : 'Chittagong Counter:'}</span>
                <span>দামপাড়া ও এ কে খান গেট, চট্টগ্রাম</span>
              </div>
              <div>
                <span className="text-slate-200 font-semibold block">{isBn ? 'কক্সবাজার কাউন্টার:' : 'Cox’s Bazar Counter:'}</span>
                <span>কলাতলী মোড় ও সুগন্ধা বিচ রোড</span>
              </div>
            </div>
          </div>

          {/* Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isBn ? 'সিস্টেম অ্যাক্সেস' : 'Internal Management'}
            </h4>
            <p className="text-slate-400">
              {isBn 
                ? 'বাস বহর নিয়ন্ত্রণ, ড্রাইভার ট্রিপ শিডিউলিং ও হিসাব নিকাশের জন্য অ্যাডমিন পোর্টাল।' 
                : 'Central dispatch, driver tracking, and maintenance operations portal.'}
            </p>
            <button
              onClick={() => onNavigateTo('dashboard')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Fleet Dashboard'}</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} {isBn ? 'দ্বীপাচল এন্টারপ্রাইজ' : 'Dwipachal Enterprise'}. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for Dwipachal Enterprise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
