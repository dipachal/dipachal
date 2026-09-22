import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Plus, 
  Ship, 
  Bus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Booking, CompanyInfo, Language, PassengerDetail, TourPackage, Vehicle } from '../types';
import { formatCurrency, generateTicketNumber } from '../utils/helpers';

interface NewBookingModalProps {
  packages: TourPackage[];
  vehicles: Vehicle[];
  company: CompanyInfo;
  language: Language;
  initialPackage?: TourPackage | null;
  initialSeat?: string | null;
  initialVehicleName?: string | null;
  initialCustomer?: { name: string; phone: string; email: string } | null;
  onClose: () => void;
  onSubmitBooking: (booking: Booking) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  packages,
  vehicles,
  company,
  language,
  initialPackage,
  initialSeat,
  initialVehicleName,
  initialCustomer,
  onClose,
  onSubmitBooking,
}) => {
  const isBn = language === 'bn';

  const defaultPkg = initialPackage || packages[0];

  const [selectedPkgId, setSelectedPkgId] = useState<string>(defaultPkg?.id || 'custom');
  const [destination, setDestination] = useState<string>(defaultPkg ? (isBn ? defaultPkg.destinationBn : defaultPkg.destinationEn) : 'সেন্টমার্টিন দ্বীপ');
  const [transportName, setTransportName] = useState<string>(initialVehicleName || 'এমভি দ্বীপাচল এক্সপ্রেস');
  
  // Customer info
  const [customerName, setCustomerName] = useState<string>(initialCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(initialCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(initialCustomer?.email || '');
  const [customerNid, setCustomerNid] = useState<string>('');

  // Trip dates & boarding
  const [travelDate, setTravelDate] = useState<string>(defaultPkg?.nextDate || new Date().toISOString().slice(0, 10));
  const [returnDate, setReturnDate] = useState<string>('');
  const [boardingPoint, setBoardingPoint] = useState<string>(defaultPkg ? (isBn ? defaultPkg.departurePointBn : defaultPkg.departurePointEn) : 'ঢাকা / ঘাট');

  // Passenger & seats
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [seatString, setSeatString] = useState<string>(initialSeat || 'A1');
  const [passengerNames, setPassengerNames] = useState<string[]>(['']);

  // Financials
  const [unitPrice, setUnitPrice] = useState<number>(defaultPkg ? defaultPkg.pricePerPerson : 7500);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(defaultPkg ? defaultPkg.pricePerPerson : 7500);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank' | 'cash'>('bkash');
  const [trxId, setTrxId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Handle package selection change
  const handlePackageChange = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    if (pkgId === 'custom') {
      return;
    }
    const found = packages.find(p => p.id === pkgId);
    if (found) {
      setDestination(isBn ? found.destinationBn : found.destinationEn);
      setUnitPrice(found.pricePerPerson);
      setTravelDate(found.nextDate);
      setBoardingPoint(isBn ? found.departurePointBn : found.departurePointEn);
      setPaidAmount(found.pricePerPerson * passengerCount);
    }
  };

  const handlePassengerCountChange = (count: number) => {
    const val = Math.max(1, count);
    setPassengerCount(val);
    const updatedNames = [...passengerNames];
    while (updatedNames.length < val) {
      updatedNames.push('');
    }
    setPassengerNames(updatedNames.slice(0, val));
    setPaidAmount(unitPrice * val - discount);
  };

  const subtotal = unitPrice * passengerCount;
  const totalPayable = Math.max(0, subtotal - discount);
  const dueAmount = Math.max(0, totalPayable - paidAmount);
  const paymentStatus: 'paid' | 'partial' | 'due' =
    dueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'due';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const seats = seatString.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const passengersList: PassengerDetail[] = passengerNames.map((name, idx) => ({
      name: name.trim() || `${customerName} (যাত্রী ${idx + 1})`,
      gender: 'male',
      seatNo: seats[idx] || seats[0] || `Seat-${idx + 1}`
    }));

    const ticketNo = generateTicketNumber();

    const selectedPkg = packages.find(p => p.id === selectedPkgId);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      ticketNo,
      packageId: selectedPkgId !== 'custom' ? selectedPkgId : undefined,
      packageTitle: selectedPkg ? (isBn ? selectedPkg.titleBn : selectedPkg.titleEn) : `ট্যুর টিকেট (${destination})`,
      destination,
      transportName,
      customerName,
      customerPhone,
      customerEmail,
      customerNid,
      travelDate,
      returnDate: returnDate || travelDate,
      boardingPoint,
      passengerCount,
      passengers: passengersList,
      seatNumbers: seats.length > 0 ? seats : ['AUTO'],
      unitPrice,
      subtotal,
      discount,
      totalPayable,
      paidAmount,
      dueAmount,
      paymentStatus,
      paymentMethod,
      transactionId: trxId,
      bookingDate: new Date().toISOString().slice(0, 10),
      status: 'confirmed',
      notes,
      createdAgent: 'Admin Desk'
    };

    onSubmitBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold">
              {isBn ? 'নতুন টিকেট বুকিং ও টিকিট প্রদান' : 'Issue New Booking & Ticket'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Package & Transport Selection */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-emerald-600" />
              {isBn ? 'ট্যুর প্যাকেজ ও পরিবহন নির্বাচন' : 'Tour Package & Transport'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'প্যাকেজ নির্বাচন:' : 'Select Package:'}
                </label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                >
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      {isBn ? p.titleBn : p.titleEn} ({formatCurrency(p.pricePerPerson, language)})
                    </option>
                  ))}
                  <option value="custom">{isBn ? 'কাস্টম প্যাকেজ / শুধুমাত্র টিকেট' : 'Custom Trip / Ticket Only'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'পরিবহন / ভেসেল:' : 'Transport / Ship:'}
                </label>
                <select
                  value={transportName}
                  onChange={(e) => setTransportName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                  <option value="এমভি দ্বীপাচল এক্সপ্রেস">এমভি দ্বীপাচল এক্সপ্রেস</option>
                  <option value="দ্বীপাচল রয়্যাল ট্রাভেলার্স">দ্বীপাচল রয়্যাল ট্রাভেলার্স</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'গন্তব্যস্থান:' : 'Destination:'}
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'বোর্ডিং পয়েন্ট / ঘাট:' : 'Boarding Point / Jetty:'}
                </label>
                <input
                  type="text"
                  required
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'যাত্রার তারিখ:' : 'Travel Date:'}
                </label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'ফেরার তারিখ (ঐচ্ছিক):' : 'Return Date (Optional):'}
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              {isBn ? 'যাত্রীর ব্যক্তিগত ও যোগাযোগ তথ্য' : 'Customer & Contact Details'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'বুকিংকারীর পূর্ণ নাম:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'মোবাইল ফোন নম্বর:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01712-345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'জাতীয় পরিচয়পত্র / পাসপোর্ট নং:' : 'NID / Passport (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder="NID নম্বর"
                  value={customerNid}
                  onChange={(e) => setCustomerNid(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'ইমেইল এড্রেস (ঐচ্ছিক):' : 'Email (Optional):'}
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Passenger Count & Seat Numbers */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-purple-600" />
              {isBn ? 'আসন সংখ্যা ও সিট নম্বর' : 'Seats & Passenger Allocation'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'যাত্রী সংখ্যা:' : 'Number of Passengers:'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={passengerCount}
                  onChange={(e) => handlePassengerCountChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {isBn ? 'আসন / কেবিন নম্বর (কমা দিয়ে লিখুন):' : 'Seat / Cabin Nos (Comma separated):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: A1, A2 অথবা Cabin-102"
                  value={seatString}
                  onChange={(e) => setSeatString(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white font-mono uppercase font-bold"
                />
              </div>
            </div>

            {/* Passenger names */}
            <div>
              <label className="block font-semibold mb-1">
                {isBn ? 'যাত্রীদের নামসমূহ:' : 'Passenger Names:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {passengerNames.map((name, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`${isBn ? 'যাত্রী' : 'Passenger'} ${i + 1}`}
                    value={name}
                    onChange={(e) => {
                      const updated = [...passengerNames];
                      updated[i] = e.target.value;
                      setPassengerNames(updated);
                    }}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-emerald-500 bg-white"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Payment Breakdown */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
            <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              {isBn ? 'পেমেন্ট ও বিলিং হিসাব' : 'Payment & Account'}
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  {isBn ? 'জনপ্রতি ফি:' : 'Per Person:'}
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={unitPrice}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setUnitPrice(price);
                    setPaidAmount(price * passengerCount - discount);
                  }}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-emerald-500 bg-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  {isBn ? 'ছাড় (টাকা):' : 'Discount:'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setDiscount(d);
                    setPaidAmount(subtotal - d);
                  }}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  {isBn ? 'জমা দিয়েছেন:' : 'Paid Now:'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-emerald-500 bg-white font-bold text-emerald-800"
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 block">{isBn ? 'মোট প্রদেয় বিল:' : 'Total Payable:'}</span>
                <span className="text-base font-bold text-slate-900">{formatCurrency(totalPayable, language)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">{isBn ? 'বকেয়া অবশিষ্ট:' : 'Balance Due:'}</span>
                <span className={`text-base font-bold ${dueAmount > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {formatCurrency(dueAmount, language)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  {isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-emerald-500 bg-white"
                >
                  <option value="bkash">বিকাশ (bKash)</option>
                  <option value="nagad">নগদ (Nagad)</option>
                  <option value="bank">ব্যাংক ট্র্যান্সফার (Bank)</option>
                  <option value="cash">নগদ ক্যাশ (Cash)</option>
                  <option value="rocket">রকেট (Rocket)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  {isBn ? 'ট্রানজেকশন আইডি (TrxID):' : 'Transaction ID:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. BK78921"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-emerald-500 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold mb-1">
              {isBn ? 'বিশেষ নোট বা নির্দেশনাবলী:' : 'Special Notes:'}
            </label>
            <input
              type="text"
              placeholder={isBn ? 'যেমন: কাপল কটেজ অ্যালটমেন্ট / নিচ তলার সিট' : 'e.g. Ground floor seat preference'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              id="confirm-issue-ticket-btn"
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>{isBn ? 'টিকিট নিশ্চিত ও ভাউচার প্রিন্ট' : 'Confirm & Generate Ticket'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
