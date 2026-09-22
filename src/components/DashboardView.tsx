import React from 'react';
import { 
  Ticket, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Ship,
  Bus,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';
import { Booking, CompanyInfo, Language, TourPackage, Transaction } from '../types';
import { formatCurrency, formatDate, toBnNumber } from '../utils/helpers';
import { TabType } from './Navigation';

interface DashboardViewProps {
  bookings: Booking[];
  packages: TourPackage[];
  transactions: Transaction[];
  company: CompanyInfo;
  language: Language;
  onOpenNewBooking: () => void;
  onNavigateTab: (tab: TabType) => void;
  onViewTicket: (booking: Booking) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  packages,
  transactions,
  language,
  onOpenNewBooking,
  onNavigateTab,
  onViewTicket,
}) => {
  const isBn = language === 'bn';

  // Metrics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalDue = bookings.reduce((sum, b) => sum + b.dueAmount, 0);
  const totalPassengers = bookings.reduce((sum, b) => sum + b.passengerCount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const recentBookings = [...bookings].reverse().slice(0, 5);
  const activePackages = packages.filter(p => p.status === 'active');

  return (
    <div className="space-y-6">
      {/* Top Welcome & Notification Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {isBn ? 'দ্বীপাচল এন্টারপ্রাইজ সিস্টেম সচল রয়েছে' : 'Dwipachal Enterprise Active'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isBn ? 'স্বাগতম, অ্যাডমিন ড্যাশবোর্ড' : 'Welcome to Dwipachal Control Center'}
            </h2>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
              {isBn 
                ? 'সেন্টমার্টিন, সুন্দরবন, কক্সবাজার ও দ্বীপ ভ্রমণের টিকেট, আসন বরাদ্দ ও হিসাবের পূর্ণাঙ্গ সফটওয়্যার।'
                : 'Manage tour bookings, passenger manifests, fleet seats, and daily financial ledgers.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-new-booking-btn"
              onClick={onOpenNewBooking}
              className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'দ্রুত টিকিট বুকিং' : 'Quick Booking'}</span>
            </button>
            <button
              id="dash-packages-btn"
              onClick={() => onNavigateTab('packages')}
              className="bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-500/40 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              <span>{isBn ? 'প্যাকেজসমূহ দেখুন' : 'View Packages'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isBn ? 'মোট বুকিং' : 'Total Bookings'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isBn ? `${toBnNumber(totalBookings)} টি` : totalBookings}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isBn 
                ? `সর্বমোট যাত্রী: ${toBnNumber(totalPassengers)} জন` 
                : `${totalPassengers} passengers total`}
            </span>
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isBn ? 'আদায়কৃত রাজস্ব (টাকা)' : 'Total Revenue'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {formatCurrency(totalRevenue, language)}
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'সফলভাবে ক্যাশ/পেমেন্ট যুক্ত' : 'Collected via bKash/Bank/Cash'}</span>
          </div>
        </div>

        {/* Pending Due */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isBn ? 'বকেয়া পাওনা' : 'Pending Dues'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {formatCurrency(totalDue, language)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{isBn ? 'যাত্রার পূর্বে আদায়যোগ্য' : 'Due before journey'}</span>
            <button 
              onClick={() => onNavigateTab('bookings')} 
              className="text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              {isBn ? 'তালিকা' : 'List'} &rarr;
            </button>
          </div>
        </div>

        {/* Net Cash Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isBn ? 'নিট ক্যাশ ব্যালেন্স' : 'Net Cashflow'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {formatCurrency(netBalance, language)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span className="text-emerald-600">+{formatCurrency(totalIncome, language)}</span>
            <span className="text-rose-600">-{formatCurrency(totalExpense, language)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Trips & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Recent Bookings with Ticket Action */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'সাম্প্রতিক টিকেট ও বুকিং' : 'Recent Bookings'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'সর্বশেষ বুকিংকৃত যাত্রী ও টিকেট প্রিন্ট অপশন' : 'Latest tickets issued with instant print access'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              {isBn ? 'সকল বুকিং দেখুন' : 'View All'} &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{isBn ? 'টিকেট / PNR' : 'Ticket No'}</th>
                  <th className="py-3 px-4">{isBn ? 'যাত্রীর নাম ও ফোন' : 'Passenger & Phone'}</th>
                  <th className="py-3 px-4">{isBn ? 'ট্যুর ও যাত্রা' : 'Tour & Date'}</th>
                  <th className="py-3 px-4">{isBn ? 'আসন' : 'Seats'}</th>
                  <th className="py-3 px-4">{isBn ? 'পেমেন্ট' : 'Payment'}</th>
                  <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.ticketNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 truncate max-w-[140px]" title={b.destination}>
                        {b.destination}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formatDate(b.travelDate, language)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {b.seatNumbers.slice(0, 2).map((seat, i) => (
                          <span key={i} className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] font-mono font-semibold">
                            {seat}
                          </span>
                        ))}
                        {b.seatNumbers.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{b.seatNumbers.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.paymentStatus === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.paymentStatus === 'paid' ? (isBn ? 'পরিশোধিত' : 'Paid') :
                         b.paymentStatus === 'partial' ? (isBn ? 'আংশিক জমা' : 'Partial') :
                         (isBn ? 'বকেয়া' : 'Due')}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {formatCurrency(b.paidAmount, language)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewTicket(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        title={isBn ? 'টিকিট দেখুন ও প্রিন্ট' : 'View & Print Ticket'}
                      >
                        <Printer className="w-3 h-3" />
                        <span>{isBn ? 'টিকিট' : 'Ticket'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 span): Active Tours & Seat Occupancy */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              {isBn ? 'চলমান ট্যুর ও সিট স্ট্যাটাস' : 'Active Tour Batches'}
            </h3>
            <button
              onClick={() => onNavigateTab('packages')}
              className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
            >
              {isBn ? 'সকল' : 'All'} &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {activePackages.slice(0, 4).map((pkg) => {
              const occupancy = Math.round((pkg.bookedSeats / pkg.totalSeats) * 100);
              return (
                <div key={pkg.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {isBn ? pkg.titleBn : pkg.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{formatDate(pkg.nextDate, language)}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">{formatCurrency(pkg.pricePerPerson, language)}/জন</span>
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {isBn ? `${toBnNumber(pkg.bookedSeats)}/${toBnNumber(pkg.totalSeats)}` : `${pkg.bookedSeats}/${pkg.totalSeats}`}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          occupancy > 85 ? 'bg-rose-500' : occupancy > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>{occupancy}% {isBn ? 'আসন পূর্ণ' : 'Occupied'}</span>
                      <span>{pkg.totalSeats - pkg.bookedSeats} {isBn ? 'সিট খালি' : 'Left'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('fleet')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ship className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBn ? 'জাহাজ ও বাসের সিট প্ল্যান দেখুন' : 'Inspect Vehicle Seat Layouts'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
