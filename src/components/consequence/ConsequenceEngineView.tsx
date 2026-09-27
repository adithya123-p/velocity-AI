'use client';

import React, { useState } from 'react';
import { Goal, ConsequenceScenario } from '@/lib/types';
import { calculateConsequenceScenario, getAllGoalScenarios } from '@/lib/consequenceEngine';
import { Sliders, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ChevronRight, FastForward } from '../ui/Icons';

interface ConsequenceEngineViewProps {
  goals: Goal[];
  selectedGoalId?: string;
  onSelectGoal: (id: string) => void;
  onOpenFutureMe: () => void;
}

export const ConsequenceEngineView: React.FC<ConsequenceEngineViewProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal,
  onOpenFutureMe
}) => {
  const currentGoal = goals.find(g => g.id === selectedGoalId) || goals[0];
  const [sliderDelay, setSliderDelay] = useState<number>(4);

  if (!currentGoal) {
    return (
      <div className="p-8 text-center text-zinc-400">
        No active goals found. Please create a goal first.
      </div>
    );
  }

  const standardScenarios = [
    calculateConsequenceScenario(currentGoal, 0, 'Scenario A — Start Today'),
    calculateConsequenceScenario(currentGoal, 3, 'Scenario B — Delay 3 Days'),
    calculateConsequenceScenario(currentGoal, 7, 'Scenario C — Delay 7 Days'),
  ];

  const interactiveScenario = calculateConsequenceScenario(
    currentGoal,
    sliderDelay,
    `Custom Simulation (${sliderDelay} ${sliderDelay === 1 ? 'Day' : 'Days'} Delay)`
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Goal Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl iqoo-glass border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFDE00] uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>The Consequence Engine • Core Innovation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">What Happens If You Delay?</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Simulate the mathematical impact of procrastination on workload, buffer runway, and deadline safety.
          </p>
        </div>

        {/* Goal selector dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-zinc-400 whitespace-nowrap">Target Goal:</label>
          <select
            value={currentGoal.id}
            onChange={(e) => onSelectGoal(e.target.value)}
            className="bg-[#0B0D13] border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-[#FFDE00]"
          >
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title} ({g.totalHours - g.completedHours}h left)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goal Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-mono text-zinc-400">Total Work</span>
          <p className="text-base sm:text-lg font-bold text-white mt-0.5">{currentGoal.totalHours} Hours</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-mono text-zinc-400">Remaining</span>
          <p className="text-base sm:text-lg font-bold text-[#FFDE00] mt-0.5">{currentGoal.totalHours - currentGoal.completedHours} Hours</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-mono text-zinc-400">Target Deadline</span>
          <p className="text-base sm:text-lg font-bold text-white mt-0.5">{currentGoal.deadline}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-mono text-zinc-400">Current Status</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${
              currentGoal.status === 'Comfortable' ? 'bg-emerald-400' :
              currentGoal.status === 'Falling Behind' ? 'bg-yellow-400' :
              currentGoal.status === 'High Pressure' ? 'bg-orange-500' : 'bg-red-500'
            }`} />
            <span className="text-xs sm:text-sm font-semibold text-zinc-200">{currentGoal.status}</span>
          </div>
        </div>
      </div>

      {/* Scenario Cards Comparison (A, B, C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {standardScenarios.map((sc, idx) => {
          const isA = idx === 0;
          const isB = idx === 1;
          const isC = idx === 2;

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl iqoo-glass border transition-all relative overflow-hidden flex flex-col justify-between ${
                isA ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.06] to-transparent shadow-lg shadow-emerald-500/5' :
                isB ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.06] to-transparent' :
                'border-rose-500/40 bg-gradient-to-b from-rose-500/[0.06] to-transparent'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                    isA ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    isB ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                    'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {isA ? 'Recommended' : isB ? 'Elevated Pressure' : 'High Friction'}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    +{sc.delayDays}d Delay
                  </span>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-white mb-1">{sc.scenarioName}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{sc.description}</p>

                {/* Key Metrics */}
                <div className="space-y-2.5 py-3 border-y border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Daily Workload:</span>
                    <span className={`font-mono font-bold ${
                      isA ? 'text-emerald-400' : isB ? 'text-amber-300' : 'text-rose-400'
                    }`}>
                      {sc.dailyWorkloadHours} hrs / day
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Buffer Runway:</span>
                    <span className="font-mono text-zinc-200">
                      {sc.bufferDaysLeft} {sc.bufferDaysLeft === 1 ? 'day' : 'days'} buffer
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Revision Time:</span>
                    <span className="font-mono text-zinc-200">
                      {sc.revisionDaysLeft} {sc.revisionDaysLeft === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Est. Finish Date:</span>
                    <span className="font-mono text-white font-semibold">
                      {sc.expectedCompletionDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Workload Bar */}
              <div className="mt-4 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                  <span>Workload Index</span>
                  <span className="font-bold text-white">{sc.riskPercentage}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sc.barColor} transition-all duration-700`}
                    style={{ width: `${Math.min(100, sc.riskPercentage / 1.6)}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{sc.statusLabel}</span>
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Interactive Procrastination Slider & Timeline */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#FFDE00]" />
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Interactive Procrastination Slider
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Drag to see real-time shifts in daily effort, buffer preservation, and burnout risk.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFDE00]/10 border border-[#FFDE00]/30 font-mono text-xs text-[#FFDE00] font-bold">
            <span>Delay: {sliderDelay} {sliderDelay === 1 ? 'Day' : 'Days'}</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2 py-2">
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={sliderDelay}
            onChange={(e) => setSliderDelay(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-zinc-800 accent-[#FFDE00] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>0 Days (Today)</span>
            <span>3 Days</span>
            <span>7 Days</span>
            <span>12 Days (Danger)</span>
          </div>
        </div>

        {/* Live Simulation Result Callout */}
        <div className="mt-4 p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                interactiveScenario.riskLevel === 'Low' ? 'bg-emerald-400' :
                interactiveScenario.riskLevel === 'Moderate' ? 'bg-amber-400' :
                interactiveScenario.riskLevel === 'High' ? 'bg-orange-500' : 'bg-red-500'
              }`} />
              <span className="font-bold text-sm text-white">{interactiveScenario.statusLabel}</span>
              <span className="text-xs font-mono text-zinc-400">({interactiveScenario.riskPercentage}% Load)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {interactiveScenario.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400">Required Daily Load</span>
              <p className="text-lg font-black text-[#FFDE00] font-mono">{interactiveScenario.dailyWorkloadHours}h / day</p>
            </div>
            <button
              onClick={onOpenFutureMe}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFDE00] to-[#FF6700] text-black font-extrabold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#FFDE00]/20"
            >
              <span>Future Me Comparison</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
