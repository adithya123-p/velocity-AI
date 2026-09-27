// Client-side auth using localStorage.
// Passwords are hashed via a basic djb2-style hash (not cryptographically secure,
// but suitable for a client-only demo / no-backend app).

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatarColor?: string; // hex color for avatar background
  role?: string;
  bio?: string;
  isGuest?: boolean;
}

const KEYS = {
  USERS: 'iqoo_auth_users_v1',
  SESSION: 'iqoo_auth_session_v1',
};

// ----- Helpers -----

function hashPassword(password: string): string {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) + hash + password.charCodeAt(i);
    hash = hash & hash; // convert to 32-bit int
  }
  return Math.abs(hash).toString(36);
}

function getStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

// ----- Public API -----

export function registerUser(
  name: string,
  email: string,
  password: string
): { success: true; user: AuthUser } | { success: false; error: string } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.find((u) => u.email === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const AVATAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
  const newUser: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    role: 'Student & Developer',
    bio: 'Velocity AI user on a mission to build great things.',
  };

  saveStoredUsers([...users, newUser]);
  saveSession(newUser);
  return { success: true, user: newUser };
}

export function loginUser(
  email: string,
  password: string
): { success: true; user: AuthUser } | { success: false; error: string } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'No account found with this email.' };
  }
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password.' };
  }

  saveSession(user);
  return { success: true, user };
}

export function loginAsGuest(): { success: true; user: AuthUser } {
  const guestUser: AuthUser = {
    id: `guest-${Date.now()}`,
    name: 'Demo User',
    email: 'demo@velocityai.app',
    passwordHash: '',
    createdAt: new Date().toISOString(),
    avatarColor: '#FFDE00',
    role: 'Exploring Velocity AI',
    bio: 'Trying out the Velocity AI demo experience.',
    isGuest: true,
  };
  saveSession(guestUser);
  return { success: true, user: guestUser };
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.SESSION);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateUserProfile(
  userId: string,
  updates: Partial<Pick<AuthUser, 'name' | 'role' | 'bio' | 'avatarColor'>>
): { success: true; user: AuthUser } | { success: false; error: string } {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) {
    return { success: false, error: 'User not found.' };
  }

  const updated: AuthUser = { ...users[idx], ...updates };
  users[idx] = updated;
  saveStoredUsers(users);
  saveSession(updated);
  return { success: true, user: updated };
}

export function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): { success: true } | { success: false; error: string } {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) {
    return { success: false, error: 'User not found.' };
  }

  const user = users[idx];
  if (user.isGuest) {
    return { success: false, error: 'Guest accounts cannot change passwords.' };
  }
  if (user.passwordHash !== hashPassword(currentPassword)) {
    return { success: false, error: 'Current password is incorrect.' };
  }
  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  users[idx] = { ...user, passwordHash: hashPassword(newPassword) };
  saveStoredUsers(users);
  return { success: true };
}

export function deleteUserAccount(userId: string): void {
  const users = getStoredUsers().filter((u) => u.id !== userId);
  saveStoredUsers(users);
  logoutUser();
}

function saveSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
}
