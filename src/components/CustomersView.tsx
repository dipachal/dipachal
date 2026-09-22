import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  Plus, 
  MapPin, 
  Calendar,
  Ticket
} from 'lucide-react';
import { Booking, Language } from '../types';
import { formatCurrency, formatDate, toBnNumber } from '../utils/helpers';

interface CustomersViewProps {
  bookings: Booking[];
  language: Language;
  onBookForCustomer: (customerName: string, customerPhone: string, customerEmail: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  bookings,
  language,
  onBookForCustomer,
}) => {
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');

  // Group bookings by customer phone
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    nid: string;
    bookingsCount: number;
    totalSpent: number;
    lastTrip: string;
    lastDate: string;
  }>();

  bookings.forEach((b) => {
    const key = b.customerPhone || b.customerName;
    const existing = customerMap.get(key);
    if (!existing) {
      customerMap.set(key, {
        name: b.customerName,
        phone: b.customerPhone,
        email: b.customerEmail || '',
        nid: b.customerNid || '',
        bookingsCount: 1,
        totalSpent: b.paidAmount,
        lastTrip: b.destination,
        lastDate: b.travelDate,
      });
    } else {
      existing.bookingsCount += 1;
      existing.totalSpent += b.paidAmount;
      if (new Date(b.travelDate) > new Date(existing.lastDate)) {
        existing.lastTrip = b.destination;
        existing.lastDate = b.travelDate;
      }
    }
  });

  const customerList = Array.from(customerMap.values()).filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.nid && c.nid.includes(searchQuery))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isBn ? 'যাত্রী ও কাস্টমার ডিরেক্টরি' : 'Passenger & Customer CRM'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn 
              ? 'দ্বীপাচল এন্টারপ্রাইজের সম্মানিত সকল গ্রাহকের তথ্য, ভ্রমণের ইতিহাস ও যোগাযোগ' 
              : 'Directory of all travelers, travel history, and direct communication channels'}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isBn ? 'নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by name or phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customerList.map((c, idx) => {
          const cleanPhone = c.phone.replace(/[^0-9]/g, '');
          const waNumber = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
          const waMessage = encodeURIComponent(
            `আসসালামু আলাইকুম ${c.name}। দ্বীপাচল এন্টারপ্রাইজ (Dwipachal Tour BD) থেকে আপনার সাথে যোগাযোগ করা হচ্ছে। যেকোনো ট্যুর বা টিকেট সংক্রান্ত প্রয়োজনে আমাদের জানান!`
          );

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {c.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {isBn ? `${toBnNumber(c.bookingsCount)} টি ট্যুর` : `${c.bookingsCount} trips`}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isBn ? 'মোট পরিশোধ:' : 'Total Spent:'}</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(c.totalSpent, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isBn ? 'সর্বশেষ ভ্রমণ:' : 'Last Trip:'}</span>
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[150px]">{c.lastTrip}</span>
                  </div>
                  {c.nid && (
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-400">NID:</span>
                      <span className="text-slate-600">{c.nid}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${c.phone}`}
                    className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    title="Phone Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => onBookForCustomer(c.name, c.phone, c.email)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBn ? 'নতুন টিকেট' : 'Book Trip'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
