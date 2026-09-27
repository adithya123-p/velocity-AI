'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  getCurrentUser,
  loginUser,
  loginAsGuest,
  logoutUser,
  registerUser,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
} from './auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginGuest: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<AuthUser, 'name' | 'role' | 'bio' | 'avatarColor'>>) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate session from localStorage on mount
    const existing = getCurrentUser();
    setUser(existing);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = loginUser(email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const loginGuest = useCallback(() => {
    const result = loginAsGuest();
    setUser(result.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = registerUser(name, email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (
    updates: Partial<Pick<AuthUser, 'name' | 'role' | 'bio' | 'avatarColor'>>
  ) => {
    if (!user) return { success: false, error: 'Not logged in.' };
    const result = updateUserProfile(user.id, updates);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [user]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Not logged in.' };
    const result = updateUserPassword(user.id, currentPassword, newPassword);
    if (result.success) return { success: true };
    return { success: false, error: result.error };
  }, [user]);

  const deleteAccount = useCallback(() => {
    if (!user) return;
    deleteUserAccount(user.id);
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginGuest, register, logout, updateProfile, updatePassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
