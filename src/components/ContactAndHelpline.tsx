import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Language, Vehicle } from '../types';

interface ContactAndHelplineProps {
  lang: Language;
  selectedVehicle: string;
  vehicles: Vehicle[];
}

export const ContactAndHelpline: React.FC<ContactAndHelplineProps> = ({
  lang,
  selectedVehicle,
  vehicles,
}) => {
  const isBn = lang === 'bn';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState(selectedVehicle || '');
  const [journeyDate, setJourneyDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [route, setRoute] = useState('ঢাকা ➔ কক্সবাজার');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedVehicle) {
      setVehicle(selectedVehicle);
    }
  }, [selectedVehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-white dark:bg-slate-900 transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isBn ? 'যোগাযোগ ও সরাসরি বুকিং' : 'Contact & Booking'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
                {isBn ? 'যে কোনো প্রয়োজনে আমাদের সাথে যুক্ত হোন' : 'Get in Touch for Fleet Reservations'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {isBn 
                  ? 'গ্রুপ ট্যুর, বিয়ে বা পারিবারিক অনুষ্ঠানের জন্য স্পেশাল বাস বা মাইক্রোবাস বুকিং করতে সরাসরি কল করুন অথবা নিচের ফর্মটি পূরণ করুন।'
                  : 'Call our central hotline or submit an inquiry for corporate group travel and family vacations.'}
              </p>
            </div>

            {/* Helpline Cards */}
            <div className="space-y-3">
              <a
                href="tel:01619320400"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">
                    {isBn ? '২৪/৭ সেন্ট্রাল হটলাইন' : '24/7 Central Helpline'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    01619-320400
                  </span>
                </div>
              </a>

              <a
                href="mailto:dwipachaltourbd@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">
                    {isBn ? 'অফিসিয়াল ইমেইল' : 'Corporate Email'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    dwipachaltourbd@gmail.com
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">
                    {isBn ? 'হেড অফিস ও টার্মিনাল' : 'Central Office'}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                    {isBn 
                      ? 'সদরঘাট লঞ্চ ও বাস টার্মিনাল এরিয়া, ঢাকা - ১১০০, বাংলাদেশ।' 
                      : 'Sadarghat Terminal Area, Dhaka - 1100, Bangladesh.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isBn ? 'আপনার বুকিং অনুরোধ সফলভাবে জমা হয়েছে!' : 'Inquiry Received Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {isBn 
                    ? 'দ্বীপাচল এন্টারপ্রাইজ সাপোর্ট টিম আগামী ১৫ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবে।' 
                    : 'Our reservation executive will call your phone within 15 minutes with final confirmation.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {isBn ? 'আরেকটি বুকিং করুন' : 'Submit Another Request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-3 mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isBn ? 'বাস রিজার্ভেশন ও কোটেশন ফর্ম' : 'Fleet Reservation Quote Request'}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? 'নির্দিষ্ট তথ্য দিয়ে দ্রুত নিশ্চিত ভাড়ার কোটেশন পান' : 'Fill details below to get direct discount on chartered buses'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'আপনার নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isBn ? 'নাম লিখুন' : 'Enter your name'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'মোবাইল নম্বর *' : 'Mobile Phone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'পছন্দের গাড়ি / বাস' : 'Selected Vehicle'}
                    </label>
                    <select
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                    >
                      <option value="">{isBn ? '-- গাড়ি নির্বাচন করুন --' : '-- Select Vehicle --'}</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name} ({v.capacity} সিট)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'যাত্রার তারিখ' : 'Departure Date'}
                    </label>
                    <input
                      type="date"
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'যাত্রার রুট' : 'Travel Route'}
                  </label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                  >
                    <option value="ঢাকা ➔ কক্সবাজার">ঢাকা ➔ কক্সবাজার</option>
                    <option value="ঢাকা ➔ চট্টগ্রাম">ঢাকা ➔ চট্টগ্রাম</option>
                    <option value="কক্সবাজার ➔ সেন্টমার্টিন/টেকনাফ">কক্সবাজার ➔ সেন্টমার্টিন/টেকনাফ</option>
                    <option value="ঢাকা ➔ সিলেট/শ্রীমঙ্গল">ঢাকা ➔ সিলেট/শ্রীমঙ্গল</option>
                    <option value="কাস্টম রুট">{isBn ? 'অন্যান্য কাস্টম রুট' : 'Other Custom Route'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'অতিরিক্ত কোনো বার্তা বা রিকোয়ারমেন্ট' : 'Special Requirements'}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isBn ? 'যাত্রীর সংখ্যা, পিক-আপ পয়েন্ট বা বিশেষ নোট...' : 'Pickup point, number of travelers...'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBn ? 'কোটেশন রিকোয়েস্ট পাঠান' : 'Submit Reservation Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
