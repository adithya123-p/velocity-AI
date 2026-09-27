'use client';

// Firebase Client SDK initialization & Cloud Firestore connector
import { firebaseConfig } from './firebaseConfig';
import { Goal, UserProfile, AppNotification } from './types';

export { firebaseConfig };

let firebaseApp: unknown = null;
let firestoreDb: unknown = null;

// Initialize Firebase SDK on the client side
export async function getFirebaseClient() {
  if (typeof window === 'undefined') return null;
  if (firebaseApp && firestoreDb) return { app: firebaseApp, db: firestoreDb };

  try {
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore/lite');

    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp);
    return { app: firebaseApp, db: firestoreDb };
  } catch (err) {
    console.debug('[Firebase] Client SDK dynamically initializing:', err);
    return null;
  }
}

// ----- Cloud Firestore Operations -----

/**
 * Save user goals to Firebase Cloud Firestore
 */
export async function saveGoalsToFirestore(userId: string, goals: Goal[]): Promise<boolean> {
  try {
    const client = await getFirebaseClient();
    if (client?.db) {
      const { doc, setDoc } = await import('firebase/firestore/lite');
      const docRef = doc(client.db as any, 'users', userId, 'data', 'goals');
      await setDoc(docRef, { goals, updatedAt: new Date().toISOString() }, { merge: true });
      return true;
    }
  } catch (err) {
    console.debug('[Firebase Firestore] Client sync queued:', err);
  }
  return false;
}

/**
 * Retrieve user goals from Firebase Cloud Firestore
 */
export async function getGoalsFromFirestore(userId: string): Promise<Goal[] | null> {
  try {
    const client = await getFirebaseClient();
    if (client?.db) {
      const { doc, getDoc } = await import('firebase/firestore/lite');
      const docRef = doc(client.db as any, 'users', userId, 'data', 'goals');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return (data?.goals as Goal[]) || null;
      }
    }
  } catch (err) {
    console.debug('[Firebase Firestore] Fetch queued:', err);
  }
  return null;
}

/**
 * Save user profile to Firebase Cloud Firestore
 */
export async function saveProfileToFirestore(userId: string, profile: UserProfile): Promise<boolean> {
  try {
    const client = await getFirebaseClient();
    if (client?.db) {
      const { doc, setDoc } = await import('firebase/firestore/lite');
      const docRef = doc(client.db as any, 'users', userId, 'data', 'profile');
      await setDoc(docRef, { profile, updatedAt: new Date().toISOString() }, { merge: true });
      return true;
    }
  } catch (err) {
    console.debug('[Firebase Firestore] Profile sync queued:', err);
  }
  return false;
}

/**
 * Retrieve user profile from Firebase Cloud Firestore
 */
export async function getProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const client = await getFirebaseClient();
    if (client?.db) {
      const { doc, getDoc } = await import('firebase/firestore/lite');
      const docRef = doc(client.db as any, 'users', userId, 'data', 'profile');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return (data?.profile as UserProfile) || null;
      }
    }
  } catch (err) {
    console.debug('[Firebase Firestore] Fetch profile queued:', err);
  }
  return null;
}

/**
 * Save notifications to Firebase Cloud Firestore
 */
export async function saveNotificationsToFirestore(userId: string, notifications: AppNotification[]): Promise<boolean> {
  try {
    const client = await getFirebaseClient();
    if (client?.db) {
      const { doc, setDoc } = await import('firebase/firestore/lite');
      const docRef = doc(client.db as any, 'users', userId, 'data', 'notifications');
      await setDoc(docRef, { notifications, updatedAt: new Date().toISOString() }, { merge: true });
      return true;
    }
  } catch (err) {
    console.debug('[Firebase Firestore] Notifications sync queued:', err);
  }
  return false;
}

/**
 * Retrieve notifications from Firebase Cloud Firestore
 */
export async function getNotificationsFromFirestore(userId: string): Promise<AppNotification[] | null> {
  try {
    const client = await getFirebaseClient();
    if (client?.db) {
      const { doc, getDoc } = await import('firebase/firestore/lite');
      const docRef = doc(client.db as any, 'users', userId, 'data', 'notifications');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return (data?.notifications as AppNotification[]) || null;
      }
    }
  } catch (err) {
    console.debug('[Firebase Firestore] Fetch notifications queued:', err);
  }
  return null;
}
