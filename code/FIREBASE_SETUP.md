# Firebase Integration Guide for Safe Traveler Buddy

This guide provides step-by-step instructions to integrate Firebase into your Safe Traveler Buddy app for backend services, real-time database, authentication, and cloud functions.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google account
- Safe Traveler Buddy app already set up

## 🚀 Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. **Go to Firebase Console**
   ```
   https://console.firebase.google.com/
   ```

2. **Create New Project**
   - Click "Add project"
   - Enter project name: `safe-traveler-buddy`
   - Choose whether to enable Google Analytics (recommended)
   - Select Analytics account if enabled
   - Click "Create project"

3. **Wait for Project Creation**
   - Firebase will set up your project (takes 1-2 minutes)

### 1.2 Enable Required Services

1. **Authentication**
   - Go to "Authentication" in left sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable the following providers:
     - ✅ Email/Password
     - ✅ Google
     - ✅ Phone (for emergency contacts)

2. **Firestore Database**
   - Go to "Firestore Database" in left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select location closest to your users
   - Click "Done"

3. **Cloud Functions** (Optional for advanced features)
   - Go to "Functions" in left sidebar
   - Click "Get started"
   - Choose your preferred region

> **Note**: Cloud Storage is not used in this setup since we're focusing on authentication and Firestore database only.

## 🔧 Step 2: Install Firebase SDK

### 2.1 Install Dependencies

```bash
cd safe-traveler-buddy-main
npm install firebase
npm install -D firebase-tools
```

### 2.2 Install Firebase CLI (Global)

```bash
npm install -g firebase-tools
```

### 2.3 Login to Firebase

```bash
firebase login
```

## 🔑 Step 3: Get Firebase Configuration

### 3.1 Get Config Keys

1. **Go to Project Settings**
   - Click gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps" section
   - Click "Web" icon `</>`
   - Enter app nickname: `safe-traveler-web`
   - ✅ Check "Also set up Firebase Hosting"
   - Click "Register app"

3. **Copy Configuration**
   - Copy the firebaseConfig object
   - Keep this tab open for next step

### 3.2 Update Environment Variables

1. **Update `.env` file**
   ```env
   # Google Maps API Key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Backend API URL
   VITE_API_URL=http://localhost:3001
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## 🏗️ Step 4: Firebase Setup Files

### 4.1 Create Firebase Configuration

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
```

### 4.2 Initialize Firebase in Project

```bash
firebase init
```

**Select the following options:**
- ✅ Firestore: Configure security rules and indexes
- ✅ Functions: Configure cloud functions
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Storage: Configure a security rules file for Cloud Storage

**Configuration choices:**
- Use existing project: Select your `safe-traveler-buddy` project
- Firestore rules file: `firestore.rules` (default)
- Firestore indexes file: `firestore.indexes.json` (default)
- Functions language: TypeScript
- ESLint: Yes
- Dependencies: Yes
- Public directory: `dist`
- Single-page app: Yes
- GitHub auto-deploys: No (for now)

## 📊 Step 5: Firestore Database Structure

### 5.1 Create Database Collections

Create the following collections in Firestore Console:

```
safe-traveler-buddy/
├── users/
│   └── {userId}/
│       ├── profile: UserProfile
│       ├── trips: Trip[]
│       ├── emergencyContacts: EmergencyContact[]
│       └── preferences: UserPreferences
├── trips/
│   └── {tripId}/
│       ├── itinerary: TripItinerary
│       ├── checkpoints: Checkpoint[]
│       └── incidents: Incident[]
├── alerts/
│   └── {alertId}/
│       ├── alertData: SafetyAlert
│       └── recipients: string[]
├── emergencyIncidents/
│   └── {incidentId}/
│       ├── incidentData: EmergencyIncident
│       ├── location: GeoPoint
│       └── blockchain: BlockchainRecord
└── geoZones/
    └── {zoneId}/
        ├── boundaries: GeoPoint[]
        ├── riskLevel: string
        └── alerts: Alert[]
```

### 5.2 Create Firestore Security Rules

Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading user profiles for emergency contacts
      match /profile {
        allow read: if request.auth != null;
      }
    }
    
    // Trips - users can manage their own trips
    match /trips/{tripId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Public read access for safety zones
    match /geoZones/{zoneId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins via Cloud Functions
    }
    
    // Alerts - users can read alerts in their area
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if false; // Only system generated
    }
    
    // Emergency incidents - write access for authenticated users
    match /emergencyIncidents/{incidentId} {
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid in resource.data.emergencyContacts);
    }
  }
}
```

## 🔐 Step 6: Authentication Integration

### 6.1 Create Auth Service

Create `src/services/authService.ts`:

```typescript
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  digitalId: string;
  createdAt: string;
  lastLoginAt: string;
}

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, userData: Partial<UserProfile>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: userData.name || '',
        phone: userData.phone || '',
        digitalId: `TST${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      return { user, profile: userProfile };
    } catch (error) {
      throw error;
    }
  }
  
  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login time
      await setDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString()
      }, { merge: true });
      
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || '',
          digitalId: `TST${Date.now()}`,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
      } else {
        // Update last login time
        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }
  
  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists() ? userDoc.data() as UserProfile : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
  
  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

export default new AuthService();
```

### 6.2 Create Auth Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import authService, { UserProfile } from '@/services/authService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await authService.getCurrentUserProfile();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signUp: authService.signUp.bind(authService),
    signIn: authService.signIn.bind(authService),
    signInWithGoogle: authService.signInWithGoogle.bind(authService),
    signOut: authService.signOut.bind(authService)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

