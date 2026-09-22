import React, { useState } from 'react';
import { 
  Palmtree, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  Check, 
  Ship, 
  Bus, 
  Car, 
  Tag, 
  X,
  Compass
} from 'lucide-react';
import { Language, TourPackage } from '../types';
import { formatCurrency, formatDate, toBnNumber } from '../utils/helpers';

interface PackagesViewProps {
  packages: TourPackage[];
  language: Language;
  onSelectPackageForBooking: (pkg: TourPackage) => void;
  onAddPackage: (pkg: TourPackage) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  language,
  onSelectPackageForBooking,
  onAddPackage,
}) => {
  const isBn = language === 'bn';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New package form state
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newDestinationBn, setNewDestinationBn] = useState('');
  const [newDurationBn, setNewDurationBn] = useState('৩ দিন ২ রাত');
  const [newPrice, setNewPrice] = useState(7000);
  const [newTotalSeats, setNewTotalSeats] = useState(40);
  const [newDepartureBn, setNewDepartureBn] = useState('ঢাকা ও ঘাট');
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newCategory, setNewCategory] = useState<'island' | 'beach' | 'hill' | 'heritage'>('island');
  const [newTransport, setNewTransport] = useState<'ship' | 'bus' | 'combo'>('combo');
  const [newInclusions, setNewInclusions] = useState('বাস টিকেট, জাহাজ টিকেট, হোটেল, খাবার, গাইড');

  const filteredPackages = packages.filter((pkg) => {
    if (activeCategory === 'all') return true;
    return pkg.category === activeCategory;
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const inclusionsArr = newInclusions.split(',').map(s => s.trim()).filter(Boolean);

    const created: TourPackage = {
      id: `pkg-${Date.now()}`,
      code: `DWIP-PKG-${Math.floor(10 + Math.random() * 90)}`,
      titleBn: newTitleBn,
      titleEn: newTitleEn || newTitleBn,
      destinationBn: newDestinationBn,
      destinationEn: newDestinationBn,
      durationBn: newDurationBn,
      durationEn: newDurationBn,
      pricePerPerson: newPrice,
      totalSeats: newTotalSeats,
      bookedSeats: 0,
      departurePointBn: newDepartureBn,
      departurePointEn: newDepartureBn,
      nextDate: newDate,
      category: newCategory,
      transportType: newTransport,
      inclusionsBn: inclusionsArr,
      inclusionsEn: inclusionsArr,
      descriptionBn: 'দ্বীপাচল এন্টারপ্রাইজের সুব্যবস্থায় আকর্ষণীয় ট্যুর প্যাকেজ।',
      descriptionEn: 'Attractive tour package with Dwipachal Enterprise.',
      status: 'active'
    };

    onAddPackage(created);
    setIsAddModalOpen(false);
    // Reset
    setNewTitleBn('');
    setNewDestinationBn('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isBn ? 'ট্যুর ও দ্বীপ ভ্রমণ প্যাকেজসমূহ' : 'Tour & Island Packages'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn 
              ? 'সেন্টমার্টিন, সুন্দরবন, কক্সবাজার ও সাজেক সহ সক্রিয় সকল ভ্রমণ প্যাকেজ' 
              : 'Active tour packages across Bangladesh with Dwipachal Enterprise'}
          </p>
        </div>

        <button
          id="add-package-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন প্যাকেজ যোগ করুন' : 'Add Tour Package'}</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', labelBn: 'সকল প্যাকেজ', labelEn: 'All Packages' },
          { id: 'island', labelBn: '🏝️ দ্বীপ ভ্রমণ (সেন্টমার্টিন)', labelEn: 'Islands' },
          { id: 'beach', labelBn: '🌊 সমুদ্র সৈকত (কক্সবাজার/কুয়াকাটা)', labelEn: 'Beach' },
          { id: 'heritage', labelBn: '🐅 সুন্দরবন সাফারি', labelEn: 'Sundarbans' },
          { id: 'hill', labelBn: '⛰️ পাহাড়ি উপত্যকা (সাজেক)', labelEn: 'Hills' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isBn ? cat.labelBn : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => {
          const occupancy = Math.round((pkg.bookedSeats / pkg.totalSeats) * 100);
          const availableSeats = pkg.totalSeats - pkg.bookedSeats;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Tag */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pkg.transportType === 'ship' ? (
                      <Ship className="w-4 h-4 text-emerald-400" />
                    ) : pkg.transportType === 'bus' ? (
                      <Bus className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Compass className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {pkg.code}
                    </span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-300 font-medium">
                    {isBn ? pkg.durationBn : pkg.durationEn}
                  </span>
                </div>

                {/* Package Main Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {isBn ? pkg.titleBn : pkg.titleEn}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{isBn ? pkg.destinationBn : pkg.destinationEn}</span>
                    </div>
                  </div>

                  {/* Price & Next Departure */}
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider block">
                        {isBn ? 'জনপ্রতি ফি' : 'Fee Per Person'}
                      </span>
                      <span className="text-xl font-bold text-emerald-800">
                        {formatCurrency(pkg.pricePerPerson, language)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        {isBn ? 'পরবর্তী যাত্রা' : 'Next Batch'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end mt-0.5">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {formatDate(pkg.nextDate, language)}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions list */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">
                      {isBn ? 'প্যাকেজে যা যা অন্তর্ভুক্ত:' : 'Package Inclusions:'}
                    </span>
                    <ul className="space-y-1">
                      {(isBn ? pkg.inclusionsBn : pkg.inclusionsEn).slice(0, 4).map((inc, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Seat Availability Bar */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">
                        {isBn ? 'আসন পূর্ণতা:' : 'Seats Booked:'} <b>{toBnNumber(pkg.bookedSeats)}/{toBnNumber(pkg.totalSeats)}</b>
                      </span>
                      <span className={`font-semibold ${availableSeats <= 5 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {isBn ? `${toBnNumber(availableSeats)} টি বাকি` : `${availableSeats} seats left`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancy > 80 ? 'bg-rose-500' : occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="p-5 pt-0">
                <button
                  id={`book-pkg-${pkg.code}`}
                  onClick={() => onSelectPackageForBooking(pkg)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'এই প্যাকেজে টিকিট বুক করুন' : 'Book Tickets for this Package'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Package Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'নতুন ট্যুর প্যাকেজ তৈরি করুন' : 'Create New Tour Package'}</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'প্যাকেজের নাম (বাংলা):' : 'Package Title (Bangla):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সেন্টমার্টিন ৩ দিন ২ রাত প্রিমিয়াম ট্যুর"
                  value={newTitleBn}
                  onChange={(e) => setNewTitleBn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'গন্তব্যস্থান:' : 'Destination:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সেন্টমার্টিন দ্বীপ"
                    value={newDestinationBn}
                    onChange={(e) => setNewDestinationBn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'সময়কাল:' : 'Duration:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDurationBn}
                    onChange={(e) => setNewDurationBn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'জনপ্রতি মূল্য (টাকা):' : 'Price per person (BDT):'}
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'সর্বমোট আসন সংখ্যা:' : 'Total Seats:'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newTotalSeats}
                    onChange={(e) => setNewTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'যাত্রার তারিখ:' : 'Departure Date:'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'ক্যাটাগরি:' : 'Category:'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                  >
                    <option value="island">দ্বীপ ভ্রমণ (Island)</option>
                    <option value="beach">সমুদ্র সৈকত (Beach)</option>
                    <option value="heritage">সুন্দরবন সাফারি (Heritage)</option>
                    <option value="hill">পাহাড় ও উপত্যকা (Hills)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'প্যাকেজে অন্তর্ভুক্ত সুবিধাসমূহ (কমা দিয়ে লিখুন):' : 'Inclusions (comma separated):'}
                </label>
                <textarea
                  rows={2}
                  value={newInclusions}
                  onChange={(e) => setNewInclusions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  {isBn ? 'প্যাকেজ সংরক্ষণ করুন' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
