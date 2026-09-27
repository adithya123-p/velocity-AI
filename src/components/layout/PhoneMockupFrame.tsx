'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { Zap, Flame, Monitor, Smartphone, RefreshCw } from '../ui/Icons';

interface PhoneMockupFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onToggleMobileMockup: () => void;
  onResetDemo: () => void;
  streakDays?: number;
}

export const PhoneMockupFrame: React.FC<PhoneMockupFrameProps> = ({
  children,
  activeTab,
  onSelectTab,
  onToggleMobileMockup,
  onResetDemo,
  streakDays = 12
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [islandExpanded, setIslandExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-6 px-4 flex flex-col items-center justify-center w-full min-h-[calc(100vh-5rem)] select-none">
      
      {/* Top Device Header Bar Controls */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[430px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] text-zinc-300 font-semibold tracking-wide">
            iQOO 13 Pro • Flagship Mobile
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetDemo}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Reset Data"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={onToggleMobileMockup}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFDE00]/15 hover:bg-[#FFDE00]/25 text-[#FFDE00] border border-[#FFDE00]/30 font-semibold text-[11px] transition-colors"
            title="Switch back to full desktop view"
          >
            <Monitor size={12} />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Realistic Flagship Smartphone Container */}
      <div className="relative flex justify-center items-center">
        
        {/* Hardware Buttons - Left Side (Action Button, Volume Up, Volume Down) */}
        <div className="absolute -left-[14px] top-[105px] w-[4px] h-[28px] bg-gradient-to-r from-zinc-700 to-zinc-500 rounded-l-sm shadow-md" />
        <div className="absolute -left-[14px] top-[148px] w-[4px] h-[52px] bg-gradient-to-r from-zinc-700 to-zinc-500 rounded-l-sm shadow-md" />
        <div className="absolute -left-[14px] top-[210px] w-[4px] h-[52px] bg-gradient-to-r from-zinc-700 to-zinc-500 rounded-l-sm shadow-md" />

        {/* Hardware Button - Right Side (Power Button) */}
        <div className="absolute -right-[14px] top-[165px] w-[4px] h-[78px] bg-gradient-to-l from-zinc-700 to-zinc-500 rounded-r-sm shadow-md" />

        {/* Outer Titanium Chassis */}
        <div className="w-[395px] sm:w-[415px] h-[840px] rounded-[52px] p-[10px] bg-gradient-to-b from-[#242938] via-[#131620] to-[#0A0C12] shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,222,0,0.08)] border border-white/20 relative flex flex-col overflow-hidden">
          
          {/* Subtle Outer Metal Chamfer Highlight */}
          <div className="absolute inset-0 rounded-[52px] pointer-events-none ring-1 ring-white/15" />
          
          {/* Top Micro Speaker Grill */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-14 h-[4px] bg-[#050608] rounded-full border border-white/5 z-40 shadow-inner" />

          {/* Screen Glass Bezel Inner */}
          <div className="w-full h-full rounded-[44px] bg-[#080A0F] overflow-hidden flex flex-col relative border border-white/[0.08] shadow-inner">
            
            {/* Glossy Diagonal Reflection Glare */}
            <div className="absolute top-0 right-0 w-[200px] h-[350px] bg-gradient-to-bl from-white/[0.035] via-white/[0.01] to-transparent pointer-events-none z-30 transform rotate-12 -translate-y-12 translate-x-12" />

            {/* iOS / Flagship Status Bar */}
            <div className="w-full h-11 px-7 pt-2 flex items-center justify-between text-white shrink-0 z-40 select-none bg-[#080A0F]/90 backdrop-blur-md">
              {/* Left Clock */}
              <div className="font-semibold text-[13px] tracking-tight text-zinc-100 font-mono">
                {currentTime}
              </div>

              {/* Dynamic Island Notch */}
              <div 
                onClick={() => setIslandExpanded(!islandExpanded)}
                className={`transition-all duration-300 ease-out cursor-pointer flex items-center justify-between px-2.5 rounded-full bg-black border border-white/10 shadow-lg ${
                  islandExpanded 
                    ? 'w-56 h-8 -mt-0.5 bg-black/95 ring-1 ring-[#FFDE00]/40' 
                    : 'w-28 h-6 hover:scale-105'
                }`}
                title="Tap to expand Dynamic Island"
              >
                {islandExpanded ? (
                  <div className="w-full flex items-center justify-between text-[11px] px-1 text-white">
                    <div className="flex items-center gap-1.5 text-[#FFDE00]">
                      <Zap size={13} className="fill-[#FFDE00]" />
                      <span className="font-bold text-[10px]">Velocity Live</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 font-mono text-[10px]">
                      <Flame size={12} className="fill-orange-400" />
                      <span>{streakDays}d Streak</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Front Camera Lens */}
                    <div className="w-2.5 h-2.5 rounded-full phone-lens-reflection border border-white/20 ml-0.5 relative">
                      <div className="absolute inset-0.5 rounded-full bg-cyan-400/30 animate-pulse" />
                    </div>
                    {/* Face ID / Proximity Sensor */}
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-800 mr-0.5" />
                  </>
                )}
              </div>

              {/* Right System Indicators (Signal, 5G, Battery) */}
              <div className="flex items-center gap-1.5 text-zinc-200">
                {/* Cellular Signal Bars */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1 bg-white rounded-full" />
                  <span className="w-0.5 h-1.5 bg-white rounded-full" />
                  <span className="w-0.5 h-2 bg-white rounded-full" />
                  <span className="w-0.5 h-2.5 bg-white rounded-full" />
                </div>
                {/* 5G Badge */}
                <span className="text-[10px] font-bold tracking-tighter text-zinc-300">5G</span>
                {/* Battery Icon with Fill */}
                <div className="w-5 h-2.5 rounded-[4px] border border-white/70 p-[1px] flex items-center relative">
                  <div className="w-3.5 h-full rounded-[2px] bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <div className="absolute -right-1 top-0.5 w-[1.5px] h-1.5 bg-white/70 rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* Inner Mobile Scrollable Viewport */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 pb-6 w-full">
              {children}
            </main>

            {/* Native In-Frame Mobile Dock with Home Indicator */}
            <BottomNav 
              activeTab={activeTab} 
              onSelectTab={onSelectTab} 
              inMockup={true} 
            />

          </div>
        </div>
      </div>

      {/* Helpful Hint under Mockup */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-zinc-500 font-mono">
          Interactive Mockup • Tap Dynamic Island at top to expand • Scroll inside screen
        </p>
      </div>

    </div>
  );
};
