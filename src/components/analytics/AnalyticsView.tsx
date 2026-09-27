'use client';

import React from 'react';
import { Goal, UserProfile } from '@/lib/types';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Flame, ShieldAlert, Award, Target } from '../ui/Icons';

interface AnalyticsViewProps {
  goals: Goal[];
  profile: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ goals, profile }) => {
  // Compute analytics
  let totalTasks = 0;
  let completedTasks = 0;
  let missedTasks = 0;
  let totalHoursPlanned = 0;
  let totalHoursCompleted = 0;

  goals.forEach((g) => {
    totalHoursPlanned += g.totalHours;
    totalHoursCompleted += g.completedHours;
    g.tasks.forEach((t) => {
      totalTasks++;
      if (t.status === 'Completed') completedTasks++;
      if (t.status === 'Missed') missedTasks++;
    });
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const goalsAtRisk = goals.filter(g => g.status === 'High Pressure' || g.status === 'Critical').length;
  const goalsOnTrack = goals.filter(g => g.status === 'Comfortable' || g.status === 'Falling Behind').length;

  // Mock weekly activity bars (Mon through Sun)
  const weeklyTrend = [
    { day: 'Mon', hours: 2.5, completed: 3 },
    { day: 'Tue', hours: 3.2, completed: 4 },
    { day: 'Wed', hours: 1.8, completed: 2 },
    { day: 'Thu', hours: 3.5, completed: 4 },
    { day: 'Fri', hours: 2.8, completed: 3 },
    { day: 'Sat', hours: 4.0, completed: 5 },
    { day: 'Sun (Today)', hours: 2.2, completed: 3 }
  ];

  const maxHours = Math.max(...weeklyTrend.map(d => d.hours));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFDE00] uppercase tracking-wider mb-1">
            <BarChart3 size={15} />
            <span>Productivity Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Velocity & Effort Analytics</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Empathetic progress tracking focused on sustainable consistency rather than perfectionism.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
            {profile.productivityScore}% Health Index
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl iqoo-glass border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-mono">Tasks Completed</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{completedTasks}</p>
          <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
            {missedTasks} adjusted via Adaptive Engine
          </span>
        </div>

        <div className="p-4 rounded-2xl iqoo-glass border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-mono">Completion Rate</span>
            <TrendingUp size={16} className="text-[#FFDE00]" />
          </div>
          <p className="text-2xl font-black text-[#FFDE00] font-mono">{completionRate}%</p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            +12% vs last week pace
          </span>
        </div>

        <div className="p-4 rounded-2xl iqoo-glass border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-mono">Hours Invested</span>
            <Clock size={16} className="text-[#00F0FF]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalHoursCompleted}h</p>
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
            Target: {totalHoursPlanned}h total
          </span>
        </div>

        <div className="p-4 rounded-2xl iqoo-glass border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-mono">Active Streak</span>
            <Flame size={16} className="text-orange-500 fill-orange-500" />
          </div>
          <p className="text-2xl font-black text-orange-400 font-mono">{profile.streakDays} Days</p>
          <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
            Personal Best: 16 Days
          </span>
        </div>
      </div>

      {/* Weekly Velocity Chart */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">Weekly Focus Velocity</h3>
            <p className="text-xs text-zinc-400">Daily hours logged across all active goals</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Avg: 2.8 hrs/day</span>
        </div>

        {/* SVG / Canvas Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-4 pb-2 border-b border-white/10">
          {weeklyTrend.map((item, idx) => {
            const heightPercent = Math.round((item.hours / maxHours) * 100);
            const isToday = idx === weeklyTrend.length - 1;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[11px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.hours}h
                </div>
                <div className="w-full max-w-[48px] bg-white/5 rounded-xl p-1 h-full flex items-end">
                  <div
                    className={`w-full rounded-lg transition-all duration-700 ${
                      isToday
                        ? 'bg-gradient-to-t from-[#FFDE00] to-[#FF6700] shadow-lg shadow-[#FFDE00]/20'
                        : 'bg-gradient-to-t from-white/15 to-white/30 group-hover:from-[#FFDE00]/50 group-hover:to-[#FFDE00]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[10px] sm:text-xs font-mono ${isToday ? 'text-[#FFDE00] font-bold' : 'text-zinc-400'}`}>
                  {item.day.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Health Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl iqoo-glass border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">Deadline Status Breakdown</span>
            <span className="text-xs font-mono text-zinc-400">{goals.length} Goals Active</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02]">
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Comfortable & On Track</span>
              </span>
              <span className="font-mono font-bold text-white">{goalsOnTrack}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02]">
              <span className="flex items-center gap-2 text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Elevated Pressure</span>
              </span>
              <span className="font-mono font-bold text-white">{goalsAtRisk}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl iqoo-glass border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">Adaptive AI Resilience Index</span>
            <span className="text-xs font-mono text-[#00F0FF]">Non-Shaming OS</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Whenever a task is missed, the Consequence Engine recalculates the remaining days smoothly instead of letting guilt cause abandonment. You have successfully recovered 4 missed sessions this month!
          </p>
          <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[11px] font-mono text-[#00F0FF]">
            💡 Pro tip: Spreading 30 minutes across 3 days lowers burnout risk by 68%.
          </div>
        </div>
      </div>

    </div>
  );
};
