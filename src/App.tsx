import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { NotificationBar } from './components/NotificationBar';
import { HeroSection } from './components/HeroSection';
import { FleetShowcase } from './components/FleetShowcase';
import { ContactAndHelpline } from './components/ContactAndHelpline';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { SupportChatbot } from './components/SupportChatbot';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { FleetDashboard } from './components/dashboard/FleetDashboard';
import { PaymentGatewayModal } from './components/dashboard/PaymentGatewayModal';

// Existing ticket counter views
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { BookingsView } from './components/BookingsView';
import { PackagesView } from './components/PackagesView';
import { FleetView } from './components/FleetView';
import { AccountsView } from './components/AccountsView';
import { CustomersView } from './components/CustomersView';
import { SettingsView } from './components/SettingsView';
import { GoogleDriveView } from './components/GoogleDriveView';
import { TicketModal } from './components/TicketModal';
import { NewBookingModal } from './components/NewBookingModal';
import { User } from 'firebase/auth';
import { initDriveAuth } from './services/googleDriveService';

import {
  AdminUser,
  Booking,
  CompanyInfo,
  CustomerFeedback,
  Driver,
  Language,
  MaintenanceAlert,
  ServiceRequest,
  TourPackage,
  Transaction,
  Trip,
  Vehicle,
  VehicleExpense
} from './types';

import {
  INITIAL_BOOKINGS,
  INITIAL_COMPANY_INFO,
  INITIAL_PACKAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_VEHICLES,
  initialAlerts,
  initialDrivers,
  initialExpenses,
  initialFeedback,
  initialTrips
} from './data/initialData';

import {
  testFirestoreConnection,
  fetchBookingsFromFirestore,
  saveBookingToFirestore,
  deleteBookingFromFirestore,
  fetchPackagesFromFirestore,
  savePackageToFirestore,
  fetchTransactionsFromFirestore,
  saveTransactionToFirestore,
  fetchVehiclesFromFirestore,
  fetchCompanyFromFirestore,
  saveCompanyToFirestore
} from './services/firebaseService';

