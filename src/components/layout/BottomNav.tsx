'use client';

import React from 'react';
import { Home, Target, Calendar, Brain, BarChart3, User, FastForward, Sliders } from '../ui/Icons';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  inMockup?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, inMockup = false }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: <Home size={19} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={19} /> },
    { id: 'today', label: 'Today', icon: <Calendar size={19} /> },
    { id: 'future-me', label: 'Future Me', icon: <FastForward size={19} />, badge: 'AI' },
    { id: 'assistant', label: 'AI Copilot', icon: <Brain size={19} />, badge: 'AI' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={19} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <User size={19} /> },
    { id: 'settings', label: 'Settings', icon: <Sliders size={19} /> },
  ];

  if (inMockup) {
    return (
      <div className="w-full bg-[#080A0F]/95 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 pb-1 shrink-0 z-30 shadow-[0_-8px_25px_rgba(0,0,0,0.7)] select-none">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-1.5 min-w-[46px] rounded-xl transition-all relative shrink-0 ${
                  isActive 
                    ? 'text-[#FFDE00] font-semibold' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-[#FFDE00]/15' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[9px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-0 right-0 px-1 text-[7px] font-black rounded-full bg-[#FF6700] text-white">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE00] mt-0.5 shadow-sm shadow-[#FFDE00]" />
                )}
              </button>
            );
          })}
        </div>
        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2 mb-1" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080A0F]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 safe-area-bottom shadow-2xl">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 px-1 justify-start sm:justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[54px] rounded-xl transition-all relative shrink-0 active:scale-95 ${
                  isActive 
                    ? 'text-[#FFDE00] font-semibold bg-white/[0.04]' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-[#FFDE00]/15' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-0.5 right-1 px-1 py-0.2 text-[8px] font-black rounded-full bg-[#FF6700] text-white">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE00] mt-0.5 shadow-sm shadow-[#FFDE00]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar (Rendered inside desktop layout wrapper) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#080A0F]/60 backdrop-blur-xl p-4 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase px-3 mb-3 font-mono">
          Core Navigation
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFDE00]/15 to-transparent text-[#FFDE00] border-l-2 border-[#FFDE00] shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#FFDE00]' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#FF6700]/20 text-[#FF6700] border border-[#FF6700]/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Engine Callout Card at bottom of sidebar */}
        <div className="mt-auto pt-6">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FFDE00] animate-ping" />
              <span>Consequence Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
              Models procrastination impact and adaptively recalibrates workload in real-time.
            </p>
            <button
              onClick={() => onSelectTab('goals')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-[#FFDE00]/10 hover:bg-[#FFDE00]/20 border border-[#FFDE00]/30 text-[#FFDE00] font-semibold text-[11px] transition-colors"
            >
              Simulate Delay →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
