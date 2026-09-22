import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Booking, CompanyInfo, TourPackage, Transaction, Vehicle } from '../types';

// Collection references
export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  PACKAGES: 'packages',
  TRANSACTIONS: 'transactions',
  VEHICLES: 'vehicles',
  COMPANY: 'company_info',
  TICKETS: 'tickets', // alternate collection
};

// Test if Firestore is connected and accessible
export async function testFirestoreConnection(): Promise<{ connected: boolean; collectionsFound: string[]; error?: string }> {
  try {
    const found: string[] = [];
    const namesToTest = ['bookings', 'packages', 'transactions', 'vehicles', 'tickets', 'users'];
    
    for (const name of namesToTest) {
      try {
        const snap = await getDocs(collection(db, name));
        if (!snap.empty) {
          found.push(`${name} (${snap.size} records)`);
        }
      } catch (e) {
        // collection read may fail if rules prevent it or empty
      }
    }
    
    return { connected: true, collectionsFound: found };
  } catch (err: any) {
    console.error('Firestore connection error:', err);
    return { connected: false, collectionsFound: [], error: err.message };
  }
}

// Fetch all bookings from Firestore
export async function fetchBookingsFromFirestore(): Promise<Booking[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
    const list: Booking[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Booking);
    });

    // If bookings was empty, check alternate 'tickets' collection
    if (list.length === 0) {
      const ticketSnap = await getDocs(collection(db, COLLECTIONS.TICKETS));
      ticketSnap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Booking);
      });
    }

    return list;
  } catch (error) {
    console.warn('Error reading bookings from Firestore:', error);
    return [];
  }
}

// Save or update a booking in Firestore
export async function saveBookingToFirestore(booking: Booking): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.BOOKINGS, booking.id), booking);
  } catch (error) {
    console.error('Error saving booking to Firestore:', error);
  }
}

// Delete a booking in Firestore
export async function deleteBookingFromFirestore(bookingId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId));
  } catch (error) {
    console.error('Error deleting booking from Firestore:', error);
  }
}

// Fetch packages
export async function fetchPackagesFromFirestore(): Promise<TourPackage[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PACKAGES));
    const list: TourPackage[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as TourPackage);
    });
    return list;
  } catch (error) {
    console.warn('Error reading packages from Firestore:', error);
    return [];
  }
}

// Save package to Firestore
export async function savePackageToFirestore(pkg: TourPackage): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.PACKAGES, pkg.id), pkg);
  } catch (error) {
    console.error('Error saving package to Firestore:', error);
  }
}

// Fetch transactions
export async function fetchTransactionsFromFirestore(): Promise<Transaction[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.TRANSACTIONS));
    const list: Transaction[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Transaction);
    });
    return list;
  } catch (error) {
    console.warn('Error reading transactions from Firestore:', error);
    return [];
  }
}

// Save transaction
export async function saveTransactionToFirestore(tx: Transaction): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, tx.id), tx);
  } catch (error) {
    console.error('Error saving transaction to Firestore:', error);
  }
}

// Fetch vehicles
export async function fetchVehiclesFromFirestore(): Promise<Vehicle[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.VEHICLES));
    const list: Vehicle[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Vehicle);
    });
    return list;
  } catch (error) {
    console.warn('Error reading vehicles from Firestore:', error);
    return [];
  }
}

// Fetch company settings
export async function fetchCompanyFromFirestore(): Promise<CompanyInfo | null> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.COMPANY));
    let company: CompanyInfo | null = null;
    snap.forEach((d) => {
      company = d.data() as CompanyInfo;
    });
    return company;
  } catch (error) {
    console.warn('Error reading company from Firestore:', error);
    return null;
  }
}

// Save company
export async function saveCompanyToFirestore(company: CompanyInfo): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.COMPANY, 'default'), company);
  } catch (error) {
    console.error('Error saving company to Firestore:', error);
  }
}