import { getLocalItem, setLocalItem, logActivity } from './utils/storage';
import { Bus, Ticket, Sparkles, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // Navigation / View State
  const [activeView, setActiveView] = useState<'public' | 'dashboard' | 'admin_login'>('public');
  const [dashboardSubMode, setDashboardSubMode] = useState<'fleet' | 'counter'>('fleet');
  
  // Theme & Language
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dwipachal_lang') as Language;
    return saved || 'bn';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('dwipachal_dark_mode');
    return saved === 'true';
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dwipachal_dark_mode', String(darkMode));
  }, [darkMode]);

  // Online status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Admin User Authentication
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    return getLocalItem<AdminUser | null>('dwipachal_admin_user', {
      id: 'usr-admin-01',
      name: 'দ্বীপাচল সুপার অ্যাডমিন',
      email: 'admin@dwipachal.com',
      role: 'super_admin',
      permissions: ['all']
    });
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(() => {
    return getLocalItem<boolean>('dwipachal_2fa_enabled', true);
  });

  // Data persistence states
  const [company, setCompany] = useState<CompanyInfo>(() => {
    return getLocalItem<CompanyInfo>('dwipachal_company', INITIAL_COMPANY_INFO);
  });

  const [packages, setPackages] = useState<TourPackage[]>(() => {
    return getLocalItem<TourPackage[]>('dwipachal_packages', INITIAL_PACKAGES);
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    return getLocalItem<Booking[]>('dwipachal_bookings', INITIAL_BOOKINGS);
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return getLocalItem<Transaction[]>('dwipachal_transactions', INITIAL_TRANSACTIONS);
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    return getLocalItem<Vehicle[]>('dwipachal_vehicles', INITIAL_VEHICLES);
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return getLocalItem<Driver[]>('dwipachal_drivers', initialDrivers);
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    return getLocalItem<Trip[]>('dwipachal_trips', initialTrips);
  });

  const [expenses, setExpenses] = useState<VehicleExpense[]>(() => {
    return getLocalItem<VehicleExpense[]>('dwipachal_expenses', initialExpenses);
  });

  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(() => {
    return getLocalItem<MaintenanceAlert[]>('dwipachal_alerts', initialAlerts);
  });

  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(() => {
    return getLocalItem<CustomerFeedback[]>('dwipachal_feedback', initialFeedback);
  });

  // Modals state
  const [liveTrackingModal, setLiveTrackingModal] = useState<{ isOpen: boolean; trackingCode: string }>({
    isOpen: false,
    trackingCode: 'DWP-8842'
  });
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [payingDriver, setPayingDriver] = useState<Driver | null>(null);

  // Counter View Sub-tabs State
  const [activeCounterTab, setActiveCounterTab] = useState<TabType>('dashboard');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<TourPackage | null>(null);
  const [selectedSeatForBooking, setSelectedSeatForBooking] = useState<string | null>(null);
  const [selectedVehicleNameForBooking, setSelectedVehicleNameForBooking] = useState<string | null>(null);
  const [selectedCustomerForBooking, setSelectedCustomerForBooking] = useState<{ name: string; phone: string; email: string } | null>(null);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [selectedVehicleForQuote, setSelectedVehicleForQuote] = useState<string>('');
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // Firebase status
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected: boolean;
    projectId: string;
    syncing: boolean;
    collectionsFound: string[];
  }>({
    connected: false,
    projectId: 'gen-lang-client-0724546995',
    syncing: true,
    collectionsFound: []
  });

  // Google Drive Auth Listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
    return () => unsubscribe();
  }, []);

  // Sync state to LocalStorage
  useEffect(() => { setLocalItem('dwipachal_company', company); }, [company]);
  useEffect(() => { setLocalItem('dwipachal_packages', packages); }, [packages]);
  useEffect(() => { setLocalItem('dwipachal_bookings', bookings); }, [bookings]);
  useEffect(() => { setLocalItem('dwipachal_transactions', transactions); }, [transactions]);
  useEffect(() => { setLocalItem('dwipachal_vehicles', vehicles); }, [vehicles]);
  useEffect(() => { setLocalItem('dwipachal_drivers', drivers); }, [drivers]);
  useEffect(() => { setLocalItem('dwipachal_trips', trips); }, [trips]);
  useEffect(() => { setLocalItem('dwipachal_expenses', expenses); }, [expenses]);
  useEffect(() => { setLocalItem('dwipachal_alerts', alerts); }, [alerts]);
  useEffect(() => { setLocalItem('dwipachal_feedback', feedbacks); }, [feedbacks]);
  useEffect(() => { setLocalItem('dwipachal_admin_user', currentUser); }, [currentUser]);
  useEffect(() => { setLocalItem('dwipachal_2fa_enabled', twoFactorEnabled); }, [twoFactorEnabled]);
  useEffect(() => { localStorage.setItem('dwipachal_lang', language); }, [language]);

  // Initial Firestore check and synchronization
  const syncFromFirestore = useCallback(async () => {
    setFirebaseStatus(prev => ({ ...prev, syncing: true }));
    try {
      const conn = await testFirestoreConnection();
      if (conn.connected) {
        setFirebaseStatus(prev => ({
          ...prev,
          connected: true,
          syncing: false,
          collectionsFound: conn.collectionsFound
        }));

        // Fetch bookings
        const remoteBookings = await fetchBookingsFromFirestore();
        if (remoteBookings.length > 0) {
          setBookings(remoteBookings);
        }

        // Fetch packages
        const remotePackages = await fetchPackagesFromFirestore();
        if (remotePackages.length > 0) {
          setPackages(remotePackages);
        }

        // Fetch transactions
        const remoteTx = await fetchTransactionsFromFirestore();
        if (remoteTx.length > 0) {
          setTransactions(remoteTx);
        }

        // Fetch vehicles
        const remoteVehicles = await fetchVehiclesFromFirestore();
        if (remoteVehicles.length > 0) {
          setVehicles(remoteVehicles);
        }

        // Fetch company
        const remoteComp = await fetchCompanyFromFirestore();
        if (remoteComp) {
          setCompany(remoteComp);
        }
      } else {
        setFirebaseStatus(prev => ({ ...prev, connected: false, syncing: false }));
      }
    } catch (e) {
      console.warn('Firestore sync failed, local persistence active:', e);
      setFirebaseStatus(prev => ({ ...prev, connected: false, syncing: false }));
    }
  }, []);

  useEffect(() => {
    syncFromFirestore();
  }, [syncFromFirestore]);

  // Handlers for Fleet Dashboard
  const handleAddVehicle = async (newVeh: Vehicle) => {
    setVehicles(prev => [newVeh, ...prev]);
    logActivity('Add Vehicle', currentUser?.name || 'Admin', `Added ${newVeh.name} (${newVeh.plateNumber})`, 'fleet');
  };

  const handleUpdateVehicle = async (updated: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v));
    logActivity('Update Vehicle', currentUser?.name || 'Admin', `Updated ${updated.name}`, 'fleet');
  };

  const handleDeleteVehicle = async (vehId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehId));
    logActivity('Delete Vehicle', currentUser?.name || 'Admin', `Deleted vehicle ${vehId}`, 'fleet');
  };

  const handleUpdateVehicleFuel = (plateNumber: string, newLevelPercent: number) => {
    setVehicles(prev => prev.map(v => v.plateNumber === plateNumber ? { ...v, fuelLevelPercent: newLevelPercent } : v));
  };

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [newDriver, ...prev]);
    logActivity('Add Driver', currentUser?.name || 'Admin', `Added driver ${newDriver.name}`, 'fleet');
  };

  const handleUpdateDriver = (updated: Driver) => {
    setDrivers(prev => prev.map(d => d.id === updated.id ? updated : d));
    logActivity('Update Driver', currentUser?.name || 'Admin', `Updated driver ${updated.name}`, 'fleet');
  };

  const handleDeleteDriver = (drvId: string) => {
    setDrivers(prev => prev.filter(d => d.id !== drvId));
    logActivity('Delete Driver', currentUser?.name || 'Admin', `Deleted driver ${drvId}`, 'fleet');
  };

  const handleAddTrip = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
    logActivity('Add Trip', currentUser?.name || 'Admin', `Scheduled trip ${newTrip.trackingCode} (${newTrip.origin} - ${newTrip.destination})`, 'fleet');
  };

  const handleUpdateTrip = (updated: Trip) => {
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const handleAddExpense = (newExp: VehicleExpense) => {
    setExpenses(prev => [newExp, ...prev]);
    logActivity('Add Vehicle Expense', currentUser?.name || 'Admin', `Expense ৳${newExp.amountBDT} for ${newExp.vehiclePlate}`, 'financial');
  };

  const handleAddAlert = (newAlert: MaintenanceAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
    logActivity('Resolve Alert', currentUser?.name || 'Admin', `Resolved maintenance alert ${id}`, 'fleet');
  };

  const handleRequestSOS = (req: ServiceRequest) => {
    const alert: MaintenanceAlert = {
      id: `sos-${Date.now()}`,
      vehiclePlate: req.vehiclePlate,
      title: `জরুরি SOS রোড সার্ভিসিং: ${req.issueType}`,
      type: 'urgent',
      dueDate: new Date().toISOString().split('T')[0],
      dueDescription: `লোকেশন: ${req.location}. বিবরণ: ${req.description} (ড্রাইভার: ${req.driverPhone || 'N/A'})`,
      status: 'pending',
      costBDT: 0
    };
    setAlerts(prev => [alert, ...prev]);
    setNotificationCenterOpen(true);
    logActivity('SOS Emergency', currentUser?.name || 'Driver', `SOS dispatched for ${req.vehiclePlate}`, 'fleet');
  };

  const handleCompleteDriverPayment = (driverId: string, amount: number, trxId: string) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          pendingPayoutBDT: Math.max(0, d.pendingPayoutBDT - amount),
          totalEarningsBDT: d.totalEarningsBDT + amount
        };
      }
      return d;
    }));

    // Record as transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      categoryBn: 'ড্রাইভার পেমেন্ট ও ভাতা',
      categoryEn: 'Driver Payout',
      amount: amount,
      paymentMethod: 'bkash',
      descriptionBn: `ড্রাইভার আইডি ${driverId} কে ডিজিটাল পেআউট সম্পন্ন (Trx: ${trxId})`,
      descriptionEn: `Driver payout for ID ${driverId}`,
      referenceNo: trxId
    };
    setTransactions(prev => [newTx, ...prev]);
    logActivity('Driver Payment', currentUser?.name || 'Admin', `Paid ৳${amount} to driver ${driverId}`, 'financial');
  };

  const handleResetToZero = async (): Promise<boolean> => {
    setVehicles([]);
    setDrivers([]);
    setTrips([]);
    setExpenses([]);
    setAlerts([]);
    logActivity('System Reset', currentUser?.name || 'Admin', 'Cleared all fleet records', 'security');
    return true;
  };

  const handleLoadSampleData = async () => {
    setVehicles(INITIAL_VEHICLES);
    setDrivers(initialDrivers);
    setTrips(initialTrips);
    setExpenses(initialExpenses);
    setAlerts(initialAlerts);
    setFeedbacks(initialFeedback);
    logActivity('Load Sample Data', currentUser?.name || 'Admin', 'Loaded default fleet dataset', 'general');
  };

  // Handlers for Ticket Counter & Bookings
  const handleOpenNewBooking = () => {
    setSelectedPackageForBooking(null);
    setSelectedSeatForBooking(null);
    setSelectedVehicleNameForBooking(null);
    setSelectedCustomerForBooking(null);
    setIsNewBookingOpen(true);
  };

  const handleSelectPackageForBooking = (pkg: TourPackage) => {
    setSelectedPackageForBooking(pkg);
    setIsNewBookingOpen(true);
  };

  const handleBookSeat = (vehicleName: string, seatNo: string) => {
    setSelectedVehicleNameForBooking(vehicleName);
    setSelectedSeatForBooking(seatNo);
    setIsNewBookingOpen(true);
  };

  const handleBookForCustomer = (name: string, phone: string, email: string) => {
    setSelectedCustomerForBooking({ name, phone, email });
    setIsNewBookingOpen(true);
  };

  const handleAddBooking = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setIsNewBookingOpen(false);
    setActiveTicketBooking(newBooking);

    if (newBooking.paidAmount > 0) {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        date: newBooking.bookingDate,
        type: 'income',
        categoryBn: 'টিকেট ও প্যাকেজ বুকিং',
        categoryEn: 'Booking Income',
        amount: newBooking.paidAmount,
        paymentMethod: newBooking.paymentMethod,
        descriptionBn: `টিকেট বুকিং #${newBooking.ticketNo} (${newBooking.customerName})`,
        descriptionEn: `Ticket booking #${newBooking.ticketNo}`,
        bookingId: newBooking.id,
        referenceBookingId: newBooking.id,
        referenceNo: newBooking.transactionId || newBooking.ticketNo
      };
      setTransactions(prev => [newTx, ...prev]);
      saveTransactionToFirestore(newTx);
    }

    await saveBookingToFirestore(newBooking);
    logActivity('Create Booking', currentUser?.name || 'Counter', `Issued ticket #${newBooking.ticketNo}`, 'booking');
  };

  const handleUpdateBooking = async (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    await saveBookingToFirestore(updated);
  };

  const handleDeleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    await deleteBookingFromFirestore(id);
  };

  const handleAddPackage = async (newPkg: TourPackage) => {
    setPackages(prev => [newPkg, ...prev]);
    await savePackageToFirestore(newPkg);
  };

  const handleAddTransaction = async (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    await saveTransactionToFirestore(newTx);
  };

  const handleUpdateCompany = async (updated: CompanyInfo) => {
    setCompany(updated);
    await saveCompanyToFirestore(updated);
  };

  const handleExportData = () => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      company,
      packages,
      bookings,
      transactions,
      vehicles,
      drivers,
      trips,
      expenses,
      alerts,
      feedbacks
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dwipachal_enterprise_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.company) setCompany(data.company);
        if (data.packages) setPackages(data.packages);
        if (data.bookings) setBookings(data.bookings);
        if (data.transactions) setTransactions(data.transactions);
        if (data.vehicles) setVehicles(data.vehicles);
        if (data.drivers) setDrivers(data.drivers);
        if (data.trips) setTrips(data.trips);
        if (data.expenses) setExpenses(data.expenses);
        if (data.alerts) setAlerts(data.alerts);
        if (data.feedbacks) setFeedbacks(data.feedbacks);
        alert(language === 'bn' ? 'সফলভাবে ডাটাবেজ ব্যাকআপ রিস্টোর হয়েছে!' : 'Backup successfully restored!');
      } catch (err) {
        alert(language === 'bn' ? 'ডাটা ফাইল পড়তে সমস্যা হয়েছে!' : 'Failed to parse backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে সমস্ত ডাটা ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?' : 'Reset all data to defaults?')) {
      setCompany(INITIAL_COMPANY_INFO);
      setPackages(INITIAL_PACKAGES);
      setBookings(INITIAL_BOOKINGS);
      setTransactions(INITIAL_TRANSACTIONS);
      setVehicles(INITIAL_VEHICLES);
      setDrivers(initialDrivers);
      setTrips(initialTrips);
      setExpenses(initialExpenses);
      setAlerts(initialAlerts);
      setFeedbacks(initialFeedback);
    }
  };

  const handlePushToFirestore = async () => {
    try {
      await saveCompanyToFirestore(company);
      for (const b of bookings) await saveBookingToFirestore(b);
      for (const p of packages) await savePackageToFirestore(p);
      for (const t of transactions) await saveTransactionToFirestore(t);
      alert(language === 'bn' ? 'সমস্ত ডাটা ফায়ারবেজে ক্লাউড সিংক্রোনাইজ করা হয়েছে!' : 'All data pushed to Firestore!');
    } catch (e: any) {
      alert('Sync error: ' + e.message);
    }
  };

  const handleRestoreDriveData = (data: any) => {
    if (data.company) setCompany(data.company);
    if (data.packages) setPackages(data.packages);
    if (data.bookings) setBookings(data.bookings);
    if (data.transactions) setTransactions(data.transactions);
    if (data.vehicles) setVehicles(data.vehicles);
    if (data.drivers) setDrivers(data.drivers);
    if (data.trips) setTrips(data.trips);
    if (data.expenses) setExpenses(data.expenses);
    if (data.alerts) setAlerts(data.alerts);
  };

  const handleAddFeedback = (newFb: CustomerFeedback) => {
    setFeedbacks(prev => [newFb, ...prev]);
  };

  const isBn = language === 'bn';
  const pendingAlertCount = alerts.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        lang={language}
        onToggleLang={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenLogin={() => setActiveView('admin_login')}
        onLogout={() => {
          setCurrentUser(null);
          setActiveView('public');
        }}
        isOnline={isOnline}
        alertCount={pendingAlertCount}
        onOpenAlerts={() => setNotificationCenterOpen(true)}
        onOpenChat={() => setChatbotOpen(true)}
      />

      {/* 2. Notification / Live Trip Status Bar */}
      <NotificationBar
        lang={language}
        alerts={alerts}
        trips={trips}
        vehicles={vehicles}
        onViewTracking={(code) => setLiveTrackingModal({ isOpen: true, trackingCode: code })}
        onOpenNotificationCenter={() => setNotificationCenterOpen(true)}
      />

      {/* 3. Main Views */}
      {activeView === 'public' && (
        <main className="flex-1">
          {/* Hero with interactive ticket booking & search */}
          <HeroSection
            lang={language}
            onOpenBooking={handleOpenNewBooking}
            onOpenFleet={() => {
              document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenLogin={() => setActiveView('admin_login')}
          />

          {/* Fleet Showcase */}
          <FleetShowcase
            lang={language}
            currentUser={currentUser}
            onSelectVehicleForQuote={(vehName) => {
              setSelectedVehicleForQuote(vehName);
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />

          {/* Contact, Booking Inquiry & 24/7 Helpline */}
          <ContactAndHelpline
            lang={language}
            selectedVehicle={selectedVehicleForQuote}
            vehicles={vehicles}
          />

          {/* Customer Reviews & Feedback */}
          <FeedbackSection
            lang={language}
            feedbacks={feedbacks}
            onAddFeedback={handleAddFeedback}
          />

          {/* Footer */}
          <Footer
            lang={language}
            onNavigateTo={(view) => setActiveView(view)}
          />
        </main>
      )}

      {/* Admin Login View */}
      {activeView === 'admin_login' && (
        <AdminLoginPage
          lang={language}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setActiveView('dashboard');
          }}
          onBackToPublic={() => setActiveView('public')}
        />
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="flex-1 flex flex-col">
          {/* Sub-mode Switcher: Fleet Operations vs Ticket Desk */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isBn ? 'ম্যানেজমেন্ট মোড:' : 'Management Mode:'}
              </span>
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setDashboardSubMode('fleet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dashboardSubMode === 'fleet'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ফ্লিট অপারেশনস ও জিপিএস' : 'Fleet Operations & GPS'}</span>
                </button>
                <button
                  onClick={() => setDashboardSubMode('counter')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dashboardSubMode === 'counter'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{isBn ? 'টিকেট কাউন্টার ও অ্যাকাউন্টস' : 'Ticket Counter & Accounts'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('public')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isBn ? '← পাবলিক পোর্টাল দেখুন' : '← View Public Portal'}
              </button>
              <button
                onClick={handleOpenNewBooking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{isBn ? 'নতুন টিকিট ইস্যু' : 'Issue Ticket'}</span>
              </button>
            </div>
          </div>

          {/* Sub-mode 1: Fleet Operations Dashboard */}
          {dashboardSubMode === 'fleet' && (
            <FleetDashboard
              lang={language}
              currentUser={currentUser || {
                id: 'usr-admin-01',
                name: 'সুপার অ্যাডমিন',
                email: 'admin@dwipachal.com',
                role: 'super_admin'
              }}
              onLogout={() => {
                setCurrentUser(null);
                setActiveView('public');
              }}
              onBackToPortal={() => setActiveView('public')}
              vehicles={vehicles}
              drivers={drivers}
              trips={trips}
              expenses={expenses}
              alerts={alerts}
              twoFactorEnabled={twoFactorEnabled}
              onToggle2FA={(val) => setTwoFactorEnabled(val)}
              isOnline={isOnline}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onAddDriver={handleAddDriver}
              onUpdateDriver={handleUpdateDriver}
              onDeleteDriver={handleDeleteDriver}
              onPayDriver={(drv) => setPayingDriver(drv)}
              onAddTrip={handleAddTrip}
              onUpdateTrip={handleUpdateTrip}
              onDeleteTrip={handleDeleteTrip}
              onAddExpense={handleAddExpense}
              onAddAlert={handleAddAlert}
              onResolveAlert={handleResolveAlert}
              onRequestSOS={handleRequestSOS}
              onViewTracking={(code) => setLiveTrackingModal({ isOpen: true, trackingCode: code })}
              onUpdateVehicleFuel={handleUpdateVehicleFuel}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(d => !d)}
              onResetToZero={handleResetToZero}
              onLoadSampleData={handleLoadSampleData}
              isDataSynced={firebaseStatus.connected}
              onUpdateCurrentUser={(updated) => setCurrentUser(updated)}
            />
          )}

          {/* Sub-mode 2: Ticket Counter & Bookings Management */}
          {dashboardSubMode === 'counter' && (
            <div className="flex-1 flex flex-col">
              <Header
                company={company}
                language={language}
                onLanguageChange={(l) => setLanguage(l)}
                onOpenNewBooking={handleOpenNewBooking}
                activeTab={activeCounterTab}
                firebaseStatus={firebaseStatus}
                onRefreshFirestore={syncFromFirestore}
                currentUser={googleUser}
                onOpenGoogleDrive={() => setActiveCounterTab('drive')}
              />

              <Navigation
                activeTab={activeCounterTab}
                onTabChange={(t) => setActiveCounterTab(t)}
                language={language}
                bookingCount={bookings.length}
                packageCount={packages.length}
                dueCount={bookings.filter(b => b.paymentStatus !== 'paid').length}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
                {activeCounterTab === 'dashboard' && (
                  <DashboardView
                    company={company}
                    packages={packages}
                    bookings={bookings}
                    transactions={transactions}
                    language={language}
                    onOpenNewBooking={handleOpenNewBooking}
                    onNavigateTab={(tab) => setActiveCounterTab(tab)}
                    onViewTicket={(b) => setActiveTicketBooking(b)}
                  />
                )}

                {activeCounterTab === 'bookings' && (
                  <BookingsView
                    bookings={bookings}
                    company={company}
                    language={language}
                    onOpenNewBooking={handleOpenNewBooking}
                    onViewTicket={(b) => setActiveTicketBooking(b)}
                    onUpdateBooking={handleUpdateBooking}
                    onDeleteBooking={handleDeleteBooking}
                  />
                )}

                {activeCounterTab === 'packages' && (
                  <PackagesView
                    packages={packages}
                    language={language}
                    onSelectPackageForBooking={handleSelectPackageForBooking}
                    onAddPackage={handleAddPackage}
                  />
                )}

                {activeCounterTab === 'fleet' && (
                  <FleetView
                    vehicles={vehicles}
                    bookings={bookings}
                    language={language}
                    onBookSeat={handleBookSeat}
                  />
                )}

                {activeCounterTab === 'accounts' && (
                  <AccountsView
                    transactions={transactions}
                    bookings={bookings}
                    language={language}
                    onAddTransaction={handleAddTransaction}
                  />
                )}

                {activeCounterTab === 'customers' && (
                  <CustomersView
                    bookings={bookings}
                    language={language}
                    onBookForCustomer={handleBookForCustomer}
                  />
                )}

                {activeCounterTab === 'drive' && (
                  <GoogleDriveView
                    language={language}
                    company={company}
                    currentBackupData={{
                      version: '2.0',
                      exportedAt: new Date().toISOString(),
                      company,
                      packages,
                      bookings,
                      transactions,
                      vehicles,
                      drivers,
                      trips,
                      expenses,
                      alerts
                    }}
                    onRestoreData={handleRestoreDriveData}
                    currentUser={googleUser}
                    onUserChange={setGoogleUser}
                  />
                )}

                {activeCounterTab === 'settings' && (
                  <SettingsView
                    company={company}
                    language={language}
                    onUpdateCompany={handleUpdateCompany}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                    onResetData={handleResetData}
                    firebaseStatus={firebaseStatus}
                    onSyncFromFirestore={syncFromFirestore}
                    onPushToFirestore={handlePushToFirestore}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Global Modals & Overlays */}

      {/* Live GPS Tracking Modal */}
      <LiveTrackingModal
        isOpen={liveTrackingModal.isOpen}
        onClose={() => setLiveTrackingModal({ isOpen: false, trackingCode: '' })}
        lang={language}
        trips={trips}
        vehicles={vehicles}
        initialTrackingCode={liveTrackingModal.trackingCode}
      />

      {/* AI Customer Support Chatbot */}
      <SupportChatbot
        lang={language}
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />

      {/* System Notification & Alert Center */}
      <NotificationCenterModal
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        lang={language}
        alerts={alerts}
        trips={trips}
        vehicles={vehicles}
        onResolveAlert={handleResolveAlert}
        onViewTracking={(code) => {
          setNotificationCenterOpen(false);
          setLiveTrackingModal({ isOpen: true, trackingCode: code });
        }}
      />

      {/* Driver Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={!!payingDriver}
        onClose={() => setPayingDriver(null)}
        lang={language}
        driver={payingDriver}
        onCompletePayment={handleCompleteDriverPayment}
      />

      {/* Printable E-Ticket Voucher Modal */}
      <TicketModal
        booking={activeTicketBooking}
        company={company}
        language={language}
        onClose={() => setActiveTicketBooking(null)}
      />

      {/* New Booking Modal */}
      {isNewBookingOpen && (
        <NewBookingModal
          packages={packages}
          vehicles={vehicles}
          company={company}
          language={language}
          initialPackage={selectedPackageForBooking}
          initialSeat={selectedSeatForBooking}
          initialVehicleName={selectedVehicleNameForBooking}
          initialCustomer={selectedCustomerForBooking}
          onClose={() => setIsNewBookingOpen(false)}
          onSubmitBooking={handleAddBooking}
        />
      )}

    </div>
  );
}
