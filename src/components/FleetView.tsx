import React, { useState } from 'react';
import { 
  Ship, 
  Bus, 
  Car, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Ticket,
  Info
} from 'lucide-react';
import { Booking, Language, Vehicle } from '../types';
import { toBnNumber } from '../utils/helpers';

interface FleetViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  language: Language;
  onBookSeat: (vehicleName: string, seatNo: string) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({
  vehicles,
  bookings,
  language,
  onBookSeat,
}) => {
  const isBn = language === 'bn';
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [selectedSeatInfo, setSelectedSeatInfo] = useState<{ seat: string; booking?: Booking } | null>(null);

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Map booked seats for this vehicle
  const vehicleBookings = bookings.filter((b) => 
    b.transportName.toLowerCase().includes(activeVehicle.name.toLowerCase()) ||
    activeVehicle.name.toLowerCase().includes(b.transportName.toLowerCase()) ||
    (activeVehicle.type === 'ship' && b.destination.includes('সেন্টমার্টিন'))
  );

  const bookedSeatsMap = new Map<string, Booking>();
  vehicleBookings.forEach((b) => {
    b.seatNumbers.forEach((seat) => {
      bookedSeatsMap.set(seat.toUpperCase(), b);
    });
  });

  // Generate seat grid according to vehicle type
  const renderSeatGrid = () => {
    if (activeVehicle.type === 'ship') {
      // Ship layout: Deck & Cabins
      const cabins = ['Cabin-101', 'Cabin-102', 'Cabin-103', 'Cabin-104', 'Cabin-105', 'Cabin-106'];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const seatsPerRow = 6;

      return (
        <div className="space-y-6">
          {/* Cabins Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'ভিআইপি কেবিন ডেক (VIP Deluxe Cabins)' : 'VIP Deluxe Cabins'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {cabins.map((cabin) => {
                const booking = bookedSeatsMap.get(cabin.toUpperCase());
                const isBooked = !!booking;
                return (
                  <button
                    key={cabin}
                    onClick={() => {
                      if (isBooked) {
                        setSelectedSeatInfo({ seat: cabin, booking });
                      } else {
                        onBookSeat(activeVehicle.name, cabin);
                      }
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:scale-102'
                    }`}
                  >
                    <div className="font-bold text-xs">{cabin}</div>
                    <div className={`text-[10px] font-semibold mt-1 ${isBooked ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isBooked ? (isBn ? 'বুকড' : 'Booked') : (isBn ? 'খালি' : 'Available')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Deck Chairs */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
              <span>{isBn ? 'মেইন ডেক চেয়ার আসন (Main Open Deck)' : 'Main Deck Open Seating'}</span>
            </h4>
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex items-center justify-between sm:justify-center gap-2">
                  <span className="w-5 text-center font-bold text-xs text-slate-400">{row}</span>
                  {/* Left pair */}
                  <div className="flex gap-2">
                    {[1, 2, 3].map((num) => {
                      const seatNo = `${row}${num}`;
                      const booking = bookedSeatsMap.get(seatNo.toUpperCase());
                      const isBooked = !!booking;
                      return (
                        <button
                          key={seatNo}
                          onClick={() => {
                            if (isBooked) {
                              setSelectedSeatInfo({ seat: seatNo, booking });
                            } else {
                              onBookSeat(activeVehicle.name, seatNo);
                            }
                          }}
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                            isBooked
                              ? 'bg-slate-800 border-slate-900 text-white shadow-xs'
                              : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500'
                          }`}
                          title={isBooked ? `${seatNo} (Booked by ${booking.customerName})` : `${seatNo} (Available)`}
                        >
                          <span>{seatNo}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="w-6 sm:w-10 text-center text-[10px] text-slate-300 font-sans">
                    •
                  </div>

                  {/* Right pair */}
                  <div className="flex gap-2">
                    {[4, 5, 6].map((num) => {
                      const seatNo = `${row}${num}`;
                      const booking = bookedSeatsMap.get(seatNo.toUpperCase());
                      const isBooked = !!booking;
                      return (
                        <button
                          key={seatNo}
                          onClick={() => {
                            if (isBooked) {
                              setSelectedSeatInfo({ seat: seatNo, booking });
                            } else {
                              onBookSeat(activeVehicle.name, seatNo);
                            }
                          }}
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                            isBooked
                              ? 'bg-slate-800 border-slate-900 text-white shadow-xs'
                              : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500'
                          }`}
                          title={isBooked ? `${seatNo} (Booked by ${booking.customerName})` : `${seatNo} (Available)`}
                        >
                          <span>{seatNo}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Standard 2x2 Bus Layout
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      return (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto">
          {/* Driver seat indicator */}
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 text-xs font-semibold text-slate-400">
            <span>{isBn ? 'প্রবেশদ্বার (Entry)' : 'Door / Entry'}</span>
            <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
              {isBn ? 'ড্রাইভার কেবিন' : 'Driver Cabin'}
            </span>
          </div>

          <div className="space-y-2.5">
            {rows.map((row) => (
              <div key={row} className="flex items-center justify-between gap-3">
                {/* Left 2 seats */}
                <div className="flex gap-2">
                  {[1, 2].map((num) => {
                    const seatNo = `${row}${num}`;
                    const booking = bookedSeatsMap.get(seatNo.toUpperCase());
                    const isBooked = !!booking;
                    return (
                      <button
                        key={seatNo}
                        onClick={() => {
                          if (isBooked) {
                            setSelectedSeatInfo({ seat: seatNo, booking });
                          } else {
                            onBookSeat(activeVehicle.name, seatNo);
                          }
                        }}
                        className={`w-11 h-11 rounded-xl text-xs font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500 hover:scale-105'
                        }`}
                        title={isBooked ? `${seatNo} (Booked)` : `${seatNo} (Available)`}
                      >
                        {seatNo}
                      </button>
                    );
                  })}
                </div>

                {/* Central Walkway */}
                <div className="text-[10px] text-slate-300 font-mono tracking-widest">
                  |
                </div>

                {/* Right 2 seats */}
                <div className="flex gap-2">
                  {[3, 4].map((num) => {
                    const seatNo = `${row}${num}`;
                    const booking = bookedSeatsMap.get(seatNo.toUpperCase());
                    const isBooked = !!booking;
                    return (
                      <button
                        key={seatNo}
                        onClick={() => {
                          if (isBooked) {
                            setSelectedSeatInfo({ seat: seatNo, booking });
                          } else {
                            onBookSeat(activeVehicle.name, seatNo);
                          }
                        }}
                        className={`w-11 h-11 rounded-xl text-xs font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500 hover:scale-105'
                        }`}
                        title={isBooked ? `${seatNo} (Booked)` : `${seatNo} (Available)`}
                      >
                        {seatNo}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isBn ? 'জাহাজ ও পরিবহন সিট প্ল্যান' : 'Fleet & Seat Layout Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn 
              ? 'এমভি দ্বীপাচল জাহাজ ও এসি বাসের আসন বিন্যাস ও টিকিট বরাদ্দ' 
              : 'Interactive seat allocation for MV Dwipachal cruise ships and coaches'}
          </p>
        </div>
      </div>

      {/* Vehicle Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((v) => {
          const isSelected = v.id === activeVehicle.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVehicleId(v.id);
                setSelectedSeatInfo(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {v.type === 'ship' ? <Ship className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {v.status === 'available' ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'অন-ট্রিপ' : 'On-Trip')}
                </span>
              </div>

              <h4 className="font-bold text-sm line-clamp-1">{v.name}</h4>
              <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                {isBn ? v.routeBn : v.routeEn}
              </p>
              <div className={`text-[11px] font-mono mt-2 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                {isBn ? `ধারণক্ষমতা: ${toBnNumber(v.capacity)} আসন` : `Capacity: ${v.capacity} Seats`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Seat Map Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              {isBn ? 'নির্বাচিত পরিবহন' : 'Selected Vehicle'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {activeVehicle.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? activeVehicle.routeBn : activeVehicle.routeEn}</span>
            </p>
          </div>

          {/* Seat Status Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-white border border-emerald-400"></div>
              <span className="text-slate-600">{isBn ? 'খালি (বুকিং করতে ক্লিক করুন)' : 'Available (Click to book)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-900"></div>
              <span className="text-slate-600">{isBn ? 'সংরক্ষিত / বুকড' : 'Booked'}</span>
            </div>
          </div>
        </div>

        {/* Selected Seat Inspector Modal / Banner */}
        {selectedSeatInfo && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-blue-900 block text-sm">
                {isBn ? `আসন তথ্য: ${selectedSeatInfo.seat}` : `Seat Details: ${selectedSeatInfo.seat}`}
              </span>
              {selectedSeatInfo.booking ? (
                <div className="text-blue-800 mt-1 flex flex-wrap gap-x-4">
                  <span><b>{isBn ? 'যাত্রী:' : 'Customer:'}</b> {selectedSeatInfo.booking.customerName}</span>
                  <span><b>{isBn ? 'ফোন:' : 'Phone:'}</b> {selectedSeatInfo.booking.customerPhone}</span>
                  <span><b>{isBn ? 'টিকেট নং:' : 'PNR:'}</b> {selectedSeatInfo.booking.ticketNo}</span>
                </div>
              ) : (
                <span className="text-blue-700">{isBn ? 'এই আসনটি বর্তমানে সম্পূর্ণ খালি রয়েছে।' : 'This seat is currently available for reservation.'}</span>
              )}
            </div>
            <button
              onClick={() => setSelectedSeatInfo(null)}
              className="text-blue-600 hover:text-blue-800 font-semibold self-end sm:self-auto cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Render Grid */}
        {renderSeatGrid()}
      </div>
    </div>
  );
};
