'use client';

import React, { useState } from 'react';
import { Goal, Task, RescheduleEvent } from '@/lib/types';
import { Check, X, Clock, AlertTriangle, RefreshCw, Zap, Sparkles, CheckCircle2, ChevronRight, Play } from '../ui/Icons';
import { recalculateAdaptiveSchedule } from '@/lib/aiPlanner';

interface TodayViewProps {
  goals: Goal[];
  onUpdateGoals: (updatedGoals: Goal[]) => void;
  onAddXp: (amount: number, reason: string) => void;
  onAddRescheduleEvent: (event: RescheduleEvent) => void;
  onSelectTab: (tab: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  goals,
  onUpdateGoals,
  onAddXp,
  onAddRescheduleEvent,
  onSelectTab
}) => {
  const [activeAdjustedBanner, setActiveAdjustedBanner] = useState<RescheduleEvent | null>(null);
  const [celebrationTask, setCelebrationTask] = useState<string | null>(null);

  // Extract pending and completed tasks for today across active goals
  const allTodayTasks: { task: Task; goal: Goal }[] = [];

  goals.forEach((g) => {
    // Find today's tasks or first 2 pending tasks
    const relevant = g.tasks.filter(t => t.status === 'Pending').slice(0, 2);
    relevant.forEach(t => {
      allTodayTasks.push({ task: t, goal: g });
    });
  });

  const completedTodayTasks: { task: Task; goal: Goal }[] = [];
  goals.forEach((g) => {
    const done = g.tasks.filter(t => t.status === 'Completed').slice(-1);
    done.forEach(t => {
      completedTodayTasks.push({ task: t, goal: g });
    });
  });

  // Handler: Complete a task
  const handleCompleteTask = (task: Task, goal: Goal) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goal.id) {
        const updatedTasks = g.tasks.map(t => {
          if (t.id === task.id) {
            return { ...t, status: 'Completed' as const, completedAt: new Date().toISOString() };
          }
          return t;
        });
        const addedHours = parseFloat((task.durationMinutes / 60).toFixed(1));
        return {
          ...g,
          tasks: updatedTasks,
          completedHours: Math.min(g.totalHours, parseFloat((g.completedHours + addedHours).toFixed(1)))
        };
      }
      return g;
    });

    onUpdateGoals(updatedGoals);
    onAddXp(75, `Completed task: ${task.title}`);
    setCelebrationTask(task.id);
    setTimeout(() => setCelebrationTask(null), 2500);
  };

  // Handler: Trigger Adaptive Reschedule (Missed Task)
  const handleSimulateMissedTask = (task: Task, goal: Goal) => {
    const { updatedGoal, explanation, previousDailyHours, newDailyHours, adjustedTaskCount } = recalculateAdaptiveSchedule(goal, task.id);

    const event: RescheduleEvent = {
      id: `resched-${Date.now()}`,
      goalId: goal.id,
      goalTitle: goal.title,
      timestamp: 'Just now',
      missedDayTitle: task.title,
      explanation,
      previousDailyHours,
      newDailyHours,
      adjustedTaskCount,
      accepted: false
    };

    setActiveAdjustedBanner(event);
    onAddRescheduleEvent(event);

    const updatedGoals = goals.map(g => g.id === goal.id ? updatedGoal : g);
    onUpdateGoals(updatedGoals);
  };

  const totalMinutes = allTodayTasks.reduce((acc, curr) => acc + curr.task.durationMinutes, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFDE00] uppercase tracking-wider mb-1">
            <Clock size={15} />
            <span>Today&apos;s Focus Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Daily Execution & Catch-Up Hub</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {allTodayTasks.length} focused sessions scheduled today • Total: {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m effort
          </p>
        </div>

        {/* Demo trigger pill */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-semibold">
            ⚡ Adaptive Reschedule Active
          </span>
        </div>
      </div>

      {/* Adaptive Reschedule Event Banner (If active) */}
      {activeAdjustedBanner && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
                <RefreshCw size={20} className="animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    Your plan has been adjusted.
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase">
                    Auto-Rebalanced
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 mt-1 leading-relaxed">
                  {activeAdjustedBanner.explanation}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                  <span className="text-zinc-400">Previous daily load: <strong className="text-white">{activeAdjustedBanner.previousDailyHours}h</strong></span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-amber-300 font-bold">New adjusted load: <strong>{activeAdjustedBanner.newDailyHours}h / day</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveAdjustedBanner(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={() => setActiveAdjustedBanner(null)}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
            >
              Accept Adjusted Plan
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>Active Priority Sessions ({allTodayTasks.length})</span>
          <span className="text-[11px] text-zinc-500">Click &quot;Missed&quot; to test Adaptive Rescheduling</span>
        </div>

        {goals.length === 0 ? (
          <div className="p-10 rounded-2xl iqoo-glass border border-dashed border-white/20 text-center text-zinc-400 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-base">No tasks scheduled for today</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Once you create a goal, Velocity AI will calculate your daily milestone tasks and display them here.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('goals')}
              className="px-4 py-2 rounded-xl bg-[#FFDE00] text-black font-bold text-xs hover:bg-[#FFDE00]/90 transition-colors"
            >
              Create First Goal →
            </button>
          </div>
        ) : allTodayTasks.length === 0 ? (
          <div className="p-8 rounded-2xl iqoo-glass border border-white/10 text-center text-zinc-400">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-white">All today&apos;s targets crushed!</p>
            <p className="text-xs text-zinc-400 mt-1">Check the Consequence Engine or celebrate in your Portfolio.</p>
          </div>
        ) : (
          allTodayTasks.map(({ task, goal }) => {
            const isCelebrated = celebrationTask === task.id;

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl iqoo-glass border transition-all ${
                  isCelebrated 
                    ? 'border-emerald-400 bg-emerald-500/20 scale-[1.01]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Task details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#FFDE00] px-2 py-0.5 rounded-md bg-[#FFDE00]/10 border border-[#FFDE00]/20">
                        {goal.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        task.priority === 'High' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                        task.priority === 'Medium' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <Clock size={12} />
                        <span>{task.durationMinutes} mins</span>
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        💡 {task.notes}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    
                    {/* Ask AI Copilot button */}
                    <button
                      onClick={() => onSelectTab('assistant')}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Ask AI to help explain this concept"
                    >
                      <Sparkles size={14} className="text-[#00F0FF]" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>

                    {/* Simulate Missed Task (Triggers Adaptive Reschedule) */}
                    <button
                      onClick={() => handleSimulateMissedTask(task, goal)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Simulate missed task to see automatic schedule rebalance"
                    >
                      <RefreshCw size={13} />
                      <span>Missed (Rebalance)</span>
                    </button>

                    {/* Complete Button */}
                    <button
                      onClick={() => handleCompleteTask(task, goal)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Check size={15} />
                      <span>Done (+75 XP)</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed Today section */}
      {completedTodayTasks.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-zinc-400 block mb-2">
            Completed Today ({completedTodayTasks.length})
          </span>
          <div className="space-y-2">
            {completedTodayTasks.map(({ task, goal }) => (
              <div key={task.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span className="line-through text-zinc-500">{task.title}</span>
                  <span className="text-[10px] font-mono text-zinc-600">({goal.title})</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">+75 XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
