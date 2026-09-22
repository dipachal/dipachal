import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Palmtree, 
  Ship, 
  Receipt, 
  Users, 
  Settings,
  Sparkles,
  HardDrive
} from 'lucide-react';
import { Language } from '../types';

export type TabType = 'dashboard' | 'bookings' | 'packages' | 'fleet' | 'accounts' | 'customers' | 'drive' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  bookingCount: number;
  packageCount: number;
  dueCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  bookingCount,
  packageCount,
  dueCount,
}) => {
  const isBn = language === 'bn';

  const navItems = [
    {
      id: 'dashboard' as TabType,
      labelBn: 'ড্যাশবোর্ড',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'bookings' as TabType,
      labelBn: 'বুকিং ও টিকিট',
      labelEn: 'Bookings & Tickets',
      icon: Ticket,
      badge: bookingCount,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'packages' as TabType,
      labelBn: 'ট্যুর প্যাকেজ',
      labelEn: 'Tour Packages',
      icon: Palmtree,
      badge: packageCount,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'fleet' as TabType,
      labelBn: 'জাহাজ ও পরিবহন',
      labelEn: 'Fleet & Seats',
      icon: Ship,
    },
    {
      id: 'accounts' as TabType,
      labelBn: 'জমা-খরচ ও হিসাব',
      labelEn: 'Cash Accounts',
      icon: Receipt,
      badge: dueCount > 0 ? (isBn ? `${dueCount} বকেয়া` : `${dueCount} Due`) : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'customers' as TabType,
      labelBn: 'যাত্রী ও ক্লায়েন্ট',
      labelEn: 'Travelers CRM',
      icon: Users,
    },
    {
      id: 'drive' as TabType,
      labelBn: 'গুগল ড্রাইভ',
      labelEn: 'Google Drive',
      icon: HardDrive,
    },
    {
      id: 'settings' as TabType,
      labelBn: 'সেটিংস ও ব্যাকআপ',
      labelEn: 'Settings & Info',
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 no-print sticky top-[97px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{isBn ? item.labelBn : item.labelEn}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
