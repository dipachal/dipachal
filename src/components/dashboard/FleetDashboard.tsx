import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  Navigation, 
  Receipt, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Phone, 
  MapPin, 
  Fuel, 
  DollarSign, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCw, 
  RotateCcw, 
  Zap, 
  Radio, 
  LifeBuoy,
  FileSpreadsheet
} from 'lucide-react';
import { 
  Language, 
  AdminUser, 
  Vehicle, 
  Driver, 
  Trip, 
  VehicleExpense, 
  MaintenanceAlert, 
  ServiceRequest 
} from '../../types';

interface FleetDashboardProps {
  lang: Language;
  currentUser: AdminUser;
  onLogout: () => void;
  onBackToPortal: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  expenses: VehicleExpense[];
  alerts: MaintenanceAlert[];
  twoFactorEnabled: boolean;
  onToggle2FA: (val: boolean) => void;
  isOnline: boolean;
  onAddVehicle: (newVeh: Vehicle) => Promise<void>;
  onUpdateVehicle: (updated: Vehicle) => Promise<void>;
  onDeleteVehicle: (vehId: string) => Promise<void>;
  onAddDriver: (newDriver: Driver) => void;
  onUpdateDriver: (updated: Driver) => void;
  onDeleteDriver: (drvId: string) => void;
  onPayDriver: (drv: Driver) => void;
  onAddTrip: (newTrip: Trip) => void;
  onUpdateTrip: (updated: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onAddExpense: (newExp: VehicleExpense) => void;
  onAddAlert: (newAlert: MaintenanceAlert) => void;
  onResolveAlert: (id: string) => void;
  onRequestSOS: (req: ServiceRequest) => void;
  onViewTracking: (code: string) => void;
  onUpdateVehicleFuel: (plateNumber: string, newLevelPercent: number) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetToZero: () => Promise<boolean>;
  onLoadSampleData: () => Promise<void>;
  isDataSynced: boolean;
  onUpdateCurrentUser: (updated: AdminUser) => void;
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  lang,
  currentUser,
  onLogout,
  onBackToPortal,
  vehicles,
  drivers,
  trips,
  expenses,
  alerts,
  twoFactorEnabled,
  onToggle2FA,
  isOnline,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
  onPayDriver,
  onAddTrip,
  onUpdateTrip,
  onDeleteTrip,
  onAddExpense,
  onAddAlert,
  onResolveAlert,
  onRequestSOS,
  onViewTracking,
  onUpdateVehicleFuel,
  onResetToZero,
  onLoadSampleData,
  isDataSynced,
}) => {
  const isBn = lang === 'bn';

  type DashboardTab = 'overview' | 'vehicles' | 'drivers' | 'trips' | 'expenses' | 'alerts' | 'security';
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Modal / Form toggle states
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Forms states
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    name: '',
    plateNumber: '',
    type: 'ac_bus',
    capacity: 36,
    status: 'available',
    fuelLevelPercent: 85,
    currentLocation: 'ঢাকা সেন্ট্রাল',
    dailyRentBDT: 20000
  });

  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '',
    phone: '',
    licenseNumber: '',
    licenseType: 'heavy',
    experienceYears: 5,
    rating: 5.0,
    status: 'active',
    bloodGroup: 'B+'
  });

  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    customerName: '',
    customerPhone: '',
    origin: 'ঢাকা (সদরঘাট)',
    destination: 'কক্সবাজার',
    departureTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    estimatedArrivalTime: '',
    vehiclePlate: vehicles[0]?.plateNumber || '',
    driverName: drivers[0]?.name || '',
    passengerCount: 30,
    totalFareBDT: 40000,
    driverEarningsBDT: 3500,
    advancePaidBDT: 30000,
    dueBDT: 10000,
    status: 'running',
    speedKmH: 70
  });

  const [newExpense, setNewExpense] = useState<Partial<VehicleExpense>>({
    vehiclePlate: vehicles[0]?.plateNumber || '',
    category: 'fuel',
    amountBDT: 5000,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [sosRequest, setSosRequest] = useState<ServiceRequest>({
    vehiclePlate: vehicles[0]?.plateNumber || '',
    issueType: 'ব্রেক ও ইঞ্জিন সমস্যা',
    location: 'কুমিল্লা হাইওয়ে',
    description: '',
    driverPhone: '01619320400'
  });

  // Financial calculations
  const totalTripRevenue = trips.reduce((sum, t) => sum + (t.totalFareBDT || 0), 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + (e.amountBDT || 0), 0);
  const netEarnings = totalTripRevenue - totalExpensesAmount;

  // Add Vehicle handler
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.plateNumber) return;

    const fullVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      name: newVehicle.name,
      plateNumber: newVehicle.plateNumber,
      type: newVehicle.type as any || 'ac_bus',
      capacity: Number(newVehicle.capacity) || 36,
      status: newVehicle.status as any || 'available',
      fuelLevelPercent: Number(newVehicle.fuelLevelPercent) || 85,
      currentLocation: newVehicle.currentLocation || 'ঢাকা',
      dailyRentBDT: Number(newVehicle.dailyRentBDT) || 20000,
      features: ['ফুল এসি (AC)', 'জিপিএস ট্র্যাকিং', 'সাউন্ড সিস্টেম']
    };

    await onAddVehicle(fullVehicle);
    setIsAddVehicleOpen(false);
    setNewVehicle({ name: '', plateNumber: '', type: 'ac_bus', capacity: 36, status: 'available', fuelLevelPercent: 85, currentLocation: 'ঢাকা', dailyRentBDT: 20000 });
  };

  // Add Driver handler
  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) return;

    const fullDriver: Driver = {
      id: `drv-${Date.now()}`,
      name: newDriver.name,
      phone: newDriver.phone,
      nid: '1990269' + Math.floor(1000000000 + Math.random() * 9000000000),
      licenseNumber: newDriver.licenseNumber || 'DH-HV-' + Math.floor(100000 + Math.random() * 900000),
      licenseType: newDriver.licenseType as any || 'heavy',
      experienceYears: Number(newDriver.experienceYears) || 5,
      rating: 5.0,
      status: 'active',
      totalTripsCompleted: 0,
      totalEarningsBDT: 0,
      pendingPayoutBDT: 0,
      bloodGroup: newDriver.bloodGroup || 'B+'
    };

    onAddDriver(fullDriver);
    setIsAddDriverOpen(false);
    setNewDriver({ name: '', phone: '', licenseNumber: '', licenseType: 'heavy', experienceYears: 5, bloodGroup: 'B+' });
  };

  // Add Trip handler
  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.customerName || !newTrip.vehiclePlate) return;

    const matchedVeh = vehicles.find(v => v.plateNumber === newTrip.vehiclePlate);
    const matchedDriver = drivers.find(d => d.name === newTrip.driverName) || drivers[0];

    const fullTrip: Trip = {
      id: `trip-${Date.now()}`,
      trackingCode: `DWP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newTrip.customerName,
      customerPhone: newTrip.customerPhone || '01700-000000',
      origin: newTrip.origin || 'ঢাকা',
      destination: newTrip.destination || 'কক্সবাজার',
      departureTime: newTrip.departureTime || new Date().toLocaleString(),
      estimatedArrivalTime: newTrip.estimatedArrivalTime || 'শিডিউল অনুযায়ী',
      vehiclePlate: newTrip.vehiclePlate,
      vehicleName: matchedVeh?.name || 'দ্বীপাচল পরিবহন',
      driverId: matchedDriver?.id || 'drv-01',
      driverName: matchedDriver?.name || 'মো: রফিকুল ইসলাম',
      passengerCount: Number(newTrip.passengerCount) || 30,
      totalFareBDT: Number(newTrip.totalFareBDT) || 35000,
      driverEarningsBDT: Number(newTrip.driverEarningsBDT) || 3000,
      advancePaidBDT: Number(newTrip.advancePaidBDT) || 25000,
      dueBDT: (Number(newTrip.totalFareBDT) || 35000) - (Number(newTrip.advancePaidBDT) || 25000),
      status: (newTrip.status as any) || 'running',
      speedKmH: 68
    };

    onAddTrip(fullTrip);
    setIsAddTripOpen(false);
  };

  // Add Expense handler
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amountBDT || !newExpense.vehiclePlate) return;

    const fullExp: VehicleExpense = {
      id: `exp-${Date.now()}`,
      vehiclePlate: newExpense.vehiclePlate,
      category: (newExpense.category as any) || 'fuel',
      amountBDT: Number(newExpense.amountBDT) || 0,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      description: newExpense.description || 'গাড়ির জ্বালানি ও পরিচালনা খরচ'
    };

    onAddExpense(fullExp);
    setIsAddExpenseOpen(false);
  };

  // Handle SOS
  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestSOS(sosRequest);
    setIsSOSOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Dashboard Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isBn ? 'পাবলিক পোর্টালে যান' : 'Back to Public Portal'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 dark:text-white">
                  {isBn ? 'ফ্লিট অপারেশনস ড্যাশবোর্ড' : 'Fleet Operations Central'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {currentUser.role === 'super_admin' ? (isBn ? 'সুপার অ্যাডমিন' : 'Super Admin') : (isBn ? 'অপারেটর' : 'Operator')}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'লগইন আছেন:' : 'Logged in:'} {currentUser.name} ({currentUser.email})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSOSOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>{isBn ? 'জরুরি SOS অ্যালার্ট' : 'Emergency SOS'}</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isBn ? 'লগআউট' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2 border-t border-slate-100 dark:border-slate-800/60">
          {[
            { id: 'overview', labelBn: 'সারসংক্ষেপ', labelEn: 'Overview', icon: LayoutDashboard },
            { id: 'vehicles', labelBn: 'বাস ও পরিবহন বহর', labelEn: 'Vehicles', icon: Bus, badge: vehicles.length },
            { id: 'drivers', labelBn: 'চালক ব্যবস্থাপনা', labelEn: 'Drivers', icon: Users, badge: drivers.length },
            { id: 'trips', labelBn: 'রোড ট্রিপ ও ট্র্যাকিং', labelEn: 'Trips & Tracking', icon: Navigation, badge: trips.filter(t => t.status === 'running').length },
            { id: 'expenses', labelBn: 'জ্বালানি ও খরচ', labelEn: 'Expenses', icon: Receipt },
            { id: 'alerts', labelBn: 'সার্ভিসিং ও নোটিশ', labelEn: 'Maintenance Alerts', icon: AlertTriangle, badge: alerts.filter(a => a.status === 'pending').length },
            { id: 'security', labelBn: 'সিস্টেম সেটিংস ও ডাটা', labelEn: 'System & Security', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">
                  {isBn ? 'মোট পরিবহন বহর' : 'Total Fleet Vehicles'}
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {vehicles.length}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    {vehicles.filter(v => v.status === 'on_trip').length} {isBn ? 'রোডে চলছে' : 'On Trip'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">
                  {isBn ? 'সক্রিয় ও রেজিস্টার্ড চালক' : 'Registered Drivers'}
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {drivers.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {drivers.filter(d => d.status === 'driving').length} {isBn ? 'বর্তমানে স্টিয়ারিংয়ে' : 'Driving'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">
                  {isBn ? 'মোট ট্রিপ আয় (Revenue)' : 'Trip Revenue'}
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ৳{totalTripRevenue.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {trips.length} {isBn ? 'ট্রিপ' : 'Trips'}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">
                  {isBn ? 'নিট লাভ (Net Cash)' : 'Net Operations'}
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className={`text-2xl font-black ${netEarnings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ৳{netEarnings.toLocaleString()}
                  </span>
                  <span className="text-xs text-rose-500 font-medium">
                    খরচ: ৳{totalExpensesAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Trips Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isBn ? 'চলমান রোড ট্রিপসমূহ ও জিপিএস স্ট্যাটাস' : 'Active Road Trips'}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? 'লাইভ স্পিড এবং বর্তমান হাইওয়ে অবস্থান' : 'Live speed and route progress'}
                  </span>
                </div>
                <button
                  onClick={() => setIsAddTripOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'নতুন ট্রিপ বরাদ্দ' : 'Assign New Trip'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'ট্র্যাকিং কোড' : 'Code'}</th>
                      <th className="py-3 px-4">{isBn ? 'গাড়ির নম্বর ও মডেল' : 'Vehicle'}</th>
                      <th className="py-3 px-4">{isBn ? 'চালক' : 'Driver'}</th>
                      <th className="py-3 px-4">{isBn ? 'রুট' : 'Route'}</th>
                      <th className="py-3 px-4">{isBn ? 'ভাড়া' : 'Fare'}</th>
                      <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {trips.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {t.trackingCode}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {t.vehiclePlate} <br />
                          <span className="text-[11px] font-normal text-slate-500">{t.vehicleName}</span>
                        </td>
                        <td className="py-3.5 px-4">{t.driverName}</td>
                        <td className="py-3.5 px-4">
                          {t.origin} ➔ {t.destination}
                        </td>
                        <td className="py-3.5 px-4 font-bold">৳{t.totalFareBDT?.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'running'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {t.status === 'running' ? (isBn ? 'চলমান' : 'Running') : t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onViewTracking(t.trackingCode)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            {isBn ? 'জিপিএস ম্যাপ' : 'GPS View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vehicles Fleet */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'দ্বীপাচল পরিবহন বহর ব্যবস্থাপনা' : 'Vehicle Fleet Management'}
                </h3>
                <span className="text-xs text-slate-500">
                  {vehicles.length} {isBn ? 'টি বাস ও মাইক্রোবাস তালিকাভুক্ত রয়েছে' : 'vehicles registered in system'}
                </span>
              </div>
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন বাস যুক্ত করুন' : 'Add New Bus'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                        {v.plateNumber}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {v.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => onDeleteVehicle(v.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                      title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>{isBn ? 'সিট সংখ্যা:' : 'Capacity:'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{v.capacity} সিট</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isBn ? 'বর্তমান অবস্থান:' : 'Current Location:'}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{v.currentLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isBn ? 'দৈনিক ভাড়া:' : 'Daily Rent:'}</span>
                      <span className="font-bold text-emerald-600">৳{v.dailyRentBDT?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Fuel level slider */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Fuel className="w-3.5 h-3.5 text-amber-500" />
                        {isBn ? 'জ্বালানি লেভেল:' : 'Fuel Level:'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {v.fuelLevelPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={v.fuelLevelPercent}
                      onChange={(e) => onUpdateVehicleFuel(v.plateNumber, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Drivers */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'চালক ও পরিবহন স্টাফ ব্যবস্থাপনা' : 'Driver & Staff Management'}
                </h3>
                <span className="text-xs text-slate-500">
                  {drivers.length} {isBn ? 'জন রেজিস্টার্ড চালক' : 'registered professional drivers'}
                </span>
              </div>
              <button
                onClick={() => setIsAddDriverOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন চালক যুক্ত করুন' : 'Add Driver'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((d) => (
                <div
                  key={d.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {d.name}
                      </h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {d.phone}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {d.bloodGroup || 'B+'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>{isBn ? 'অভিজ্ঞতা:' : 'Experience:'}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{d.experienceYears} বছর</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isBn ? 'সম্পন্ন ট্রিপ:' : 'Trips Done:'}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{d.totalTripsCompleted} টি</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isBn ? 'বকেয়া সম্মানী:' : 'Pending Payout:'}</span>
                      <span className="font-bold text-rose-600">৳{d.pendingPayoutBDT?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onPayDriver(d)}
                      disabled={d.pendingPayoutBDT <= 0}
                      className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      {isBn ? 'bKash/নগদ পেমেন্ট' : 'Pay Driver'}
                    </button>

                    <button
                      onClick={() => onDeleteDriver(d.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={isBn ? 'মুছুন' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Trips */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'রোড ট্রিপ ও বুকিং শিডিউল' : 'Trips & Dispatch Log'}
                </h3>
                <span className="text-xs text-slate-500">
                  {trips.length} {isBn ? 'টি ট্রিপ রেকর্ড' : 'scheduled & running trips'}
                </span>
              </div>
              <button
                onClick={() => setIsAddTripOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন ট্রিপ বরাদ্দ করুন' : 'Schedule Trip'}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'কোড' : 'Code'}</th>
                      <th className="py-3 px-4">{isBn ? 'গ্রাহক / গ্রুপ' : 'Customer'}</th>
                      <th className="py-3 px-4">{isBn ? 'গাড়ির নম্বর' : 'Vehicle'}</th>
                      <th className="py-3 px-4">{isBn ? 'রুট' : 'Route'}</th>
                      <th className="py-3 px-4">{isBn ? 'ভাড়া ও বাকি' : 'Fare / Due'}</th>
                      <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {trips.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {t.trackingCode}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {t.customerName}
                          <span className="block text-[11px] font-normal text-slate-500">{t.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{t.vehiclePlate}</td>
                        <td className="py-3.5 px-4">
                          {t.origin} ➔ {t.destination}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white">৳{t.totalFareBDT?.toLocaleString()}</span>
                          {t.dueBDT > 0 && (
                            <span className="block text-[10px] text-rose-500 font-bold">বাকি: ৳{t.dueBDT}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => onViewTracking(t.trackingCode)}
                            className="text-xs text-emerald-600 hover:underline font-bold cursor-pointer"
                          >
                            {isBn ? 'ট্র্যাক' : 'Track'}
                          </button>
                          <button
                            onClick={() => onDeleteTrip(t.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            {isBn ? 'মুছুন' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Expenses */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'জ্বালানি, টোল ও গাড়ির পরিচালনা খরচ' : 'Vehicle Operational Expenses'}
                </h3>
                <span className="text-xs text-slate-500">
                  {isBn ? 'মোট খরচ:' : 'Total Expenses:'} ৳{totalExpensesAmount.toLocaleString()} BDT
                </span>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন খরচ এন্ট্রি' : 'Add Expense'}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'তারিখ' : 'Date'}</th>
                      <th className="py-3 px-4">{isBn ? 'গাড়ির নম্বর' : 'Vehicle'}</th>
                      <th className="py-3 px-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                      <th className="py-3 px-4">{isBn ? 'বিবরণ' : 'Description'}</th>
                      <th className="py-3 px-4 text-right">{isBn ? 'পরিমাণ (টাকা)' : 'Amount (BDT)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {expenses.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">{e.date}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{e.vehiclePlate}</td>
                        <td className="py-3.5 px-4">
                          <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                            {e.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{e.description}</td>
                        <td className="py-3.5 px-4 text-right font-black text-rose-600">
                          ৳{e.amountBDT?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'রক্ষণাবেক্ষণ ও টেকনিক্যাল নোটিশ' : 'Fleet Maintenance Reminders'}
                </h3>
                <span className="text-xs text-slate-500">
                  {alerts.filter(a => a.status === 'pending').length} {isBn ? 'টি কাজ অপেক্ষমান' : 'pending maintenance tasks'}
                </span>
              </div>
              <button
                onClick={() => {
                  const title = prompt(isBn ? 'অ্যালার্ট শিরোনাম লিখুন:' : 'Enter alert title:');
                  if (title) {
                    onAddAlert({
                      id: `alrt-${Date.now()}`,
                      vehiclePlate: vehicles[0]?.plateNumber || 'ঢাকা মেট্রো-ব ১৪-৮৮৪২',
                      title,
                      type: 'routine',
                      dueDate: new Date().toISOString().split('T')[0],
                      dueDescription: title,
                      status: 'pending'
                    });
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন অ্যালার্ট দিন' : 'Create Alert'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${
                    a.status === 'completed'
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-600">
                        {a.vehiclePlate}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {a.type}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {a.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {a.dueDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {isBn ? 'নির্ধারিত তারিখ:' : 'Due:'} {a.dueDate}
                    </span>

                    {a.status === 'pending' ? (
                      <button
                        onClick={() => onResolveAlert(a.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {isBn ? 'সম্পন্ন হয়েছে' : 'Mark Done'}
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {isBn ? 'সম্পন্ন' : 'Completed'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Security & System Reset */}
        {activeTab === 'security' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'টু-ফ্যাক্টর অথেন্টিকেশন (2FA Security)' : 'Two-Factor Authentication'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn 
                  ? 'অ্যাডমিন একাউন্টে অননুমোদিত প্রবেশ রোধে বাড়তি নিরাপত্তা নিশ্চিত করে।' 
                  : 'Requires second verification step for any critical dispatch action.'}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onToggle2FA(!twoFactorEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    twoFactorEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {twoFactorEnabled ? (isBn ? '2FA সক্রিয় রয়েছে' : '2FA Enabled') : (isBn ? '2FA নিষ্ক্রিয়' : '2FA Disabled')}
                </button>
              </div>
            </div>

            {/* Reset to Zero & Load Sample Data Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-500" />
                <span>{isBn ? 'ডাটা ম্যানেজমেন্ট ও রিসেট কন্ট্রোল' : 'Data Controls'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn 
                  ? 'প্রয়োজন অনুযায়ী সমস্ত ডেমো ডাটা রিসেট করতে পারেন অথবা নতুন নমুনা বাস ও চালক বহর লোড করতে পারেন।' 
                  : 'Reset data to 0 or restore standard sample vehicle fleet and drivers.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={async () => {
                    if (window.confirm(isBn ? 'আপনি কি নিশ্চিত যে সমস্ত বাস, চালক ও ট্রিপ ডাটা ০ করতে চান?' : 'Are you sure you want to reset all fleet data to zero?')) {
                      await onResetToZero();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isBn ? 'সকল ডাটা ০ করুন (Reset to 0)' : 'Reset Fleet to 0'}
                </button>

                <button
                  onClick={async () => {
                    await onLoadSampleData();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isBn ? 'নমুনা বাস ও চালক বহর লোড করুন' : 'Load Sample Fleet Data'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Vehicle */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'নতুন বাস / গাড়ি যুক্ত করুন' : 'Register New Vehicle'}
            </h3>
            <form onSubmit={handleSaveVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'গাড়ির নাম ও মডেল *' : 'Bus Name / Model *'}</label>
                <input
                  type="text"
                  required
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  placeholder={isBn ? 'যেমন: দ্বীপাচল রয়্যাল এক্সপ্রেস' : 'e.g. Dwipachal Royal Express'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'রেজিস্ট্রেশন নম্বর (প্লেট) *' : 'Plate Number *'}</label>
                <input
                  type="text"
                  required
                  value={newVehicle.plateNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                  placeholder="ঢাকা মেট্রো-ব ১৪-XXXX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'টাইপ' : 'Type'}</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="ac_bus">AC Bus</option>
                    <option value="sleeper_coach">Sleeper Coach</option>
                    <option value="luxury_coach">Luxury Coach</option>
                    <option value="tourist_coaster">Tourist Coaster</option>
                    <option value="microbus">Microbus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'সিট সংখ্যা' : 'Seats'}</label>
                  <input
                    type="number"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'সংরক্ষণ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Driver */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'নতুন চালক নিবন্ধন' : 'Register New Driver'}
            </h3>
            <form onSubmit={handleSaveDriver} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'চালকের নাম *' : 'Driver Name *'}</label>
                <input
                  type="text"
                  required
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder={isBn ? 'নাম লিখুন' : 'Driver Name'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'ফোন নম্বর *' : 'Phone Number *'}</label>
                <input
                  type="tel"
                  required
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'অভিজ্ঞতা (বছর)' : 'Experience'}</label>
                  <input
                    type="number"
                    value={newDriver.experienceYears}
                    onChange={(e) => setNewDriver({ ...newDriver, experienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                  <input
                    type="text"
                    value={newDriver.bloodGroup}
                    onChange={(e) => setNewDriver({ ...newDriver, bloodGroup: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'নিবন্ধন করুন' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Trip */}
      {isAddTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'নতুন রোড ট্রিপ শিডিউল ও টিকিট' : 'Schedule New Road Trip'}
            </h3>
            <form onSubmit={handleSaveTrip} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'যাত্রী / গ্রুপের নাম *' : 'Customer Name *'}</label>
                <input
                  type="text"
                  required
                  value={newTrip.customerName}
                  onChange={(e) => setNewTrip({ ...newTrip, customerName: e.target.value })}
                  placeholder={isBn ? 'যাত্রীর নাম' : 'Customer Name'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'গাড়ির নম্বর *' : 'Vehicle Plate *'}</label>
                  <select
                    value={newTrip.vehiclePlate}
                    onChange={(e) => setNewTrip({ ...newTrip, vehiclePlate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.plateNumber}>{v.plateNumber} ({v.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'মোট ভাড়া (টাকা)' : 'Total Fare'}</label>
                  <input
                    type="number"
                    value={newTrip.totalFareBDT}
                    onChange={(e) => setNewTrip({ ...newTrip, totalFareBDT: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'যাত্রার স্থান' : 'Origin'}</label>
                  <input
                    type="text"
                    value={newTrip.origin}
                    onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'গন্তব্য' : 'Destination'}</label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTripOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'ট্রিপ নিশ্চিত করুন' : 'Confirm Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Expense */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'গাড়ির খরচ এন্ট্রি' : 'Record Vehicle Expense'}
            </h3>
            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'গাড়ির নম্বর' : 'Vehicle Plate'}</label>
                <select
                  value={newExpense.vehiclePlate}
                  onChange={(e) => setNewExpense({ ...newExpense, vehiclePlate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plateNumber}>{v.plateNumber}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'খরচের খাত' : 'Category'}</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="fuel">Fuel (ডিজেল)</option>
                    <option value="toll">Toll (সেতু/টোল)</option>
                    <option value="maintenance">Maintenance (মেরামত)</option>
                    <option value="cleaning">Cleaning (ওয়াশ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">{isBn ? 'টাকার পরিমাণ' : 'Amount'}</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amountBDT}
                    onChange={(e) => setNewExpense({ ...newExpense, amountBDT: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'বিবরণ' : 'Description'}</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder={isBn ? 'যেমন: মেঘনা টোল ও ফুল ট্যাঙ্ক ডিজেল' : 'Expense note'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'সেভ করুন' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SOS Emergency */}
      {isSOSOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-rose-500 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <LifeBuoy className="w-6 h-6 animate-spin" />
              <h3 className="text-base font-black">
                {isBn ? 'জরুরি রোড SOS সহায়তা পাঠান' : 'Highway Emergency SOS Alert'}
              </h3>
            </div>
            <form onSubmit={handleSendSOS} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'আক্রান্ত বাস' : 'Vehicle Plate'}</label>
                <select
                  value={sosRequest.vehiclePlate}
                  onChange={(e) => setSosRequest({ ...sosRequest, vehiclePlate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plateNumber}>{v.plateNumber} ({v.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'বর্তমান রোড লোকেশন' : 'Highway Location'}</label>
                <input
                  type="text"
                  required
                  value={sosRequest.location}
                  onChange={(e) => setSosRequest({ ...sosRequest, location: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">{isBn ? 'সমস্যার ধরন ও বিবরণ' : 'Problem Details'}</label>
                <textarea
                  rows={2}
                  value={sosRequest.description}
                  onChange={(e) => setSosRequest({ ...sosRequest, description: e.target.value })}
                  placeholder={isBn ? 'টায়ার বাস্ট / ইঞ্জিন অতিরিক্ত গরম...' : 'Issue details'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSOSOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isBn ? '🚨 SOS অ্যালার্ট জারি করুন' : 'Broadcast SOS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
