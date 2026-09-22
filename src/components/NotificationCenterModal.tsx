import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Navigation, Clock, ShieldCheck } from 'lucide-react';
import { MaintenanceAlert, Trip, Vehicle, Language } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  alerts: MaintenanceAlert[];
  trips: Trip[];
  vehicles: Vehicle[];
  onResolveAlert: (id: string) => void;
  onViewTracking: (code: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  lang,
  alerts,
  trips,
  onResolveAlert,
  onViewTracking,
}) => {
  const isBn = lang === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? 'সিস্টেম নোটিফিকেশন ও অ্যালার্ট সেন্টার' : 'System Alerts & Road Dispatch'}
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'সার্ভিসিং রিমাইন্ডার এবং লাইভ ট্রিপ স্ট্যাটাস' : 'Maintenance alerts and live journey status'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Running Trips Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'সক্রিয় ট্রিপ ও বাস' : 'Active Road Trips'}</span>
            </h4>
            <div className="space-y-2">
              {trips.filter(t => t.status === 'running').map(trip => (
                <div
                  key={trip.id}
                  className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {trip.vehicleName} ({trip.origin} ➔ {trip.destination})
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {trip.driverName} • {isBn ? 'গতি' : 'Speed'}: {trip.speedKmH || 70} km/h
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onViewTracking(trip.trackingCode);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                  >
                    {isBn ? 'লাইভ ট্র্যাক' : 'Track'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Alerts Section */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? 'রক্ষণাবেক্ষণ ও টেকনিক্যাল নোটিশ' : 'Fleet Maintenance Reminders'}</span>
            </h4>
            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  {isBn ? 'কোনো অপেক্ষমান অ্যালার্ট নেই।' : 'No pending alerts.'}
                </p>
              ) : (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      alert.status === 'completed'
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <span>{alert.title}</span>
                        <span className="font-mono text-[10px] text-slate-500">[{alert.vehiclePlate}]</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        {alert.dueDescription}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {isBn ? 'তারিখ:' : 'Due:'} {alert.dueDate} {alert.costBDT ? `• আনুমানিক খরচ: ৳${alert.costBDT}` : ''}
                      </span>
                    </div>

                    {alert.status === 'pending' ? (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                      >
                        {isBn ? 'সম্পন্ন চিহ্নিত' : 'Resolve'}
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {isBn ? 'সম্পন্ন' : 'Done'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
