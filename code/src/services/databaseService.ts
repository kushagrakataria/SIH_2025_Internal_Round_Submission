import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  GeoPoint,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interfaces
export interface TripData {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'planned';
  destinations: TripDestination[];
  currentDestination?: number;
  safetyCheckInterval?: number; // minutes
  emergencyContacts?: string[]; // contact IDs
  createdAt?: any;
  updatedAt?: any;
}

export interface TripDestination {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
  isCompleted: boolean;
}

export interface EmergencyIncident {
  id?: string;
  userId: string;
  digitalId: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  timestamp: string;
  type: 'SOS_BUTTON' | 'AUTO_DETECT' | 'GEOFENCE_VIOLATION' | 'PANIC_BUTTON';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'cancelled';
  description?: string;
  notifiedContacts: string[];
  responseTime?: number; // seconds
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt?: any;
}

export interface SafetyAlert {
  id?: string;
  type: 'weather' | 'crime' | 'health' | 'traffic' | 'security' | 'general';
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
    radius?: number; // meters
  };
  affectedAreas?: string[];
  validFrom: string;
  validUntil?: string;
  source: string;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface CheckIn {
  id?: string;
  userId: string;
  tripId?: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  timestamp: string;
  type: 'manual' | 'automatic' | 'scheduled';
  status: 'safe' | 'emergency' | 'delayed';
  message?: string;
  createdAt?: any;
}

class DatabaseService {
  // Trip Management
  async createTrip(tripData: Omit<TripData, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  async updateTrip(tripId: string, updates: Partial<TripData>) {
    try {
      await updateDoc(doc(db, 'trips', tripId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  async deleteTrip(tripId: string) {
    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  async getTrip(tripId: string): Promise<TripData | null> {
    try {
      const tripDoc = await getDoc(doc(db, 'trips', tripId));
      return tripDoc.exists() ? { id: tripDoc.id, ...tripDoc.data() } as TripData : null;
    } catch (error) {
      console.error('Error getting trip:', error);
      throw error;
    }
  }

  async getUserTrips(userId: string): Promise<TripData[]> {
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TripData[];
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw error;
    }
  }

  async getActiveTrips(userId: string): Promise<TripData[]> {
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('startDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TripData[];
    } catch (error) {
      console.error('Error getting active trips:', error);
      throw error;
    }
  }

  // Emergency Incidents
  async createEmergencyIncident(incidentData: Omit<EmergencyIncident, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'emergencyIncidents'), {
        ...incidentData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating emergency incident:', error);
      throw error;
    }
  }

  async updateEmergencyIncident(incidentId: string, updates: Partial<EmergencyIncident>) {
    try {
      await updateDoc(doc(db, 'emergencyIncidents', incidentId), updates);
    } catch (error) {
      console.error('Error updating emergency incident:', error);
      throw error;
    }
  }

  async getEmergencyIncident(incidentId: string): Promise<EmergencyIncident | null> {
    try {
      const incidentDoc = await getDoc(doc(db, 'emergencyIncidents', incidentId));
      return incidentDoc.exists() ? { id: incidentDoc.id, ...incidentDoc.data() } as EmergencyIncident : null;
    } catch (error) {
      console.error('Error getting emergency incident:', error);
      throw error;
    }
  }

  async getUserEmergencyIncidents(userId: string, limitCount: number = 50): Promise<EmergencyIncident[]> {
    try {
      const q = query(
        collection(db, 'emergencyIncidents'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EmergencyIncident[];
    } catch (error) {
      console.error('Error getting emergency incidents:', error);
      throw error;
    }
  }

  async getActiveEmergencyIncidents(userId: string): Promise<EmergencyIncident[]> {
    try {
      const q = query(
        collection(db, 'emergencyIncidents'),
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EmergencyIncident[];
    } catch (error) {
      console.error('Error getting active emergency incidents:', error);
      throw error;
    }
  }

  // Safety Alerts
  async createSafetyAlert(alertData: Omit<SafetyAlert, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'alerts'), {
        ...alertData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating safety alert:', error);
      throw error;
    }
  }

  async updateSafetyAlert(alertId: string, updates: Partial<SafetyAlert>) {
    try {
      await updateDoc(doc(db, 'alerts', alertId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating safety alert:', error);
      throw error;
    }
  }

  async getSafetyAlerts(limitCount: number = 50): Promise<SafetyAlert[]> {
    try {
      const q = query(
        collection(db, 'alerts'),
        where('isActive', '==', true),
        orderBy('severity', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SafetyAlert[];
    } catch (error) {
      console.error('Error getting safety alerts:', error);
      throw error;
    }
  }

  async getSafetyAlertsByLocation(lat: number, lng: number, radiusKm: number = 50): Promise<SafetyAlert[]> {
    try {
      // Note: This is a simplified version. For production, you'd want to use 
      // geospatial queries with GeoFirestore or similar
      const q = query(
        collection(db, 'alerts'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      
      const alerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SafetyAlert[];

      // Filter by location if specified
      return alerts.filter(alert => {
        if (!alert.location) return true;
        
        const distance = this.calculateDistance(
          lat, lng, 
          alert.location.lat, alert.location.lng
        );
        
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error getting safety alerts by location:', error);
      throw error;
    }
  }

  // Check-ins
  async createCheckIn(checkInData: Omit<CheckIn, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'checkIns'), {
        ...checkInData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  }

  async getUserCheckIns(userId: string, limitCount: number = 50): Promise<CheckIn[]> {
    try {
      const q = query(
        collection(db, 'checkIns'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CheckIn[];
    } catch (error) {
      console.error('Error getting user check-ins:', error);
      throw error;
    }
  }

  async getTripCheckIns(tripId: string): Promise<CheckIn[]> {
    try {
      const q = query(
        collection(db, 'checkIns'),
        where('tripId', '==', tripId),
        orderBy('timestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CheckIn[];
    } catch (error) {
      console.error('Error getting trip check-ins:', error);
      throw error;
    }
  }

  // Utility Functions
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Batch Operations
  async batchCreateAlerts(alerts: Omit<SafetyAlert, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const promises = alerts.map(alert => this.createSafetyAlert(alert));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error batch creating alerts:', error);
      throw error;
    }
  }

  // Analytics & Stats
  async getUserStats(userId: string) {
    try {
      const [trips, incidents, checkIns] = await Promise.all([
        this.getUserTrips(userId),
        this.getUserEmergencyIncidents(userId),
        this.getUserCheckIns(userId)
      ]);

      return {
        totalTrips: trips.length,
        activeTrips: trips.filter(t => t.status === 'active').length,
        completedTrips: trips.filter(t => t.status === 'completed').length,
        totalIncidents: incidents.length,
        activeIncidents: incidents.filter(i => i.status === 'active').length,
        totalCheckIns: checkIns.length,
        safeCheckIns: checkIns.filter(c => c.status === 'safe').length,
        lastCheckIn: checkIns[0] || null
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
}

export default new DatabaseService();