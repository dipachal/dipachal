import React from 'react';
import { 
  X, 
  Printer, 
  Compass, 
  QrCode, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Clock,
  Bus,
  Ship,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Booking, CompanyInfo, Language } from '../types';
import { formatCurrency, formatDate, toBnNumber } from '../utils/helpers';

interface TicketModalProps {
  booking: Booking | null;
  company: CompanyInfo;
  language: Language;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  booking,
  company,
  language,
  onClose,
}) => {
  if (!booking) return null;
  const isBn = language === 'bn';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Action bar (hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">
              {isBn ? 'যাত্রী টিকিট ও ইনভয়েস ভাউচার' : 'Passenger Ticket & Invoice Voucher'}
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
              {booking.ticketNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-ticket-action-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'টিকিট প্রিন্ট করুন' : 'Print Ticket'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 sm:p-8 bg-white print-card text-slate-800">
          {/* Header of Ticket */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {company.nameBn}
                  </h2>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Dwipachal Tour BD
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {company.sloganBn}
                </p>
                <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-3">
                  <span>হটলাইন: <b>{company.hotline}</b></span>
                  <span>ইমেইল: <b>{company.email}</b></span>
                  <span>রেজি নং: <b>{company.regNo || 'TR-2024/991'}</b></span>
                </div>
              </div>
            </div>

            {/* QR and Ticket Badge */}
            <div className="text-right shrink-0">
              <div className="inline-block p-2 bg-slate-50 border border-slate-300 rounded-lg">
                <QrCode className="w-14 h-14 text-slate-800 mx-auto" />
                <span className="block text-[10px] text-slate-500 font-mono text-center mt-1">
                  E-VERIFIED
                </span>
              </div>
              <div className="mt-2 text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                PNR: {booking.ticketNo}
              </div>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="mt-6 space-y-6">
            {/* Tour & Destination Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  {isBn ? 'ট্যুর প্যাকেজ / গন্তব্য' : 'Tour Package / Destination'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {booking.packageTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {booking.destination}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Ship className="w-3.5 h-3.5 text-blue-600" />
                    {booking.transportName}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className="text-xs text-slate-500 block">
                  {isBn ? 'বুকিং স্ট্যাটাস' : 'Booking Status'}
                </span>
                <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isBn ? 'নিশ্চিতকৃত (Confirmed)' : 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Travel Journey Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">
                  {isBn ? 'যাত্রার তারিখ ও সময়' : 'Departure Date & Time'}
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {formatDate(booking.travelDate, language)}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {isBn ? 'রিপোর্টিং: যাত্রা শুরুর ১ ঘণ্টা পূর্বে' : 'Reporting: 1 hr prior'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">
                  {isBn ? 'বোর্ডিং পয়েন্ট / ঘাট' : 'Boarding Point / Jetty'}
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {booking.boardingPoint}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {isBn ? 'ফেরার তারিখ:' : 'Return:'} {booking.returnDate ? formatDate(booking.returnDate, language) : (isBn ? 'নির্দিষ্ট নয়' : 'N/A')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">
                  {isBn ? 'বরাদ্দকৃত আসন / কেবিন' : 'Assigned Seat(s) / Cabin'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {booking.seatNumbers.map((seat, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded shadow-xs"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {isBn ? `মোট যাত্রী: ${toBnNumber(booking.passengerCount)} জন` : `Total: ${booking.passengerCount} Person(s)`}
                </span>
              </div>
            </div>

            {/* Passenger & Customer details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-700" />
                  {isBn ? 'প্রধান বুকিংকারী তথ্য' : 'Primary Passenger'}
                </h4>
                <div className="space-y-1 text-xs">
                  <p className="text-sm font-bold text-slate-900">{booking.customerName}</p>
                  <p className="text-slate-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {booking.customerPhone}
                  </p>
                  {booking.customerNid && (
                    <p className="text-slate-500 font-mono text-[11px]">
                      NID/পাসপোর্ট: {booking.customerNid}
                    </p>
                  )}
                  {booking.customerEmail && (
                    <p className="text-slate-500 text-[11px]">{booking.customerEmail}</p>
                  )}
                </div>
              </div>

              {/* Passengers Breakdown */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-700" />
                  {isBn ? 'সহযাত্রীগণের তালিকা' : 'Passenger List'}
                </h4>
                <div className="space-y-1.5 text-xs max-h-28 overflow-y-auto pr-1">
                  {booking.passengers && booking.passengers.length > 0 ? (
                    booking.passengers.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-800">
                          {idx + 1}. {p.name} {p.age ? `(${p.age}y)` : ''}
                        </span>
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-700">
                          Seat: {p.seatNo}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">
                      {isBn ? 'আসন সংখ্যা অনুযায়ী নাম অন্তর্ভুক্ত করা হয়েছে।' : 'Seats allocated for booked passenger count.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Breakdown */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between">
                <span>{isBn ? 'হিসাব ও পেমেন্ট বিবরণী' : 'Payment & Account Breakdown'}</span>
                <span>{isBn ? 'মাধ্যম:' : 'Method:'} {booking.paymentMethod.toUpperCase()} {booking.transactionId ? `(Trx: ${booking.transactionId})` : ''}</span>
              </div>
              <div className="p-4 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500 block">{isBn ? 'মোট বিল' : 'Subtotal'}</span>
                  <span className="text-sm font-semibold text-slate-700 mt-1 block">
                    {formatCurrency(booking.subtotal, language)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">{isBn ? 'বিশেষ ছাড়' : 'Discount'}</span>
                  <span className="text-sm font-semibold text-emerald-600 mt-1 block">
                    {booking.discount > 0 ? `-${formatCurrency(booking.discount, language)}` : '৳০'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">{isBn ? 'পরিশোধিত' : 'Paid Amount'}</span>
                  <span className="text-sm font-bold text-emerald-700 mt-1 block">
                    {formatCurrency(booking.paidAmount, language)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">{isBn ? 'বকেয়া' : 'Due Balance'}</span>
                  <span className={`text-sm font-bold mt-1 block ${booking.dueAmount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {formatCurrency(booking.dueAmount, language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Signatures */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-end gap-6 text-xs text-slate-500">
              <div className="max-w-md space-y-1">
                <span className="font-bold text-slate-700 block text-[11px]">
                  {isBn ? 'যাত্রী নির্দেশনাবলী ও শর্তাবলী:' : 'Important Terms:'}
                </span>
                <ul className="list-disc list-inside text-[10px] space-y-0.5 text-slate-600">
                  <li>{isBn ? 'যাত্রা শুরুর অন্তত ৩০ মিনিট পূর্বে বোর্ডিং ঘাটে উপস্থিত থাকুন।' : 'Please report at the boarding point at least 30 mins prior.'}</li>
                  <li>{isBn ? 'মূল জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন পত্র সঙ্গে রাখা বাধ্যতামূলক।' : 'Carrying original NID / Smart Card is mandatory for travel.'}</li>
                  <li>{isBn ? 'কোনো প্রকার জরুরি প্রয়োজনে আমাদের ২৪/৭ হটলাইনে যোগাযোগ করুন।' : 'For any travel assistance, call our 24/7 helpline.'}</li>
                </ul>
              </div>

              {/* Authority Seal */}
              <div className="text-center sm:text-right shrink-0">
                <div className="inline-block border-b border-slate-400 pb-1 mb-1 px-4">
                  <span className="font-serif italic font-bold text-emerald-800 text-sm">
                    Dwipachal Enterprise
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                  {isBn ? 'অনুমোদিত স্বাক্ষর ও সিল' : 'Authorized Signatory & Seal'}
                </span>
              </div>
            </div>

            {/* Micro barcode representation */}
            <div className="text-center pt-2">
              <div className="inline-block tracking-[0.3em] font-mono text-[10px] text-slate-400">
                ||||| | |||| |||||| || | |||| |||| |||||
              </div>
              <div className="text-[9px] text-slate-400">
                {company.nameEn} • {company.email} • Thank you for traveling with us!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
