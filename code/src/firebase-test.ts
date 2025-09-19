// Firebase Connection Test
import { auth, db } from './lib/firebase';

console.log('=== Firebase Connection Test ===');
console.log('Auth instance:', auth);
console.log('Firestore instance:', db);

// Test Firebase initialization
(window as any).testFirebase = () => {
  console.log('Testing Firebase connection...');
  
  try {
    console.log('✓ Firebase Auth available:', !!auth);
    console.log('✓ Firebase Firestore available:', !!db);
    console.log('Current user:', auth.currentUser);
    console.log('Auth app:', auth.app);
    
    return { success: true, auth: !!auth, firestore: !!db };
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return { success: false, error };
  }
};

console.log('Firebase test function added to window.testFirebase()');