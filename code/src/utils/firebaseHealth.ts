import { auth, db } from '../lib/firebase';
import { doc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';

export interface FirebaseStatus {
  auth: {
    available: boolean;
    error?: string;
  };
  firestore: {
    available: boolean;
    error?: string;
  };
  overall: boolean;
}

export class FirebaseHealthChecker {
  async checkAuthHealth(): Promise<{ available: boolean; error?: string }> {
    try {
      console.log('🔍 Testing Firebase Auth...');
      
      // Test anonymous sign-in to verify auth works
      const credential = await signInAnonymously(auth);
      console.log('✅ Firebase Auth test successful');
      
      // Clean up test user
      await signOut(auth);
      
      return { available: true };
    } catch (error: any) {
      console.error('❌ Firebase Auth test failed:', error);
      return { 
        available: false, 
        error: `Auth error: ${error.code || error.message}` 
      };
    }
  }

  async checkFirestoreHealth(): Promise<{ available: boolean; error?: string }> {
    try {
      console.log('🔍 Testing Firestore connectivity...');
      
      // First try to enable network
      await enableNetwork(db);
      
      // Try to read a simple document
      const testDoc = doc(db, 'health-check', 'test');
      await getDoc(testDoc);
      
      console.log('✅ Firestore connectivity test successful');
      return { available: true };
    } catch (error: any) {
      console.error('❌ Firestore connectivity test failed:', error);
      return { 
        available: false, 
        error: `Firestore error: ${error.code || error.message}` 
      };
    }
  }

  async checkOverallHealth(): Promise<FirebaseStatus> {
    console.log('🔍 Running comprehensive Firebase health check...');
    
    const authStatus = await this.checkAuthHealth();
    const firestoreStatus = await this.checkFirestoreHealth();
    
    const status: FirebaseStatus = {
      auth: authStatus,
      firestore: firestoreStatus,
      overall: authStatus.available && firestoreStatus.available
    };

    console.log('📊 Firebase Health Check Results:', status);
    
    return status;
  }

  // Network recovery attempt
  async attemptNetworkRecovery(): Promise<boolean> {
    try {
      console.log('🔄 Attempting network recovery...');
      
      // Disable and re-enable network
      await disableNetwork(db);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await enableNetwork(db);
      
      // Test connectivity again
      const firestoreStatus = await this.checkFirestoreHealth();
      
      console.log('🔄 Network recovery result:', firestoreStatus.available ? 'Success' : 'Failed');
      return firestoreStatus.available;
    } catch (error) {
      console.error('❌ Network recovery failed:', error);
      return false;
    }
  }
}

export const firebaseHealthChecker = new FirebaseHealthChecker();
export default firebaseHealthChecker;