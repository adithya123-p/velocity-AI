'use client';

import React from 'react';
import { Goal, UserProfile, Task } from '@/lib/types';
import { Flame, Target, Clock, Zap, CheckCircle2, AlertTriangle, ArrowRight, Plus, FastForward, Brain, Trophy } from '../ui/Icons';
import { calculatePressureAnalysis } from '@/lib/consequenceEngine';

interface DashboardViewProps {
  goals: Goal[];
  profile: UserProfile;
  onSelectTab: (tab: string) => void;
  onOpenCreateGoal: () => void;
  onOpenConsequence: (goalId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  goals,
  profile,
  onSelectTab,
  onOpenCreateGoal,
  onOpenConsequence
}) => {
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Calculate high-level stats
  let totalTasks = 0;
  let completedTasks = 0;
  let todayTasksList: { task: Task; goal: Goal }[] = [];

  goals.forEach((g) => {
    g.tasks.forEach((t) => {
      totalTasks++;
      if (t.status === 'Completed') completedTasks++;
      if (t.status === 'Pending' && todayTasksList.length < 3) {
        todayTasksList.push({ task: t, goal: g });
      }
    });
  });

  const remainingTasks = totalTasks - completedTasks;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Good Morning Greeting Card with Circular Productivity Ring */}
      <div className="p-6 sm:p-8 rounded-3xl iqoo-glass border border-white/15 relative overflow-hidden bg-gradient-to-br from-[#10141E] via-[#0C0F17] to-[#171424]">
        {/* Decorative lighting */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FFDE00]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Greeting info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFDE00] animate-ping" />
              <span className="text-xs font-mono font-bold text-[#FFDE00] uppercase tracking-wider">
                {todayStr} • Focus Day
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Good morning, <span className="text-[#FFDE00]">{profile.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {goals.length === 0 
                ? "Start by creating your first goal below. Velocity AI will break it into daily tasks and keep you on track automatically."
                : `You have ${goals.length} active goal${goals.length !== 1 ? 's' : ''}. ${completedTasks > 0 ? `Great progress — ${completedTasks} task${completedTasks !== 1 ? 's' : ''} completed!` : "Start today's focus block to build momentum."}`
              }
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('today')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FFDE00]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Start Today&apos;s Focus Block</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={onOpenCreateGoal}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Add Goal</span>
              </button>
            </div>
          </div>

          {/* Circular Productivity Indicator */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-white/10"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-[#FFDE00]"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * profile.productivityScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{profile.productivityScore}</span>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Score</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap size={14} />
                <span>High Velocity State</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {completedTasks} completed • {remainingTasks} remaining
              </p>
              <div className="flex items-center gap-1.5 text-orange-400">
                <Flame size={13} className="fill-orange-400" />
                <span>{profile.streakDays}-day streak</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Mini-KPI Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-zinc-400 font-mono text-[11px]">Tasks Completed</span>
            <p className="text-lg font-black text-white font-mono mt-0.5">{completedTasks}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-mono text-[11px]">Tasks Remaining</span>
            <p className="text-lg font-black text-white font-mono mt-0.5">{remainingTasks}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-mono text-[11px]">Current Streak</span>
            <p className="text-lg font-black text-orange-400 font-mono mt-0.5">{profile.streakDays} Days 🔥</p>
          </div>
          <div>
            <span className="text-zinc-400 font-mono text-[11px]">Overall Velocity</span>
            <p className="text-lg font-black text-[#FFDE00] font-mono mt-0.5">{overallProgress}% Done</p>
          </div>
        </div>

      </div>

      {/* Example Cards Specified in Prompt */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[#FFDE00]" />
            <h3 className="font-extrabold text-base text-white">Active Goals & Pressure Meters</h3>
          </div>
          <button
            onClick={() => onSelectTab('goals')}
            className="text-xs font-mono text-[#FFDE00] hover:underline"
          >
            View All Goals →
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl iqoo-glass border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFDE00]/10 border border-[#FFDE00]/30 flex items-center justify-center text-[#FFDE00]">
              <Target size={28} />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-lg font-bold text-white">No Goals Created Yet</h4>
              <p className="text-xs sm:text-sm text-zinc-400">
                Start your journey by adding an exam, project, or learning milestone. Velocity AI will structure it into daily tasks!
              </p>
            </div>
            <button
              onClick={onOpenCreateGoal}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FFDE00]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>Add Your First Goal</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((goal) => {
              const analysis = calculatePressureAnalysis(goal);

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl iqoo-glass-interactive border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-300 uppercase">
                        {goal.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        goal.status === 'Comfortable' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                        goal.status === 'Falling Behind' ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' :
                        'bg-orange-500/15 border-orange-500/30 text-orange-400'
                      }`}>
                        {goal.status}
                      </span>
                    </div>

                    <h4 className="font-black text-base text-white mb-1">{goal.title}</h4>
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-4">
                      <span>{analysis.daysLeft} days left</span>
                      <span>{analysis.completionPercentage}% completed</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FFDE00] to-[#FF6700]"
                        style={{ width: `${analysis.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400">
                      Effort: <strong className="text-white">{analysis.dailyRequiredHours}h/day</strong>
                    </span>
                    <button
                      onClick={() => onOpenConsequence(goal.id)}
                      className="text-[11px] font-mono text-[#FFDE00] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Consequence</span>
                      <FastForward size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Tasks Snippet */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#00F0FF]" />
            <h3 className="font-extrabold text-base text-white">Today&apos;s High Priority Queue</h3>
          </div>
          <button
            onClick={() => onSelectTab('today')}
            className="text-xs font-mono text-[#00F0FF] hover:underline"
          >
            Open Execution View →
          </button>
        </div>

        {todayTasksList.length === 0 ? (
          <div className="p-8 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center">
            <Clock size={28} className="text-zinc-500 mx-auto mb-2" />
            <h5 className="font-bold text-sm text-white">Your queue is currently clear</h5>
            <p className="text-xs text-zinc-400 mt-1">
              Add a goal to generate structured daily study & coding blocks.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasksList.map(({ task, goal }) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#FFDE00]">{goal.title}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 font-mono">{task.durationMinutes} mins</span>
                  </div>
                  <h5 className="font-bold text-sm text-white">{task.title}</h5>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectTab('today')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
