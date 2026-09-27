'use client';

import React from 'react';
import { Zap, ArrowRight, Play, FastForward, Sliders, ShieldAlert, Sparkles, CheckCircle2 } from '../ui/Icons';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onExploreDemo: () => void;
  onOpenConsequence: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onExploreDemo,
  onOpenConsequence
}) => {
  const pipelineSteps = [
    { title: '1. Goal Input', desc: 'Java exam, 20 hrs, 15 days', icon: <Sparkles size={16} /> },
    { title: '2. Daily Plan', desc: 'AI breaks into micro-milestones', icon: <Sliders size={16} /> },
    { title: '3. Consequence', desc: 'Simulate 0d, 3d & 7d delays', icon: <FastForward size={16} /> },
    { title: '4. Adaptive Recovery', desc: 'Auto-rebalances missed days', icon: <ShieldAlert size={16} /> },
    { title: '5. Confident Finish', desc: 'Zero panic, 100% mastery', icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20 px-4 max-w-6xl mx-auto">
      
      {/* Decorative cyber glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFDE00]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-[#FF6700]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Pill header */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FFDE00] animate-pulse" />
          <span className="text-xs font-semibold text-zinc-300">
            Next-Gen <span className="text-[#FFDE00] font-bold">Velocity Engine</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-xs text-zinc-400 font-mono">Mobile-First AI</span>
        </div>
      </div>

      {/* Main Headline & Subheadline */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight md:leading-[1.15]">
          Don&apos;t Just Track Your Goals.{' '}
          <span className="bg-gradient-to-r from-[#FFDE00] via-amber-300 to-[#FF6700] bg-clip-text text-transparent underline decoration-[#FFDE00]/30 decoration-wavy">
            See Where They Lead.
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          An AI productivity assistant that turns deadlines into daily action and shows you the real impact of procrastination before it happens.
        </p>

        {/* CTA Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartPlanning}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#FFDE00]/25 hover:scale-105 active:scale-95 transition-all group"
          >
            <span>Start Planning</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-base flex items-center justify-center gap-2 backdrop-blur-md transition-all"
          >
            <Play size={16} className="text-[#FFDE00]" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Quick Consequence Teaser Pill */}
        <div className="mt-4">
          <button
            onClick={onOpenConsequence}
            className="text-xs font-mono text-zinc-400 hover:text-[#FFDE00] underline underline-offset-4 transition-colors"
          >
            ⚡ Test the Consequence Engine with Delay Simulator →
          </button>
        </div>
      </div>

      {/* Visual Workflow Preview Pipeline */}
      <div className="mt-14 pt-8 border-t border-white/10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
            The Velocity Proactive Loop
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl iqoo-glass border border-white/10 flex flex-col justify-between hover:border-[#FFDE00]/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFDE00] group-hover:scale-110 transition-transform">
                  {step.icon}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Step 0{idx + 1}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-[#FFDE00] transition-colors">{step.title}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
