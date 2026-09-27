/**
 * Capacity Connect - Authentication & Identity Context
 * Integrated with Firebase Authentication, Cloud Firestore profile persistence,
 * and realistic Indian administrative demo accounts.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { auth, db, googleProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, requestedRole?: Role) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (role: Role, userKey?: string) => void;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'trainee' | 'trainer';
    state: string;
    district: string;
    city?: string;
    organization?: string;
    department?: string;
    designation?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  updateProfileData: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'capacity_connect_auth_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously initialize user from cached storage to prevent flash of unauthenticated state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.role) {
          return parsed;
        }
      }
    } catch {
      return null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveUserSession = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } catch (err) {
        console.error('Failed to cache user session:', err);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error('Failed to remove cached session:', err);
      }
    }
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Fetch persistent Firestore profile
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const profileData = docSnap.data() as User;
            const fullUser: User = {
              ...profileData,
              id: firebaseUser.uid,
              email: firebaseUser.email || profileData.email,
            };
            saveUserSession(fullUser);
          } else {
            // First-time social sign-in without existing profile
            const fallbackProfile: User = {
              id: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'Officer Participant',
              email: firebaseUser.email || 'officer@capacityconnect.gov.in',
              role: 'trainee',
              status: 'active',
              state: 'Delhi (NCT)',
              district: 'New Delhi',
              city: 'New Delhi',
              organization: 'National E-Governance Division',
              department: 'Operations',
              designation: 'Trainee Officer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, fallbackProfile);
            saveUserSession(fallbackProfile);
          }
        } catch (err) {
          console.warn('Error fetching Firestore user profile on auth change:', err);
          // Fall back to cached session or minimal user
          if (!user || user.id !== firebaseUser.uid) {
            const fallbackUser: User = {
              id: firebaseUser.uid,
              fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'trainee',
              status: 'active',
              createdAt: new Date().toISOString(),
            };
            saveUserSession(fallbackUser);
          }
        }
      } else {
        // If not in Firebase Auth, check if current user is an active demo account
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.isDemoAccount) {
              setUser(parsed);
              setIsLoading(false);
              return;
            }
          } catch {
            // Ignore
          }
        }
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email & Password Login
  const login = async (
    email: string,
    password: string,
    requestedRole?: Role
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check for Demo Account credentials first for instant seamless offline testing
    const matchedDemoUser = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (matchedDemoUser) {
      // Validate requested role if provided
      if (requestedRole && requestedRole !== matchedDemoUser.role) {
        setIsLoading(false);
        return {
          success: false,
          error: `The account ${normalizedEmail} is registered as a ${matchedDemoUser.role.toUpperCase()}, not ${requestedRole.toUpperCase()}. Please select the correct portal role.`,
        };
      }
      saveUserSession(matchedDemoUser);
      setIsLoading(false);
      return { success: true };
    }

    // 2. Real Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const fbUser = userCredential.user;

      // Retrieve user profile from Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const profile = docSnap.data() as User;
        const loggedUser: User = {
          ...profile,
          id: fbUser.uid,
          email: fbUser.email || profile.email,
        };
        saveUserSession(loggedUser);
      } else {
        // Construct default profile if doc missing
        const newProfile: User = {
          id: fbUser.uid,
          fullName: fbUser.displayName || normalizedEmail.split('@')[0],
          email: fbUser.email || normalizedEmail,
          role: requestedRole || 'trainee',
          status: 'active',
          state: 'Telangana',
          district: 'Hyderabad',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        saveUserSession(newProfile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      let errorMessage = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No user account found matching this email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  // Direct one-click demo login
  const demoLogin = (role: Role, userKey?: string) => {
    let demoUser = DEMO_USERS[role];
    if (userKey && DEMO_USERS[userKey]) {
      demoUser = DEMO_USERS[userKey];
    }
    if (demoUser) {
      saveUserSession(demoUser);
    }
  };

  // Real Firebase Signup Flow with voluntary administrative location
  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'trainee' | 'trainer';
    state: string;
    district: string;
    city?: string;
    organization?: string;
    department?: string;
    designation?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Validation
    const name = data.fullName.trim();
    const email = data.email.trim().toLowerCase();

    if (!name || name.length < 2) {
      setIsLoading(false);
      return { success: false, error: 'Full name must contain at least 2 characters.' };
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setIsLoading(false);
      return { success: false, error: 'Please provide a valid official email address.' };
    }

    if (!data.password || data.password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return { success: false, error: 'Passwords do not match. Please re-enter.' };
    }

    if (!data.state || !data.district) {
      setIsLoading(false);
      return { success: false, error: 'Please select your official administrative State and District.' };
    }

    // Role safety: self-assigning 'admin' is strictly forbidden
    if ((data.role as string) === 'admin') {
      setIsLoading(false);
      return { success: false, error: 'Administrator accounts cannot be self-registered.' };
    }

    try {
      // 1. Create account in Firebase Authentication
      const cred = await createUserWithEmailAndPassword(auth, email, data.password);
      const uid = cred.user.uid;

      // 2. Create persistent profile document in Cloud Firestore
      const newUserProfile: User = {
        id: uid,
        fullName: name,
        email,
        role: data.role,
        status: data.role === 'trainer' ? 'pending' : 'active',
        state: data.state,
        district: data.district,
        city: data.city?.trim() || '',
        organization: data.organization?.trim() || 'Public Service Department',
        department: data.department?.trim() || 'Operations & Capacity',
        designation: data.designation?.trim() || (data.role === 'trainer' ? 'Faculty Instructor' : 'Trainee Officer'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDemoAccount: false,
      };

      await setDoc(doc(db, 'users', uid), newUserProfile);
      saveUserSession(newUserProfile);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      let errorMsg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'An account is already registered with this email address. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'The chosen password is too weak. Please use at least 6 characters.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  // Real Password Reset via Firebase Authentication
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return { success: false, error: 'Please provide a valid registered email address.' };
    }

    // Demo account handling: explain password policy for demo credentials
    if (normalized.endsWith('@capacityconnect.demo')) {
      return {
        success: true,
        error: undefined,
      };
    }

    try {
      await sendPasswordResetEmail(auth, normalized);
      return { success: true };
    } catch (err: any) {
      let msg = 'Failed to initiate password reset.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No registered account found with that email address.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, error: msg };
    }
  };

  // Google Sign-In with Firebase Popup
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Check for Firestore profile
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const profile = docSnap.data() as User;
        const loggedUser: User = {
          ...profile,
          id: fbUser.uid,
          email: fbUser.email || profile.email,
        };
        saveUserSession(loggedUser);
      } else {
        // Create initial Google profile
        const newProfile: User = {
          id: fbUser.uid,
          fullName: fbUser.displayName || 'Google Authenticated User',
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || undefined,
          role: 'trainee',
          status: 'active',
          state: 'Telangana',
          district: 'Hyderabad',
          city: 'Hyderabad',
          organization: 'Public Sector Participant',
          department: 'Capacity Directorate',
          designation: 'Officer Trainee',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDemoAccount: false,
        };
        await setDoc(userDocRef, newProfile);
        saveUserSession(newProfile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in popup was closed before completion.' };
      }
      return { success: false, error: err.message || 'Google authentication failed.' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Error signing out of Firebase:', err);
    }
    saveUserSession(null);
  };

  // Switch role (available for demo users and admin testing)
  const switchRole = (newRole: Role) => {
    if (!user) return;
    const updated: User = {
      ...user,
      role: newRole,
    };
    saveUserSession(updated);
  };

  // Update profile
  const updateProfileData = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveUserSession(updatedUser);

    if (!user.isDemoAccount) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Error updating Firestore user doc:', e);
      }
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        demoLogin,
        signup,
        logout,
        switchRole,
        resetPassword,
        loginWithGoogle,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
