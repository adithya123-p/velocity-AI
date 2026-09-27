import { Goal, UserProfile, AppNotification, RescheduleEvent } from './types';
import { INITIAL_GOALS, INITIAL_PROFILE, INITIAL_NOTIFICATIONS } from './mockData';
import { getCurrentUser } from './auth';
import { 
  saveGoalsToFirestore, 
  getGoalsFromFirestore, 
  saveProfileToFirestore, 
  getProfileFromFirestore, 
  saveNotificationsToFirestore, 
  getNotificationsFromFirestore 
} from './firebase';

// Scope all keys to the logged-in user so each account has isolated data
function userKey(base: string): string {
  const user = getCurrentUser();
  return user ? `${base}_${user.id}` : base;
}

const BASE_KEYS = {
  GOALS: 'iqoo_velocity_goals_v1',
  PROFILE: 'iqoo_velocity_profile_v1',
  NOTIFICATIONS: 'iqoo_velocity_notifications_v1',
  RESCHEDULE_EVENTS: 'iqoo_velocity_reschedule_events_v1',
  VIEW_MODE: 'iqoo_velocity_view_mode_v1',
};

const STORAGE_KEYS = {
  get GOALS() { return userKey(BASE_KEYS.GOALS); },
  get PROFILE() { return userKey(BASE_KEYS.PROFILE); },
  get NOTIFICATIONS() { return userKey(BASE_KEYS.NOTIFICATIONS); },
  get RESCHEDULE_EVENTS() { return userKey(BASE_KEYS.RESCHEDULE_EVENTS); },
  get VIEW_MODE() { return userKey(BASE_KEYS.VIEW_MODE); },
};

// --- Database Sync Helpers (Dual-Sync: Firebase Cloud Firestore + Persistent Server DB) ---
async function syncGoalsToDB(goals: Goal[]): Promise<void> {
  const user = getCurrentUser();
  const userId = user ? user.id : 'demo-user-1';

  // 1. Cloud Firestore Sync
  if (typeof window !== 'undefined') {
    saveGoalsToFirestore(userId, goals).catch(() => {});
  }

  // 2. Server API Sync
  try {
    await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, goals })
    });
  } catch (err) {
    console.debug('[Database] Background server sync queued:', err);
  }
}

async function syncProfileToDB(profile: UserProfile): Promise<void> {
  const user = getCurrentUser();
  const userId = user ? user.id : 'demo-user-1';

  // 1. Cloud Firestore Sync
  if (typeof window !== 'undefined') {
    saveProfileToFirestore(userId, profile).catch(() => {});
  }

  // 2. Server API Sync
  try {
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, profile })
    });
  } catch (err) {
    console.debug('[Database] Background server sync queued:', err);
  }
}

async function syncNotificationsToDB(notifications: AppNotification[]): Promise<void> {
  const user = getCurrentUser();
  const userId = user ? user.id : 'demo-user-1';

  // 1. Cloud Firestore Sync
  if (typeof window !== 'undefined') {
    saveNotificationsToFirestore(userId, notifications).catch(() => {});
  }

  // 2. Server API Sync
  try {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, notifications })
    });
  } catch (err) {
    console.debug('[Database] Background server sync queued:', err);
  }
}

export function getStoredGoals(): Goal[] {
  if (typeof window === 'undefined') return INITIAL_GOALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
      syncGoalsToDB(INITIAL_GOALS);
      return INITIAL_GOALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GOALS;
  }
}

export function saveStoredGoals(goals: Goal[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    syncGoalsToDB(goals);
  } catch (e) {
    console.error('Error saving goals to storage', e);
  }
}

export function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      syncProfileToDB(INITIAL_PROFILE);
      return INITIAL_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    syncProfileToDB(profile);
  } catch (e) {
    console.error('Error saving profile to storage', e);
  }
}

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      syncNotificationsToDB(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    syncNotificationsToDB(notifs);
  } catch (e) {
    console.error('Error saving notifications', e);
  }
}

export function getStoredRescheduleEvents(): RescheduleEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESCHEDULE_EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredRescheduleEvents(events: RescheduleEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RESCHEDULE_EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Error saving reschedule events', e);
  }
}

export async function fetchDatabaseInitialData(userId: string = 'demo-user-1'): Promise<{
  goals: Goal[];
  profile: UserProfile;
  notifications: AppNotification[];
} | null> {
  try {
    // 1. Prioritize Cloud Firestore
    if (typeof window !== 'undefined') {
      const [fbGoals, fbProfile, fbNotifs] = await Promise.all([
        getGoalsFromFirestore(userId).catch(() => null),
        getProfileFromFirestore(userId).catch(() => null),
        getNotificationsFromFirestore(userId).catch(() => null),
      ]);

      if (fbGoals || fbProfile || fbNotifs) {
        return {
          goals: fbGoals || INITIAL_GOALS,
          profile: fbProfile || INITIAL_PROFILE,
          notifications: fbNotifs || INITIAL_NOTIFICATIONS
        };
      }
    }

    // 2. Server API fallback
    const [goalsRes, profRes, notifsRes] = await Promise.all([
      fetch(`/api/goals?userId=${encodeURIComponent(userId)}`),
      fetch(`/api/profile?userId=${encodeURIComponent(userId)}`),
      fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`),
    ]);

    const goalsData = await goalsRes.json();
    const profData = await profRes.json();
    const notifsData = await notifsRes.json();

    return {
      goals: goalsData.success && goalsData.data ? goalsData.data : INITIAL_GOALS,
      profile: profData.success && profData.data ? profData.data : INITIAL_PROFILE,
      notifications: notifsData.success && notifsData.data ? notifsData.data : INITIAL_NOTIFICATIONS,
    };
  } catch (err) {
    console.warn('[Database] Fetch initial data error:', err);
    return null;
  }
}

export function resetDemoState(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.removeItem(STORAGE_KEYS.RESCHEDULE_EVENTS);
  syncGoalsToDB(INITIAL_GOALS);
  syncProfileToDB(INITIAL_PROFILE);
  syncNotificationsToDB(INITIAL_NOTIFICATIONS);
}
