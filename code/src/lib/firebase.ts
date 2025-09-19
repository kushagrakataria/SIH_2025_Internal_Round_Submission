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

let app;
let auth;
let db;

try {
  // Initialize Firebase
  console.log('🔧 Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');

  // Initialize Firebase services
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
  
  db = getFirestore(app);
  
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
  
  console.log('✅ Firestore initialized');

} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // Create fallback objects to prevent app crashes
  console.warn('⚠️ Creating fallback Firebase objects');
  throw error;
}

export { auth, db };
export default app;