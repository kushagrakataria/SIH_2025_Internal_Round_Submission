import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  digitalId: string;
  createdAt: string;
  lastLoginAt: string;
  emergencyContacts?: EmergencyContact[];
  preferences?: UserPreferences;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface UserPreferences {
  language: string;
  notifications: {
    emergencyAlerts: boolean;
    tripReminders: boolean;
    safetyUpdates: boolean;
  };
  privacy: {
    shareLocation: boolean;
    publicProfile: boolean;
  };
}

class AuthService {
  constructor() {
    console.log('AuthService initialized');
  }

  // Sign up with email and password
  async signUp(email: string, password: string, userData: Partial<UserProfile>) {
    console.log('AuthService.signUp called with:', { email, userData: { ...userData, password: '[REDACTED]' } });
    
    try {
      console.log('Creating user with Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✓ User created successfully:', user.uid);
      
      // Update user display name
      if (userData.name) {
        console.log('Updating user display name...');
        await updateProfile(user, { displayName: userData.name });
        console.log('✓ Display name updated');
      }
      
      // Create user profile in Firestore
      console.log('Creating user profile in Firestore...');
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: userData.name || '',
        phone: userData.phone || '',
        digitalId: `TST${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emergencyContacts: [],
        preferences: {
          language: 'en',
          notifications: {
            emergencyAlerts: true,
            tripReminders: true,
            safetyUpdates: true
          },
          privacy: {
            shareLocation: true,
            publicProfile: false
          }
        }
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('✓ User profile created in Firestore');
      
      return { user, profile: userProfile };
    } catch (error: any) {
      console.error('❌ Error in signUp:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Import and use diagnostic helper
      if (import.meta.env.DEV) {
        try {
          const { DevAuthHelper } = await import('../dev-auth-helper');
          DevAuthHelper.diagnoseAuthError(error);
        } catch (e) {
          console.log('Could not load diagnostic helper');
        }
      }
      
      throw error;
    }
  }
  
  // Sign in with email and password
  async signIn(email: string, password: string) {
    console.log('AuthService.signIn called with:', { email, password: '[REDACTED]' });
    
    try {
      console.log('Signing in with Firebase Auth...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✓ User signed in successfully:', user.uid);
      
      // Update last login time
      console.log('Updating last login time...');
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString()
      });
      console.log('✓ Last login time updated');
      
      return user;
    } catch (error: any) {
      console.error('❌ Error in signIn:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Import and use diagnostic helper  
      if (import.meta.env.DEV) {
        try {
          const { DevAuthHelper } = await import('../dev-auth-helper');
          DevAuthHelper.diagnoseAuthError(error);
        } catch (e) {
          console.log('Could not load diagnostic helper');
        }
      }
      
      throw error;
    }
  }
  
  // Sign in with Google
  async signInWithGoogle() {
    console.log('AuthService.signInWithGoogle called');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log('Opening Google sign-in popup...');
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log('✓ Google sign-in successful:', user.uid);
      
      // Check if user profile exists
      console.log('Checking if user profile exists...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.log('Creating new user profile for Google sign-in...');
        // Create new user profile for Google sign-in
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || '',
          digitalId: `TST${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emergencyContacts: [],
          preferences: {
            language: 'en',
            notifications: {
              emergencyAlerts: true,
              tripReminders: true,
              safetyUpdates: true
            },
            privacy: {
              shareLocation: true,
              publicProfile: false
            }
          }
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('✓ New user profile created');
      } else {
        console.log('Updating existing user last login time...');
        // Update last login time for existing user
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString()
        });
        console.log('✓ Last login time updated');
      }
      
      return user;
    } catch (error: any) {
      console.error('❌ Error in signInWithGoogle:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Import and use diagnostic helper
      if (import.meta.env.DEV) {
        try {
          const { DevAuthHelper } = await import('../dev-auth-helper');
          DevAuthHelper.diagnoseAuthError(error);
        } catch (e) {
          console.log('Could not load diagnostic helper');
        }
      }
      
      throw error;
    }
  }
  
  // Sign out
  async signOut() {
    console.log('AuthService.signOut called');
    
    try {
      await signOut(auth);
      console.log('✓ User signed out successfully');
    } catch (error: any) {
      console.error('❌ Error in signOut:', error);
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
  
  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  // Add emergency contact
  async addEmergencyContact(userId: string, contactData: Omit<EmergencyContact, 'id' | 'createdAt'>) {
    try {
      const userProfile = await this.getCurrentUserProfile();
      if (!userProfile) throw new Error('User profile not found');
      
      const newContact: EmergencyContact = {
        ...contactData,
        id: `contact_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedContacts = [...(userProfile.emergencyContacts || []), newContact];
      
      await updateDoc(doc(db, 'users', userId), {
        emergencyContacts: updatedContacts,
        updatedAt: new Date().toISOString()
      });
      
      return newContact;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  }
  
  // Remove emergency contact
  async removeEmergencyContact(userId: string, contactId: string) {
    try {
      const userProfile = await this.getCurrentUserProfile();
      if (!userProfile) throw new Error('User profile not found');
      
      const updatedContacts = (userProfile.emergencyContacts || []).filter(
        contact => contact.id !== contactId
      );
      
      await updateDoc(doc(db, 'users', userId), {
        emergencyContacts: updatedContacts,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing emergency contact:', error);
      throw error;
    }
  }
  
  // Update user preferences
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    try {
      const userProfile = await this.getCurrentUserProfile();
      if (!userProfile) throw new Error('User profile not found');
      
      const updatedPreferences = {
        ...userProfile.preferences,
        ...preferences
      };
      
      await updateDoc(doc(db, 'users', userId), {
        preferences: updatedPreferences,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
  
  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
  
  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}

export default new AuthService();