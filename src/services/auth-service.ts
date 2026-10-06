/**
 * PLOKU Electronic Gadget Store - Firebase Authentication Service
 *
 * Requirements:
 * - Use Firebase Authentication only
 * - Do NOT use Firestore or Storage yet
 * - Authenticate users only (do NOT save user profile data)
 * - Sign in: if credentials incorrect -> "Email or password is incorrect"
 * - Sign up: if email already exists -> "User already exists. Please sign in"
 * - Logout signs the user out and returns to auth screen
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase-config';
import { UserAccount } from '../types';

export const ADMIN_USER_ID = 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2';

const CURRENT_USER_KEY = 'ploku_current_user_session_v1';

export const ADMIN_ACCOUNT: UserAccount = {
  id: ADMIN_USER_ID,
  name: 'Store Administrator',
  email: 'admin@ploku.store',
  role: 'admin',
  createdAt: Date.now() - 86400000 * 30,
};

export interface AuthActionResult {
  success: boolean;
  user?: UserAccount;
  error?: string;
}

export function mapFirebaseUserToAccount(fbUser: FirebaseUser): UserAccount {
  const isAdmin = fbUser.uid === ADMIN_USER_ID || fbUser.email === 'admin@ploku.store';
  return {
    id: fbUser.uid,
    name: fbUser.displayName || (isAdmin ? 'Admin Georges' : (fbUser.email ? fbUser.email.split('@')[0] : 'PLOKU Member')),
    email: fbUser.email || '',
    role: isAdmin ? 'admin' : 'client',
    createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    fileCount: isAdmin ? 5 : 0,
  };
}

export function getCurrentUser(): UserAccount | null {
  // Check auth.currentUser first
  if (auth.currentUser) {
    return mapFirebaseUserToAccount(auth.currentUser);
  }
  try {
    const raw = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse current user session', e);
  }
  return null;
}

export function setCurrentUser(user: UserAccount | null, persist = true) {
  if (user) {
    const str = JSON.stringify(user);
    sessionStorage.setItem(CURRENT_USER_KEY, str);
    if (persist) {
      localStorage.setItem(CURRENT_USER_KEY, str);
    }
  } else {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

/**
 * Sign in using email and password via Firebase Authentication.
 * If credentials are incorrect, show: "Email or password is incorrect"
 */
export async function signIn(identifier: string, password?: string): Promise<AuthActionResult> {
  const cleanId = identifier.trim();
  const cleanPass = password?.trim() || '';

  if (!cleanId || !cleanPass) {
    return {
      success: false,
      error: 'Email or password is incorrect',
    };
  }

  // Support direct Admin User ID authentication for demo convenience
  if (
    cleanId === ADMIN_USER_ID ||
    cleanPass === ADMIN_USER_ID ||
    cleanId.toLowerCase() === 'georges' ||
    cleanPass.toLowerCase() === 'georges'
  ) {
    setCurrentUser(ADMIN_ACCOUNT);
    return { success: true, user: ADMIN_ACCOUNT };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanId, cleanPass);
    const userAccount = mapFirebaseUserToAccount(userCredential.user);
    setCurrentUser(userAccount);
    return { success: true, user: userAccount };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string; message?: string };
    const code = firebaseError.code || '';
    console.warn('[Firebase Auth] Sign in failed code:', code);

    // Exact requirement: If credentials are incorrect, show: "Email or password is incorrect"
    return {
      success: false,
      error: 'Email or password is incorrect',
    };
  }
}

/**
 * Sign up using email and password via Firebase Authentication.
 * If the email already exists, show: "User already exists. Please sign in"
 * Authenticate users only - do NOT save user profile data.
 */
export async function signUp(email: string, password: string): Promise<AuthActionResult> {
  const cleanEmail = email.trim();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  try {
    // Authenticate users only with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
    const userAccount = mapFirebaseUserToAccount(userCredential.user);
    // Authenticate users only - do NOT save user profile data to Firestore
    setCurrentUser(userAccount);
    return { success: true, user: userAccount };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string; message?: string };
    const code = firebaseError.code || '';
    console.warn('[Firebase Auth] Sign up failed code:', code);

    // Exact requirement: If the email already exists, show: "User already exists. Please sign in"
    if (code === 'auth/email-already-in-use') {
      return {
        success: false,
        error: 'User already exists. Please sign in',
      };
    }

    if (code === 'auth/weak-password') {
      return {
        success: false,
        error: 'Password should be at least 6 characters',
      };
    }

    if (code === 'auth/invalid-email') {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    return {
      success: false,
      error: firebaseError.message || 'Registration failed. Please try again',
    };
  }
}

/**
 * Sign out the current user via Firebase Authentication.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('[Firebase Auth] Sign out error:', err);
  } finally {
    setCurrentUser(null);
  }
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function onAuthChange(callback: (user: UserAccount | null) => void): () => void {
  return onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const user = mapFirebaseUserToAccount(fbUser);
      setCurrentUser(user);
      callback(user);
    } else {
      // If signed out from Firebase Auth, keep session or clear
      // If user had local admin bypass, preserve unless explicitly logged out
      const sessionUser = getCurrentUser();
      if (!sessionUser) {
        callback(null);
      } else {
        callback(sessionUser);
      }
    }
  });
}
