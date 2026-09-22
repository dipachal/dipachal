import React, { useState } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Navigation, 
  Phone, 
  User, 
  Clock, 
  Compass, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Trip, Vehicle, Language } from '../types';

interface LiveTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  trips: Trip[];
  vehicles: Vehicle[];
  initialTrackingCode: string;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  isOpen,
  onClose,
  lang,
  trips,
  vehicles,
  initialTrackingCode,
}) => {
  const isBn = lang === 'bn';

  const [searchCode, setSearchCode] = useState(initialTrackingCode || 'DWP-8842');
  const [activeCode, setActiveCode] = useState(initialTrackingCode || 'DWP-8842');

  if (!isOpen) return null;

  const foundTrip = trips.find(t => 
    t.trackingCode.toLowerCase() === activeCode.trim().toLowerCase()
  ) || trips[0];

  const assignedVehicle = foundTrip 
    ? vehicles.find(v => v.plateNumber === foundTrip.vehiclePlate) 
    : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setActiveCode(searchCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isBn ? 'লাইভ রোড জিপিএস ট্র্যাকিং' : 'Live Bus GPS Tracking'}</span>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {isBn ? 'সরাসরি স্যাটেলাইট লিঙ্ক' : 'Live Satellite Feed'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'আপনার টিকিটের ট্র্যাকিং কোড দিয়ে বাসের অবস্থান জানুন' : 'Enter booking tracking code to locate bus en route'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder={isBn ? 'ট্র্যাকিং কোড লিখুন (যেমন: DWP-8842)' : 'Enter tracking code (e.g. DWP-8842)'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isBn ? 'খুঁজুন' : 'Track'}
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {foundTrip ? (
            <>
              {/* Trip Live Card */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      {isBn ? 'ট্রিপ কোড' : 'Tracking Code'}
                    </span>
                    <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {foundTrip.trackingCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {foundTrip.status === 'running' ? (isBn ? 'গাড়ী চলমান রয়েছে' : 'Vehicle in Motion') : (isBn ? 'নির্ধারিত শিডিউল' : 'Scheduled')}
                    </span>
                  </div>
                </div>

                {/* Route visualization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                      A
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isBn ? 'যাত্রার স্থান' : 'Origin'}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{foundTrip.origin}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{foundTrip.departureTime}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                      B
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isBn ? 'গন্তব্য স্থান' : 'Destination'}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{foundTrip.destination}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">ETA: {foundTrip.estimatedArrivalTime}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated GPS Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>{isBn ? 'হাইওয়ে অবস্থান: ফেনী-মিরসরাই সেকশন' : 'Current: Feni - Mirsharai Expressway'}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {foundTrip.speedKmH || 72} km/h
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[65%]" />
                  </div>
                </div>
              </div>

              {/* Driver & Bus Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    {isBn ? 'চালকের তথ্য' : 'Assigned Driver'}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {foundTrip.driverName}
                      </h4>
                      <span className="text-[11px] text-slate-500 block">
                        {isBn ? 'লাইসেন্স যাচাইকৃত' : 'Verified Heavy License'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    {isBn ? 'গাড়ির নম্বর ও মডেল' : 'Bus Information'}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {foundTrip.vehiclePlate}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {foundTrip.vehicleName}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-xs font-medium">
                {isBn ? 'এই ট্র্যাকিং কোডের কোনো ট্রিপ পাওয়া যায়নি।' : 'No trip found for this tracking code.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
