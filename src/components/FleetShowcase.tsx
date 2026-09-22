import React, { useState } from 'react';
import { 
  Bus, 
  Users, 
  Fuel, 
  MapPin, 
  Check, 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  PlusCircle, 
  Edit3, 
  Trash2,
  DollarSign
} from 'lucide-react';
import { Vehicle, Language, AdminUser } from '../types';

interface FleetShowcaseProps {
  lang: Language;
  currentUser: AdminUser | null;
  onSelectVehicleForQuote: (vehName: string) => void;
  vehicles: Vehicle[];
  onAddVehicle: (newVeh: Vehicle) => Promise<void>;
  onUpdateVehicle: (updated: Vehicle) => Promise<void>;
  onDeleteVehicle: (vehId: string) => Promise<void>;
}

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({
  lang,
  currentUser,
  onSelectVehicleForQuote,
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
}) => {
  const isBn = lang === 'bn';
  const [filterType, setFilterType] = useState<string>('all');

  const filteredVehicles = filterType === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.type === filterType);

  const getTypeName = (type: string) => {
    switch (type) {
      case 'ac_bus': return isBn ? 'এসি প্রিমিয়াম বাস' : 'AC Premium Bus';
      case 'sleeper_coach': return isBn ? 'বিলাসবহুল স্লিপার কোচ' : 'Luxury Sleeper Coach';
      case 'luxury_coach': return isBn ? 'মাল্টি-এক্সেল লাক্সারি' : 'Multi-Axle Luxury Coach';
      case 'tourist_coaster': return isBn ? 'ট্যুরিস্ট কোস্টার' : 'Tourist Coaster';
      case 'microbus': return isBn ? 'ফ্যামিলি মাইক্রোবাস' : 'Family Microbus';
      default: return isBn ? 'পরিবহন' : 'Vehicle';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
            {isBn ? 'ভাড়ার জন্য প্রস্তুত' : 'Available for Rent'}
          </span>
        );
      case 'on_trip':
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
            {isBn ? 'হাইওয়েতে চলমান' : 'On Trip'}
          </span>
        );
      case 'reserved':
        return (
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
            {isBn ? 'অগ্রিম বুকড' : 'Reserved'}
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
            {isBn ? 'রক্ষণাবেক্ষণ' : 'Maintenance'}
          </span>
        );
    }
  };

  return (
    <section id="fleet-section" className="py-16 bg-slate-50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Bus className="w-3.5 h-3.5" />
              <span>{isBn ? 'দ্বীপাচল পরিবহন বহর' : 'Transport Fleet'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
              {isBn ? 'আমাদের অত্যাধুনিক গাড়ি ও বাস বহর' : 'Explore Our Premier Vehicle Fleet'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              {isBn 
                ? 'ব্যক্তিগত ট্যুর, কর্পোরেট ইভেন্ট ও ফ্যামিলি ভ্রমণের জন্য সম্পূর্ণ প্রস্তুত। প্রতিটি গাড়িতে রয়েছে এসি, জিপিএস ট্র্যাকিং ও দক্ষ চালক।'
                : 'Available for private tour reservations, family travel, and corporate events with experienced drivers and full safety inspection.'}
            </p>
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
            {[
              { id: 'all', labelBn: 'সব গাড়ি', labelEn: 'All Vehicles' },
              { id: 'ac_bus', labelBn: 'এসি বাস', labelEn: 'AC Buses' },
              { id: 'sleeper_coach', labelBn: 'স্লিপার কোচ', labelEn: 'Sleeper' },
              { id: 'tourist_coaster', labelBn: 'কোস্টার', labelEn: 'Coaster' },
              { id: 'microbus', labelBn: 'হায়াস/মাইক্রো', labelEn: 'Microbus' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isBn ? f.labelBn : f.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((veh) => (
            <div
              key={veh.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <img
                  src={veh.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60'}
                  alt={veh.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(veh.status)}
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  {getTypeName(veh.type)}
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-xs font-mono font-bold px-2 py-1 rounded">
                  {veh.plateNumber}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {veh.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      {veh.capacity} {isBn ? 'সিট' : 'Seats'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate max-w-[140px]">{veh.currentLocation}</span>
                    </span>
                  </div>

                  {/* Feature checklist */}
                  {veh.features && veh.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {veh.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                        >
                          <Check className="w-3 h-3 text-emerald-500" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {isBn ? 'দৈনিক রিজার্ভেশন ভাড়া' : 'Daily Rent'}
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ৳{veh.dailyRentBDT?.toLocaleString() || '18,000'}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectVehicleForQuote(veh.name)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{isBn ? 'ভাড়া নিন' : 'Book Quote'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