## 💾 Step 7: Database Services

### 7.1 Create Database Service

Create `src/services/databaseService.ts`:

```typescript
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TripData {
  id?: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'planned';
  destinations: any[];
  createdAt?: any;
  updatedAt?: any;
}

export interface EmergencyIncident {
  id?: string;
  userId: string;
  digitalId: string;
  location: GeoPoint;
  timestamp: string;
  type: 'SOS_BUTTON' | 'AUTO_DETECT' | 'GEOFENCE_VIOLATION';
  status: 'active' | 'resolved';
  notifiedContacts: string[];
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

  async getUserTrips(userId: string) {
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

  async getEmergencyIncidents(userId: string) {
    try {
      const q = query(
        collection(db, 'emergencyIncidents'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
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

  // User Profile Management
  async updateUserProfile(userId: string, profileData: any) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Emergency Contacts
  async addEmergencyContact(userId: string, contactData: any) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const emergencyContacts = userData.emergencyContacts || [];
        emergencyContacts.push({
          ...contactData,
          id: `contact_${Date.now()}`,
          createdAt: new Date().toISOString()
        });
        
        await updateDoc(userRef, {
          emergencyContacts,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  }

  // Safety Alerts
  async createSafetyAlert(alertData: any) {
    try {
      const docRef = await addDoc(collection(db, 'alerts'), {
        ...alertData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating safety alert:', error);
      throw error;
    }
  }

  async getSafetyAlerts(limit: number = 50) {
    try {
      const q = query(
        collection(db, 'alerts'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting safety alerts:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
```

## 🌐 Step 8: Update App Integration

### 8.1 Update App.tsx

```typescript
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Your existing routes */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
```

### 8.2 Update Emergency Service

Update `src/services/emergencyService.ts` to use Firebase:

```typescript
import { GeoPoint } from 'firebase/firestore';
import databaseService from './databaseService';
import { useAuth } from '@/contexts/AuthContext';

// Update the sendEmergencyAlert method
async sendEmergencyAlert(data: EmergencyData): Promise<boolean> {
  try {
    // Create emergency incident in Firebase
    const incidentId = await databaseService.createEmergencyIncident({
      userId: data.userId,
      digitalId: data.digitalId,
      location: new GeoPoint(data.location.lat, data.location.lng),
      timestamp: data.timestamp,
      type: data.emergencyType,
      status: 'active',
      notifiedContacts: []
    });

    // Send notifications to emergency contacts
    await this.notifyEmergencyContacts(data);

    return true;
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    return false;
  }
}
```

## 🚀 Step 9: Deploy to Firebase

### 9.1 Build for Production

```bash
npm run build
```

### 9.2 Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### 9.3 Deploy Cloud Functions (if created)

```bash
firebase deploy --only functions
```

### 9.4 Deploy Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 🔍 Step 10: Testing

### 10.1 Test Authentication

1. Open your deployed app
2. Try signing up with email/password
3. Test Google sign-in
4. Verify user data appears in Firestore Console

### 10.2 Test Database Operations

1. Create a trip in the app
2. Check Firestore Console for trip data
3. Test emergency incident creation
4. Verify real-time updates

### 10.3 Test Emergency Features

1. Trigger SOS button
2. Check emergency incidents collection
3. Verify location data storage

## 🔧 Step 11: Production Configuration

### 11.1 Update Security Rules for Production

```javascript
// More restrictive rules for production
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId &&
        request.auth.token.email_verified == true;
    }
    
    // Additional security checks...
  }
}
```

### 11.2 Enable App Check (Recommended)

1. Go to Firebase Console > App Check
2. Register your app
3. Enable reCAPTCHA v3 for web
4. Update your app with App Check SDK

### 11.3 Set up Monitoring

1. Enable Firebase Analytics
2. Set up Firebase Performance Monitoring
3. Configure Crashlytics
4. Set up alerting rules

## 📱 Step 12: Mobile App Integration (Future)

For React Native version:

```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit Firebase config to public repos
2. **Security Rules**: Test rules thoroughly before production
3. **Authentication**: Always verify users before data access
4. **Data Validation**: Validate all data on client and server
5. **Rate Limiting**: Implement rate limiting for API calls
6. **Monitoring**: Set up alerts for unusual activity

## 🆘 Troubleshooting

### Common Issues:

1. **Build Errors**: Check environment variables are set correctly
2. **Authentication Issues**: Verify Firebase project settings
3. **Permission Denied**: Check Firestore security rules
4. **Deployment Fails**: Ensure Firebase CLI is logged in

### Debug Mode:

```bash
# Enable debug mode
export FIREBASE_EMULATOR_HOST=localhost
firebase emulators:start
```

## 📊 Monitoring and Analytics

1. **Firebase Console**: Monitor app usage and performance
2. **Cloud Logging**: Set up structured logging
3. **Alerts**: Configure email/SMS alerts for critical issues
4. **Analytics**: Track user journeys and app performance

---

**🎉 Your Safe Traveler Buddy app is now fully integrated with Firebase!**

Your app now has:
- ✅ User authentication and profiles
- ✅ Real-time database for trips and incidents
- ✅ Cloud storage for user data
- ✅ Scalable backend infrastructure
- ✅ Security rules and monitoring
- ✅ Production-ready deployment