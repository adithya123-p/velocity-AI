'use client';

import React, { useState } from 'react';
import { Goal } from '@/lib/types';
import { calculateConsequenceScenario } from '@/lib/consequenceEngine';
import { FastForward, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Brain, Clock, Zap } from '../ui/Icons';

interface FutureMeViewProps {
  goals: Goal[];
  selectedGoalId?: string;
  onSelectGoal: (id: string) => void;
  onTakeActionNow: (goalId: string) => void;
}

export const FutureMeView: React.FC<FutureMeViewProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal,
  onTakeActionNow
}) => {
  const currentGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  if (!currentGoal) {
    return <div className="p-8 text-center text-zinc-400">No active goals found.</div>;
  }

  // Scenario 1: Current Pace (Start Today / On track)
  const currentPaceScenario = calculateConsequenceScenario(currentGoal, 0, 'Current Steady Pace');

  // Scenario 2: 7 Days Delay
  const delayedScenario = calculateConsequenceScenario(currentGoal, 7, '7-Day Delay Trajectory');

  const currentProbability = Math.min(98, Math.max(65, 100 - (currentPaceScenario.dailyWorkloadHours > 3 ? 20 : 5)));
  const delayedProbability = Math.max(38, Math.min(75, 100 - (delayedScenario.dailyWorkloadHours * 15)));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-wider mb-1">
              <FastForward size={15} />
              <span>Future Me Simulation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Project Your Future Outcomes</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Step into two parallel timelines. See how small daily decisions today protect your future mental clarity and exam readiness.
            </p>
          </div>

          {/* Goal Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-zinc-400">Goal:</span>
            <select
              value={currentGoal.id}
              onChange={(e) => onSelectGoal(e.target.value)}
              className="bg-[#0B0D13] border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-[#00F0FF]"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Timeline 1: Current Pace */}
        <div className="p-6 rounded-2xl iqoo-glass border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] to-transparent shadow-xl shadow-emerald-500/5 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>Timeline Alpha • Consistent Pace</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">Zero Procrastination</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              &quot;If you continue at your current pace...&quot;
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              You maintain a disciplined yet relaxed rhythm. Each concept settles in long-term memory with plenty of buffer before the deadline.
            </p>

            {/* Metrics */}
            <div className="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Expected Completion Date:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{currentPaceScenario.expectedCompletionDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Daily Workload:</span>
                <span className="font-mono font-bold text-white text-sm">{currentPaceScenario.dailyWorkloadHours} hrs / day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Deadline Success Probability:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">{currentProbability}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Remaining Dedicated Revision:</span>
                <span className="font-mono font-semibold text-white">{currentPaceScenario.revisionDaysLeft} days runway</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Buffer Safety Margin:</span>
                <span className="font-mono font-semibold text-emerald-300">{currentPaceScenario.bufferDaysLeft} flex days preserved</span>
              </div>
            </div>

            {/* Stress Index Visual */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-zinc-400">Projected Stress Level:</span>
                <span className="text-emerald-400 font-bold">Low (Calm & Prepared)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="w-1/4 h-full bg-emerald-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => onTakeActionNow(currentGoal.id)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Zap size={14} className="fill-black" />
              <span>Lock In This Timeline — Start Today</span>
            </button>
          </div>
        </div>

        {/* Timeline 2: Delayed by 7 Days */}
        <div className="p-6 rounded-2xl iqoo-glass border border-orange-500/30 bg-gradient-to-b from-orange-500/[0.08] to-transparent shadow-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center gap-1.5">
                <AlertTriangle size={13} />
                <span>Timeline Beta • Delayed Path</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">+7 Days Procrastination</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              &quot;If you delay for 7 days...&quot;
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              The window compresses rapidly. To cross the finish line, daily study hours nearly double, leaving negligible room for mock tests or unexpected illness.
            </p>

            {/* Metrics */}
            <div className="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Expected Completion Date:</span>
                <span className="font-mono font-bold text-orange-400 text-sm">{delayedScenario.expectedCompletionDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Daily Workload:</span>
                <span className="font-mono font-bold text-orange-400 text-sm">{delayedScenario.dailyWorkloadHours} hrs / day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Deadline Success Probability:</span>
                <span className="font-mono font-black text-amber-400 text-sm">{delayedProbability}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Remaining Dedicated Revision:</span>
                <span className="font-mono font-semibold text-zinc-400">{delayedScenario.revisionDaysLeft} days (severely compressed)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Buffer Safety Margin:</span>
                <span className="font-mono font-semibold text-rose-400">0 days (Zero buffer)</span>
              </div>
            </div>

            {/* Stress Index Visual */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-zinc-400">Projected Stress Level:</span>
                <span className="text-orange-400 font-bold">High (Cramming Required)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="w-4/5 h-full bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-zinc-400 text-center font-mono">
              💡 Procrastination doesn&apos;t save time; it merely compresses it into stressful spikes.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
