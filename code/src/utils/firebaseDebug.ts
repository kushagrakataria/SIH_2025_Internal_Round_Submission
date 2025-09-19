import { auth, db } from '../lib/firebase';
import { enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';

export const firebaseDebugUtils = {
  // Test Firebase connection
  async testConnection() {
    console.log('🔍 Testing Firebase connection...');
    
    try {
      // Test auth connection
      console.log('🔐 Current auth user:', auth.currentUser?.uid || 'Not authenticated');
      
      // Test Firestore connection
      try {
        await enableNetwork(db);
        console.log('✅ Firestore network enabled successfully');
      } catch (error) {
        console.error('❌ Firestore network enable failed:', error);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return false;
    }
  },

  // Check environment variables
  checkEnvironment() {
    console.log('🔍 Checking Firebase environment...');
    
    const envVars = {
      'VITE_FIREBASE_API_KEY': import.meta.env.VITE_FIREBASE_API_KEY,
      'VITE_FIREBASE_AUTH_DOMAIN': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      'VITE_FIREBASE_PROJECT_ID': import.meta.env.VITE_FIREBASE_PROJECT_ID,
      'VITE_FIREBASE_STORAGE_BUCKET': import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      'VITE_FIREBASE_MESSAGING_SENDER_ID': import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      'VITE_FIREBASE_APP_ID': import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const missing = Object.entries(envVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing);
      return false;
    }

    console.log('✅ All Firebase environment variables present');
    return true;
  },

  // Force enable network
  async forceEnableNetwork() {
    try {
      console.log('🔧 Force enabling Firestore network...');
      await enableNetwork(db);
      console.log('✅ Firestore network force-enabled');
      return true;
    } catch (error) {
      console.error('❌ Failed to force enable network:', error);
      return false;
    }
  },

  // Get Firebase project info
  getProjectInfo() {
    return {
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      currentUser: auth.currentUser?.uid || null,
      isAuthenticated: !!auth.currentUser
    };
  }
};

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  firebaseDebugUtils.checkEnvironment();
  firebaseDebugUtils.testConnection();
}