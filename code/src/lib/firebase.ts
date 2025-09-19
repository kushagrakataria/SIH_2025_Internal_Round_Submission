import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableNetwork, 
  disableNetwork,
  enableIndexedDbPersistence 
} from 'firebase/firestore';

// Debug Firebase environment variables
console.log('🔧 Firebase Environment Variables:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration fields:', missingFields);
  throw new Error(`Firebase configuration incomplete. Missing: ${missingFields.join(', ')}`);
}

// Initialize Firebase
console.log('🔧 Initializing Firebase...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

// Initialize Firebase services
const auth = getAuth(app);
console.log('✅ Firebase Auth initialized');

const db = getFirestore(app);
console.log('✅ Firestore initialized');

// Initialize persistence asynchronously
const initializeFirestorePersistence = async () => {
  try {
    // Enable offline persistence first
    try {
      await enableIndexedDbPersistence(db, { forceOwnership: false });
      console.log('✅ Firestore offline persistence enabled');
    } catch (persistenceError: any) {
      if (persistenceError.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time');
      } else if (persistenceError.code === 'unimplemented') {
        console.warn('⚠️ Browser doesn\'t support persistence');
      } else {
        console.warn('⚠️ Persistence setup failed:', persistenceError);
      }
    }

    // Enable offline persistence and handle network connectivity issues
    try {
      // Ensure network is enabled for Firestore
      await enableNetwork(db);
      console.log('✅ Firestore network enabled');
    } catch (networkError) {
      console.warn('⚠️ Firestore network error (continuing anyway):', networkError);
    }
  } catch (error) {
    console.error('❌ Firestore persistence initialization failed:', error);
  }
};

// Initialize persistence in the background
initializeFirestorePersistence();

export { auth, db };
export default app;