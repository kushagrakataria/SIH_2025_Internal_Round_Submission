import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import authService, { UserProfile } from '@/services/authService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
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

  console.log('🔵 AuthProvider initialized');

  // Refresh user profile from Firestore
  const refreshProfile = async () => {
    if (currentUser) {
      try {
        const profile = await authService.getCurrentUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (currentUser && userProfile) {
      try {
        await authService.updateUserProfile(currentUser.uid, updates);
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    console.log('🔵 Setting up auth state listener...');
    
    // Set a timeout to ensure loading doesn't stay true forever
    const loadingTimeout = setTimeout(() => {
      console.log('⚠️ Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout
    
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      console.log('🔵 Auth state changed:', user ? 'User logged in' : 'User logged out');
      clearTimeout(loadingTimeout); // Clear timeout since auth state changed
      setCurrentUser(user);
      
      if (user) {
        console.log('🔵 User found, fetching profile...');
        try {
          const profile = await authService.getCurrentUserProfile();
          console.log('✅ Profile fetched successfully:', profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signUp: authService.signUp.bind(authService),
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="mobile-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading Safe Traveler...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};