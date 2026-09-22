import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  ChevronRight,
  Award,
  Users
} from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  lang: Language;
  onOpenBooking: () => void;
  onOpenFleet: () => void;
  onOpenLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenBooking,
  onOpenFleet,
  onOpenLogin,
}) => {
  const isBn = lang === 'bn';

  const [fromCity, setFromCity] = useState('ঢাকা');
  const [toCity, setToCity] = useState('কক্সবাজার');
  const [journeyDate, setJourneyDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking();
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-teal-900 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? 'দ্বীপাচল পরিবহন ও ট্যুরিজম' : 'Dwipachal Transport & Tourism'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-tight text-white">
              {isBn ? (
                <>
                  স্বাচ্ছন্দ্য ও সুরক্ষায় <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    দেশের সেরা বাস ও ট্রাভেল বহর
                  </span>
                </>
              ) : (
                <>
                  Travel in Comfort with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    Bangladesh’s Premier Fleet
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              {isBn
                ? 'ঢাকা, চট্টগ্রাম, কক্সবাজার, টেকনাফ ও সিলেট রুটে বিলাসবহুল রয়েল এসি, স্লিপার কোচ ও মাইক্রোবাস সার্ভিস। লাইভ জিপিএস ট্র্যাকিং ও সার্বক্ষণিক হটলাইন সহায়তা।'
                : 'Luxury AC coaches, sleeper beds, and microbus rentals across Dhaka, Chittagong, Cox’s Bazar, and Sylhet with real-time GPS tracking.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenFleet}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Bus className="w-4 h-4" />
                <span>{isBn ? 'আমাদের গাড়ি বহর দেখুন' : 'Explore Vehicles'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'বুকিং ও ভাড়া অনুসন্ধান' : 'Get a Fare Quote'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-md">
              <div>
                <span className="block text-2xl font-black text-white">২৫+</span>
                <span className="text-xs text-slate-400 font-medium">
                  {isBn ? 'আধুনিক বিলাসবহুল বাস' : 'Modern Luxury Buses'}
                </span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">৯৯.৪%</span>
                <span className="text-xs text-slate-400 font-medium">
                  {isBn ? 'অন-টাইম ডিপার্চার' : 'On-time Departure'}
                </span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">২৪/৭</span>
                <span className="text-xs text-slate-400 font-medium">
                  {isBn ? 'লাইভ রোড মনিটরিং' : 'GPS Live Tracking'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Booking / Fare Inquiry Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Search className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {isBn ? 'দ্রুত বাস শিডিউল ও ভাড়া খুঁজুন' : 'Quick Bus Schedule Search'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  {isBn ? 'ইনস্ট্যান্ট চেক' : 'Instant Check'}
                </span>
              </div>

              <form onSubmit={handleSearchTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'যাত্রা শুরু (From)' : 'Origin City'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-emerald-500"
                    >
                      <option value="ঢাকা">ঢাকা (সদরঘাট / সায়েদাবাদ / গাবতলী)</option>
                      <option value="চট্টগ্রাম">চট্টগ্রাম (দামপাড়া / এ কে খান)</option>
                      <option value="কক্সবাজার">কক্সবাজার (কলাতলী / ঝাউতলা)</option>
                      <option value="সিলেট">সিলেট (কদমতলী / মাজার রোড)</option>
                      <option value="টেকনাফ">টেকনাফ (মেরিন ড্রাইভ জংশন)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'গন্তব্য (To Destination)' : 'Destination'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-emerald-500"
                    >
                      <option value="কক্সবাজার">কক্সবাজার (কলাতলী / লাবণী পয়েন্ট)</option>
                      <option value="ঢাকা">ঢাকা (সদরঘাট / সায়েদাবাদ)</option>
                      <option value="চট্টগ্রাম">চট্টগ্রাম (সেন্ট্রাল)</option>
                      <option value="টেকনাফ">টেকনাফ (সেন্টমার্টিন ট্রানজিট)</option>
                      <option value="সিলেট">সিলেট (জাফলং / রাতারগুল)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isBn ? 'যাত্রার তারিখ' : 'Journey Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Search className="w-4 h-4" />
                  <span>{isBn ? 'উপলব্ধ বাস ও সিট ভাড়া দেখুন' : 'View Available Buses & Fares'}</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {isBn ? '১০০% নিরাপদ রিজার্ভেশন' : 'Guaranteed Booking'}
                </span>
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  {isBn ? 'হেল্পলাইন: 01619320400' : 'Hotline: 01619320400'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
