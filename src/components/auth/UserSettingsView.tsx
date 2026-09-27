'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

const AVATAR_COLORS = [
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#8B5CF6', name: 'Violet' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#14B8A6', name: 'Teal' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#10B981', name: 'Emerald' },
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#EF4444', name: 'Red' },
  { hex: '#FFDE00', name: 'Yellow' },
  { hex: '#FF6700', name: 'Orange' },
];

type SettingsTab = 'profile' | 'account' | 'danger';

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

export function UserSettingsView() {
  const { user, updateProfile, updatePassword, deleteAccount, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile form state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedColor, setSelectedColor] = useState(user?.avatarColor || '#6366F1');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<FeedbackState | null>(null);

  // Password form state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState<FeedbackState | null>(null);

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync user changes into form
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      setRole(user.role || '');
      setBio(user.bio || '');
      setSelectedColor(user.avatarColor || '#6366F1');
    }
  }, [user]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setProfileFeedback({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }
    setProfileLoading(true);
    setProfileFeedback(null);
    const result = await updateProfile({
      name: displayName.trim(),
      role: role.trim(),
      bio: bio.trim(),
      avatarColor: selectedColor,
    });
    setProfileLoading(false);
    setProfileFeedback(
      result.success
        ? { type: 'success', message: 'Profile updated successfully!' }
        : { type: 'error', message: result.error || 'Update failed.' }
    );
    setTimeout(() => setProfileFeedback(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPwd.length < 6) {
      setPwdFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    setPwdLoading(true);
    setPwdFeedback(null);
    const result = await updatePassword(currentPwd, newPwd);
    setPwdLoading(false);
    if (result.success) {
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setPwdFeedback({ type: 'success', message: 'Password changed successfully!' });
    } else {
      setPwdFeedback({ type: 'error', message: result.error || 'Failed to change password.' });
    }
    setTimeout(() => setPwdFeedback(null), 3000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') return;
    deleteAccount();
  };

  const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'account',
      label: 'Account',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @keyframes settings-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .settings-in { animation: settings-in 0.4s ease-out both; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.3s ease; }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-6 settings-in">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black text-white border-2 shadow-xl transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${selectedColor}cc, ${selectedColor}55)`,
                borderColor: selectedColor,
                boxShadow: `0 8px 30px -8px ${selectedColor}80`,
              }}
            >
              {getInitials(displayName || user?.name || 'U')}
            </div>
            {user?.isGuest && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[9px] font-mono">
                GUEST
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Account Settings</h1>
            <p className="text-sm text-zinc-400 mt-0.5 font-mono">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-zinc-500">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/8">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`settings-tab-${t.id}`}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? t.id === 'danger'
                    ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                    : 'bg-[#FFDE00]/15 text-[#FFDE00] border border-[#FFDE00]/25'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Profile Tab ─────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="settings-in space-y-4">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Avatar Color Picker */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Avatar Color</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Choose a color for your avatar badge.</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      title={c.name}
                      className="relative w-9 h-9 rounded-full transition-all hover:scale-110"
                      style={{
                        background: c.hex,
                        boxShadow: selectedColor === c.hex ? `0 0 0 3px #080A0F, 0 0 0 5px ${c.hex}` : 'none',
                        transform: selectedColor === c.hex ? 'scale(1.15)' : undefined,
                      }}
                    >
                      {selectedColor === c.hex && (
                        <svg className="absolute inset-0 m-auto" width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                  Display Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 transition-all"
                />
              </div>

              {/* Role / Title */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                  Role / Title
                </label>
                <input
                  id="settings-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Student & Developer"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 transition-all"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                  Bio
                </label>
                <textarea
                  id="settings-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short description about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 transition-all resize-none"
                />
                <p className="text-[11px] text-zinc-600 mt-1">{bio.length}/200 characters</p>
              </div>

              {/* Feedback */}
              {profileFeedback && (
                <div
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-sm border ${
                    profileFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {profileFeedback.type === 'success' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  {profileFeedback.message}
                </div>
              )}

              <button
                id="settings-save-profile"
                type="submit"
                disabled={profileLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #FFDE00 0%, #FF6700 100%)',
                  color: '#000',
                  boxShadow: '0 8px 30px -8px rgba(255,222,0,0.4)',
                }}
              >
                {profileLoading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Profile
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── Account Tab ─────────────────────────────────────── */}
        {activeTab === 'account' && (
          <div className="settings-in space-y-5">
            
            {/* Account Info Card */}
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
              <h3 className="text-sm font-bold text-white">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Account Type', value: user?.isGuest ? 'Guest / Demo' : 'Full Account' },
                  { label: 'User ID', value: user?.id?.slice(0, 16) + '…' || '—' },
                  { label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono mb-1">{item.label}</p>
                    <p className="text-sm text-white font-semibold font-mono break-all">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            {user?.isGuest ? (
              <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 text-amber-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <h4 className="text-sm font-bold text-amber-400">Guest Account</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    You&apos;re using a guest account. Password management is not available.{' '}
                    <button onClick={logout} className="text-[#FFDE00] underline font-semibold">
                      Sign in with a real account
                    </button>{' '}
                    to unlock all features.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Change Password</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Use a strong password with letters, numbers, and symbols.</p>
                </div>

                {[
                  { id: 'current-pwd', label: 'Current Password', value: currentPwd, setter: setCurrentPwd, auto: 'current-password' },
                  { id: 'new-pwd', label: 'New Password', value: newPwd, setter: setNewPwd, auto: 'new-password' },
                  { id: 'confirm-pwd', label: 'Confirm New Password', value: confirmPwd, setter: setConfirmPwd, auto: 'new-password' },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={`settings-${field.id}`}
                        type={showPwd ? 'text' : 'password'}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        autoComplete={field.auto}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 transition-all"
                      />
                    </div>
                  </div>
                ))}

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setShowPwd(!showPwd)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      showPwd ? 'bg-[#FFDE00] border-[#FFDE00]' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                    }`}
                  >
                    {showPwd && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 select-none">Show passwords</span>
                </label>

                {pwdFeedback && (
                  <div
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm border ${
                      pwdFeedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}
                  >
                    {pwdFeedback.message}
                  </div>
                )}

                <button
                  id="settings-change-password"
                  type="submit"
                  disabled={pwdLoading}
                  className="px-6 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white font-semibold text-sm hover:bg-white/[0.14] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {pwdLoading ? (
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  )}
                  Update Password
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Danger Zone Tab ──────────────────────────────────── */}
        {activeTab === 'danger' && (
          <div className="settings-in space-y-4">
            
            {/* Sign Out */}
            <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-orange-400">Sign Out</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Log out from your current session on this device.</p>
              </div>
              <button
                id="settings-logout"
                onClick={logout}
                className="px-5 py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold text-sm hover:bg-orange-500/25 transition-all shrink-0 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-5 rounded-2xl border border-red-500/25 bg-red-500/5 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 text-red-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-red-400">Delete Account</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Permanently delete your account and all associated data — goals, tasks, XP, portfolio.
                    This action <strong className="text-white">cannot be undone</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-red-400/70 mb-1.5 tracking-widest uppercase">
                  Type <span className="font-mono text-red-400">DELETE</span> to confirm
                </label>
                <input
                  id="settings-delete-confirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 text-white text-sm placeholder-red-900 focus:outline-none focus:border-red-500/50 transition-all font-mono"
                />
              </div>

              <button
                id="settings-delete-account"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleteConfirm !== 'DELETE'}
                className="px-6 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
                Delete My Account Permanently
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0E1119] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-white">Final Confirmation</h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              You are about to permanently delete your account. All your goals, tasks, XP, badges, and portfolio data will be erased immediately. This cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                id="settings-confirm-delete"
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
