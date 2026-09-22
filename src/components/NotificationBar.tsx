import React from 'react';
import { Radio, AlertTriangle, ArrowRight, Bell, Navigation } from 'lucide-react';
import { MaintenanceAlert, Trip, Vehicle, Language } from '../types';

interface NotificationBarProps {
  lang: Language;
  alerts: MaintenanceAlert[];
  trips: Trip[];
  vehicles: Vehicle[];
  onViewTracking: (code: string) => void;
  onOpenNotificationCenter: () => void;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({
  lang,
  alerts,
  trips,
  onViewTracking,
  onOpenNotificationCenter,
}) => {
  const isBn = lang === 'bn';
  const runningTrips = trips.filter(t => t.status === 'running');
  const pendingAlerts = alerts.filter(a => a.status === 'pending');

  if (runningTrips.length === 0 && pendingAlerts.length === 0) {
    return null;
  }

  const activeTrip = runningTrips[0];

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          {activeTrip ? (
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400 shrink-0">
                {isBn ? 'লাইভ রোড মনিটরিং:' : 'Live Trip:'}
              </span>
              <span className="text-slate-300 truncate">
                {activeTrip.vehicleName} ({activeTrip.origin} ➔ {activeTrip.destination}) • {isBn ? 'গতি' : 'Speed'}: {activeTrip.speedKmH || 65} km/h
              </span>
              <button
                onClick={() => onViewTracking(activeTrip.trackingCode)}
                className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer shrink-0"
              >
                <span>{isBn ? 'ট্র্যাক করুন' : 'Track'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : pendingAlerts.length > 0 ? (
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isBn 
                  ? `${pendingAlerts.length} টি সার্ভিসিং অ্যালার্ট অপেক্ষমান রয়েছে` 
                  : `${pendingAlerts.length} vehicle maintenance alerts pending`}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNotificationCenter}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer border border-slate-700"
          >
            <Bell className="w-3 h-3 text-amber-400" />
            <span>{isBn ? 'নোটিফিকেশন সেন্টার' : 'Alert Center'}</span>
            {pendingAlerts.length > 0 && (
              <span className="bg-amber-500 text-slate-900 text-[10px] font-extrabold px-1 rounded-full">
                {pendingAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
