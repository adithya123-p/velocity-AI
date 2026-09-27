'use client';

import React, { useState } from 'react';
import { Flame, Zap, Bell, CheckCircle2, AlertTriangle, Trophy, Sparkles } from '../ui/Icons';
import { UserProfile, AppNotification } from '@/lib/types';

interface NavbarProps {
  profile: UserProfile;
  notifications: AppNotification[];
  onSelectTab: (tab: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  notifications,
  onSelectTab,
  onMarkNotificationRead,
  onLogout
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const closeAll = () => { setShowNotifs(false); setShowUserMenu(false); };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080A0F]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        
        {/* Brand & Pill */}
        <div 
          onClick={() => onSelectTab('dashboard')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#FFDE00] to-[#FF6700] p-0.5 flex items-center justify-center shadow-lg shadow-[#FFDE00]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0D13] rounded-[10px] flex items-center justify-center">
              <Zap size={18} className="text-[#FFDE00] fill-[#FFDE00]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white group-hover:text-[#FFDE00] transition-colors">
                Velocity <span className="text-[#FFDE00]">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-[#FFDE00]/10 text-[#FFDE00] border border-[#FFDE00]/30 uppercase">
                Intelligence OS
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block font-mono">Consequence Engine • Adaptive OS</p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* AI Copilot Quick Launch Button */}
          <button
            onClick={() => onSelectTab('assistant')}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFDE00]/15 to-[#FF6700]/15 hover:from-[#FFDE00]/25 hover:to-[#FF6700]/25 border border-[#FFDE00]/40 text-[#FFDE00] text-xs font-bold transition-all shadow-sm shadow-[#FFDE00]/10 hover:shadow-[#FFDE00]/25 active:scale-95"
            title="Open AI Copilot"
          >
            <Sparkles size={13} className="text-[#FFDE00]" />
            <span className="hidden sm:inline">AI Copilot</span>
            <span className="sm:hidden font-mono">AI</span>
          </button>

          {/* Streak Badge */}
          <div 
            onClick={() => onSelectTab('today')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold cursor-pointer hover:bg-orange-500/20 transition-colors"
            title="Current Daily Streak"
          >
            <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-mono">{profile.streakDays}d<span className="hidden sm:inline"> Streak</span></span>
          </div>

          {/* XP & Level Badge */}
          <div 
            onClick={() => onSelectTab('portfolio')}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs font-semibold cursor-pointer hover:bg-yellow-400/20 transition-colors"
            title="User Level & XP"
          >
            <Trophy size={14} className="text-yellow-400" />
            <span className="font-mono">LVL {profile.level}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300 text-[11px] font-mono">{profile.totalXp.toLocaleString()} XP</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFDE00] text-black font-bold text-[10px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl iqoo-glass border border-white/15 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-[#FFDE00]" />
                    <h4 className="font-bold text-sm text-white">Smart Productivity Alerts</h4>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">{notifications.length} alerts</span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.linkTab) onSelectTab(notif.linkTab);
                        closeAll();
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        notif.read 
                          ? 'bg-white/[0.02] border-white/5 opacity-70' 
                          : 'bg-white/[0.06] border-white/15 hover:border-[#FFDE00]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          {notif.type === 'warning' && <AlertTriangle size={14} className="text-amber-400 shrink-0" />}
                          {notif.type === 'success' && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
                          {notif.type === 'info' && <Zap size={14} className="text-cyan-400 shrink-0" />}
                          <span>{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="mt-1 text-zinc-300 text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar + Dropdown Menu */}
          <div className="relative">
            <button
              id="navbar-avatar"
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 px-2 py-1 rounded-full border border-white/10 hover:border-[#FFDE00]/40 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              title="Account & Settings"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'AV'}
              </div>
              <span className="hidden sm:block text-xs font-semibold text-zinc-300 max-w-[72px] truncate">
                {profile.name?.split(' ')[0] || 'User'}
              </span>
              <svg className="text-zinc-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 bg-[#0E1119]/98 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-white/8 bg-white/[0.03] flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                  >
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'AV'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{profile.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{profile.role}</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {[
                    {
                      id: 'portfolio', label: 'Portfolio',
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                      ),
                    },
                    {
                      id: 'analytics', label: 'Analytics',
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                      ),
                    },
                    {
                      id: 'settings', label: 'Account Settings',
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      id={`navbar-menu-${item.id}`}
                      onClick={() => { onSelectTab(item.id); closeAll(); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <span className="text-zinc-500">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div className="my-1.5 border-t border-white/8" />

                  <button
                    id="navbar-signout"
                    onClick={() => { onLogout(); closeAll(); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors flex items-center gap-3"
                  >
                    <svg className="text-red-400/70" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
