import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Printer, 
  CreditCard, 
  Phone, 
  MessageCircle, 
  Trash2, 
  Plus, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';
import { Booking, CompanyInfo, Language } from '../types';
import { formatCurrency, formatDate, toBnNumber } from '../utils/helpers';

interface BookingsViewProps {
  bookings: Booking[];
  company: CompanyInfo;
  language: Language;
  onOpenNewBooking: () => void;
  onViewTicket: (booking: Booking) => void;
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  company,
  language,
  onOpenNewBooking,
  onViewTicket,
  onUpdateBooking,
  onDeleteBooking,
}) => {
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'partial' | 'due'>('all');
  const [paymentModalBooking, setPaymentModalBooking] = useState<Booking | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectMethod, setCollectMethod] = useState<'bkash' | 'nagad' | 'bank' | 'cash'>('cash');
  const [collectTrxId, setCollectTrxId] = useState('');

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment =
      paymentFilter === 'all' || b.paymentStatus === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  // Handle Due Collection
  const openPaymentModal = (booking: Booking) => {
    setPaymentModalBooking(booking);
    setCollectAmount(booking.dueAmount);
    setCollectTrxId('');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBooking) return;

    const newPaid = paymentModalBooking.paidAmount + collectAmount;
    const newDue = Math.max(0, paymentModalBooking.totalPayable - newPaid);
    const newStatus = newDue === 0 ? 'paid' : 'partial';

    const updatedBooking: Booking = {
      ...paymentModalBooking,
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentStatus: newStatus,
      paymentMethod: collectMethod,
      transactionId: collectTrxId || paymentModalBooking.transactionId,
      notes: `${paymentModalBooking.notes || ''} [${new Date().toLocaleDateString()}: ৳${collectAmount} সংগৃহীত]`.trim()
    };

    onUpdateBooking(updatedBooking);
    setPaymentModalBooking(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['TicketNo', 'Customer', 'Phone', 'Destination', 'TravelDate', 'Seats', 'Payable', 'Paid', 'Due', 'Status'];
    const rows = filteredBookings.map(b => [
      b.ticketNo,
      `"${b.customerName}"`,
      b.customerPhone,
      `"${b.destination}"`,
      b.travelDate,
      `"${b.seatNumbers.join(', ')}"`,
      b.totalPayable,
      b.paidAmount,
      b.dueAmount,
      b.paymentStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dwipachal_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isBn ? 'বুকিং ও টিকিট ব্যবস্থাপনা' : 'Bookings & Ticket Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn 
              ? 'সকল সংরক্ষিত টিকেট, পেমেন্ট স্টেটাস ও যাত্রী তালিকা' 
              : 'All reserved passenger tickets, payments, and manifests'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'এক্সপোর্ট CSV' : 'Export CSV'}</span>
          </button>

          <button
            id="bookings-add-new-btn"
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন বুকিং যুক্ত করুন' : 'New Booking'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isBn ? 'টিকেট নং, যাত্রীর নাম, ফোন দিয়ে খুঁজুন...' : 'Search by ticket, name, phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Payment Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {isBn ? 'ফিল্টার:' : 'Filter:'}
          </span>
          {(['all', 'paid', 'partial', 'due'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setPaymentFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                paymentFilter === filter
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'all' && (isBn ? 'সকল' : 'All')}
              {filter === 'paid' && (isBn ? 'পরিশোধিত' : 'Paid')}
              {filter === 'partial' && (isBn ? 'আংশিক জমা' : 'Partial')}
              {filter === 'due' && (isBn ? 'বকেয়া' : 'Due')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Card View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{isBn ? 'টিকেট নং' : 'Ticket No'}</th>
                <th className="py-3 px-4">{isBn ? 'যাত্রীর নাম ও যোগাযোগ' : 'Passenger Details'}</th>
                <th className="py-3 px-4">{isBn ? 'গন্তব্য ও ভ্রমণের তারিখ' : 'Tour & Travel Date'}</th>
                <th className="py-3 px-4">{isBn ? 'আসন' : 'Seats'}</th>
                <th className="py-3 px-4">{isBn ? 'পেমেন্ট ও বকেয়া' : 'Billing Status'}</th>
                <th className="py-3 px-4 text-center">{isBn ? 'যোগাযোগ' : 'Contact'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">{isBn ? 'কোনো বুকিং রেকর্ড পাওয়া যায়নি' : 'No bookings found'}</p>
                    <p className="text-xs mt-1 text-slate-400">{isBn ? 'নতুন বুকিং করতে উপরের বাটনে ক্লিক করুন।' : 'Click New Booking to add one.'}</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const cleanPhone = b.customerPhone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
                  const waMessage = encodeURIComponent(
                    `আসসালামু আলাইকুম ${b.customerName}। দ্বীপাচল এন্টারপ্রাইজ (Dwipachal Tour BD) থেকে আপনার টিকিট নং: ${b.ticketNo} (${b.destination}) নিশ্চিত করা হয়েছে। ধন্যবাদ!`
                  );

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Ticket No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                          {b.ticketNo}
                        </span>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          {formatDate(b.bookingDate, language)}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {b.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{b.customerPhone}</span>
                        </div>
                        {b.customerNid && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            NID: {b.customerNid}
                          </div>
                        )}
                      </td>

                      {/* Tour & Travel Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 line-clamp-1 max-w-[180px]">
                          {b.destination}
                        </div>
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(b.travelDate, language)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {b.boardingPoint}
                        </div>
                      </td>

                      {/* Seats & Passenger count */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {b.seatNumbers.map((seat, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono font-bold"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {isBn ? `${toBnNumber(b.passengerCount)} জন যাত্রী` : `${b.passengerCount} traveler(s)`}
                        </span>
                      </td>

                      {/* Payment Status & Due */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.paymentStatus === 'partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.paymentStatus === 'paid' && <CheckCircle className="w-3 h-3" />}
                          {b.paymentStatus !== 'paid' && <Clock className="w-3 h-3" />}
                          {b.paymentStatus === 'paid' ? (isBn ? 'সম্পূর্ণ পরিশোধ' : 'Paid') :
                           b.paymentStatus === 'partial' ? (isBn ? 'আংশিক জমা' : 'Partial') :
                           (isBn ? 'বকেয়া' : 'Due')}
                        </span>
                        
                        <div className="text-xs font-semibold text-slate-700 mt-1">
                          {formatCurrency(b.paidAmount, language)} / {formatCurrency(b.totalPayable, language)}
                        </div>

                        {b.dueAmount > 0 && (
                          <button
                            onClick={() => openPaymentModal(b)}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-bold underline mt-0.5 block cursor-pointer"
                          >
                            {isBn ? `বকেয়া: ${formatCurrency(b.dueAmount, language)} (জমা নিন)` : `Due: ${formatCurrency(b.dueAmount, language)} (Collect)`}
                          </button>
                        )}
                      </td>

                      {/* Contact shortcuts */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Call Phone"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`view-ticket-${b.ticketNo}`}
                            onClick={() => onViewTicket(b)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title={isBn ? 'টিকিট প্রিন্ট ও প্রিভিউ' : 'View & Print Ticket'}
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{isBn ? 'টিকিট' : 'Ticket'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(isBn ? 'আপনি কি নিশ্চিত এই বুকিংটি বাতিল/মুছে ফেলতে চান?' : 'Are you sure you want to cancel this booking?')) {
                                onDeleteBooking(b.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={isBn ? 'বুকিং মুছুন' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Due Collection Modal */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'বকেয়া টাকা গ্রহণ' : 'Collect Due Payment'}</span>
              </h3>
              <button 
                onClick={() => setPaymentModalBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="mt-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                <p><b>{isBn ? 'টিকেট নং:' : 'Ticket:'}</b> {paymentModalBooking.ticketNo}</p>
                <p><b>{isBn ? 'যাত্রী:' : 'Customer:'}</b> {paymentModalBooking.customerName}</p>
                <p className="text-rose-600 font-semibold">
                  <b>{isBn ? 'বর্তমান বকেয়া:' : 'Current Due:'}</b> {formatCurrency(paymentModalBooking.dueAmount, language)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'আদায়ের পরিমাণ (টাকা):' : 'Amount to Collect:'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={paymentModalBooking.dueAmount}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['cash', 'bkash', 'nagad', 'bank'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setCollectMethod(m)}
                      className={`py-2 px-3 rounded-lg font-semibold uppercase text-center border cursor-pointer ${
                        collectMethod === m 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'ট্রানজেকশন আইডি (ঐচ্ছিক):' : 'Transaction ID (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. BK928812"
                  value={collectTrxId}
                  onChange={(e) => setCollectTrxId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
                >
                  {isBn ? 'জমা সংরক্ষণ করুন' : 'Confirm & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
