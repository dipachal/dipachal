export type Language = 'bn' | 'en';

export interface CompanyInfo {
  nameBn: string;
  nameEn: string;
  sloganBn: string;
  sloganEn: string;
  email: string;
  hotline: string;
  altPhone?: string;
  addressBn?: string;
  addressEn?: string;
  officeAddressBn: string;
  officeAddressEn: string;
  regNo?: string;
  bkashMerchant?: string;
  nagadMerchant?: string;
  rocketMerchant?: string;
  bankAccountDetails?: string;
}

export interface TourPackage {
  id: string;
  code: string;
  titleBn: string;
  titleEn: string;
  destinationBn: string;
  destinationEn: string;
  durationBn: string;
  durationEn: string;
  pricePerPerson: number;
  totalSeats: number;
  bookedSeats: number;
  departurePointBn: string;
  departurePointEn: string;
  nextDate: string;
  category: 'island' | 'beach' | 'hill' | 'heritage' | string;
  transportType: 'ship' | 'bus' | 'combo' | string;
  inclusionsBn: string[];
  inclusionsEn: string[];
  descriptionBn: string;
  descriptionEn: string;
  image?: string;
  status: 'active' | 'full' | 'completed';
}

export interface PassengerDetail {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  seatNo?: string;
}

export interface Booking {
  id: string;
  ticketNo: string;
  packageId?: string;
  packageTitle: string;
  destination: string;
  transportName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNid?: string;
  travelDate: string;
  returnDate?: string;
  boardingPoint: string;
  passengerCount: number;
  passengers: PassengerDetail[];
  seatNumbers: string[];
  unitPrice: number;
  subtotal: number;
  discount: number;
  totalPayable: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'paid' | 'partial' | 'due';
  paymentMethod: 'bkash' | 'nagad' | 'bank' | 'cash' | 'rocket' | string;
  transactionId?: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  notes?: string;
  createdAgent?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  categoryBn: string;
  categoryEn: string;
  amount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank' | 'rocket' | string;
  descriptionBn: string;
  descriptionEn: string;
  bookingId?: string;
  referenceBookingId?: string;
  referenceNo?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  type: 'ship' | 'ac_bus' | 'non_ac_bus' | 'luxury_coach' | 'sleeper_coach' | 'microbus' | 'tourist_coaster' | string;
  capacity: number;
  status: 'available' | 'on_trip' | 'maintenance' | 'reserved' | string;
  fuelLevelPercent: number;
  currentLocation: string;
  driverAssigned?: string;
  driverName?: string;
  driverPhone?: string;
  farePerKmBDT?: number;
  dailyRentBDT?: number;
  features?: string[];
  amenities?: string[];
  image?: string;
  routeBn?: string;
  routeEn?: string;
  lastServicedDate?: string;
  fitnessExpiryDate?: string;
  taxTokenExpiryDate?: string;
  insuranceExpiryDate?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  nid: string;
  licenseNumber: string;
  licenseType: 'heavy' | 'medium' | 'light' | string;
  experienceYears: number;
  rating: number;
  status: 'active' | 'on_leave' | 'driving' | 'suspended' | string;
  assignedVehiclePlate?: string;
  totalTripsCompleted: number;
  totalEarningsBDT: number;
  pendingPayoutBDT: number;
  avatar?: string;
  joinedDate?: string;
  emergencyContact?: string;
  bloodGroup?: string;
}

export interface Trip {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedArrivalTime: string;
  vehiclePlate: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  passengerCount: number;
  totalFareBDT: number;
  driverEarningsBDT: number;
  advancePaidBDT: number;
  dueBDT: number;
  status: 'scheduled' | 'running' | 'completed' | 'cancelled' | string;
  currentCoords?: { lat: number; lng: number };
  speedKmH?: number;
  notes?: string;
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'partial' | 'due' | string;
}

export interface VehicleExpense {
  id: string;
  vehiclePlate: string;
  category: 'fuel' | 'toll' | 'maintenance' | 'police_fine' | 'driver_allowance' | 'cleaning' | 'other' | string;
  amountBDT: number;
  date: string;
  description: string;
  tripId?: string;
  receiptPhoto?: string;
  approvedBy?: string;
}

export interface MaintenanceAlert {
  id: string;
  vehiclePlate: string;
  title: string;
  type: 'urgent' | 'warning' | 'info' | 'routine' | string;
  dueDate: string;
  dueDescription: string;
  status: 'pending' | 'completed' | string;
  costBDT?: number;
}

export interface CustomerFeedback {
  id: string;
  name: string;
  phone?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  serviceType?: string;
  verifiedBooking?: boolean;
}

export interface ServiceRequest {
  vehiclePlate: string;
  issueType: string;
  location: string;
  description: string;
  driverPhone?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'fleet_manager' | 'operator' | 'accountant' | string;
  avatar?: string;
  phone?: string;
  permissions?: string[];
}
