import { auth, db } from './lib/firebase';

// Development mode authentication helper
export class DevAuthHelper {
  static isDevelopment = import.meta.env.DEV;
  
  static async testFirebaseConnection() {
    console.log('🔧 Testing Firebase connection...');
    
    try {
      // Test Firebase Auth
      console.log('Testing Firebase Auth...');
      console.log('Auth instance:', auth);
      console.log('Auth app name:', auth.app.name);
      console.log('Auth config:', auth.config);
      
      // Test Firestore
      console.log('Testing Firestore...');
      console.log('Firestore instance:', db);
      console.log('Firestore app:', db.app.name);
      
      return { success: true, auth: true, firestore: true };
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return { success: false, error };
    }
  }
  
  static async diagnoseAuthError(error: any) {
    console.group('🔍 Authentication Error Diagnosis');
    console.log('Error object:', error);
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    // Common Firebase Auth errors
    const commonErrors = {
      'auth/api-key-not-valid': 'Invalid API key in Firebase config',
      'auth/invalid-api-key': 'Invalid API key format',
      'auth/app-not-authorized': 'App not authorized for this Firebase project',
      'auth/network-request-failed': 'Network connectivity issue',
      'auth/too-many-requests': 'Too many failed authentication attempts',
      'auth/popup-blocked': 'Browser blocked the authentication popup',
      'auth/popup-closed-by-user': 'User closed the authentication popup',
      'auth/unauthorized-domain': 'Domain not authorized in Firebase Console'
    };
    
    if (commonErrors[error.code as keyof typeof commonErrors]) {
      console.log('🎯 Likely cause:', commonErrors[error.code as keyof typeof commonErrors]);
    }
    
    // Environment checks
    console.log('Environment variables:');
    console.log('- API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('- Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
    console.log('- Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
    
    console.groupEnd();
  }
  
  static getTestCredentials() {
    return {
      email: 'test@safetravel.com',
      password: 'testpass123'
    };
  }
}

// Add to window for console debugging
(window as any).DevAuthHelper = DevAuthHelper;

// Auto-run connection test
DevAuthHelper.testFirebaseConnection();

console.log('🔧 DevAuthHelper loaded. Use DevAuthHelper.testFirebaseConnection() to test Firebase.');