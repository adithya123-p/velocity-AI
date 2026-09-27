'use client';

import React, { useState } from 'react';
import { Goal, Task } from '@/lib/types';
import { Plus, Target, Clock, AlertTriangle, CheckCircle2, ChevronRight, ChevronDown, FastForward, Sliders, Trash2 } from '../ui/Icons';
import { calculatePressureAnalysis } from '@/lib/consequenceEngine';

interface GoalsViewProps {
  goals: Goal[];
  onOpenCreateGoal: () => void;
  onOpenConsequence: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onToggleTaskStatus: (goalId: string, taskId: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onOpenCreateGoal,
  onOpenConsequence,
  onDeleteGoal,
  onToggleTaskStatus
}) => {
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(goals[0]?.id || null);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFDE00] uppercase tracking-wider mb-1">
            <Target size={15} />
            <span>Active Goal Tracking & AI Milestones</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Your Priority Objectives</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Every goal is continuously monitored by the Deadline Pressure Meter and Consequence Engine.
          </p>
        </div>

        <button
          onClick={onOpenCreateGoal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FFDE00]/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goal Cards List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl iqoo-glass border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFDE00]/10 border border-[#FFDE00]/30 flex items-center justify-center text-[#FFDE00] shadow-xl shadow-[#FFDE00]/10">
              <Target size={32} />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-bold text-white">No Goals Created Yet</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Add an exam, coding project, or certification target. Our AI planner will automatically break it down into daily structured milestones and calibrate your workload!
              </p>
            </div>
            <button
              onClick={onOpenCreateGoal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-[#FFDE00]/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={18} />
              <span>Create Your First Goal</span>
            </button>
          </div>
        ) :
          goals.map((goal) => {
            const analysis = calculatePressureAnalysis(goal);
            const isExpanded = expandedGoalId === goal.id;

            const statusColor = 
              analysis.currentStatus === 'Comfortable' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
              analysis.currentStatus === 'Falling Behind' ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' :
              analysis.currentStatus === 'High Pressure' ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' :
              'bg-rose-500/15 border-rose-500/30 text-rose-400';

            return (
              <div
                key={goal.id}
                className="rounded-2xl iqoo-glass border border-white/10 overflow-hidden transition-all hover:border-white/20"
              >
              <div className="p-5 sm:p-6">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/5 border border-white/10 text-zinc-300">
                      {goal.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${statusColor} flex items-center gap-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{analysis.currentStatus}</span>
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Target: {goal.deadline} ({analysis.daysLeft} days left)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenConsequence(goal.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#FFDE00]/10 hover:bg-[#FFDE00]/20 border border-[#FFDE00]/30 text-[#FFDE00] text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
                      title="Simulate delay consequences"
                    >
                      <FastForward size={13} />
                      <span>Consequence Engine</span>
                    </button>

                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Progress Bar & Workload Telemetry */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">
                      Progress: <strong className="text-white">{goal.completedHours}h</strong> of {goal.totalHours}h ({analysis.completionPercentage}%)
                    </span>
                    <span className="text-[#FFDE00] font-bold">
                      {analysis.dailyRequiredHours}h / day needed
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FFDE00] via-amber-400 to-[#FF6700] transition-all duration-700"
                      style={{ width: `${analysis.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Motivational Coaching Tip */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 font-sans flex items-center justify-between gap-2">
                  <span className="leading-snug">💡 {analysis.adaptiveAdvice}</span>
                  <button
                    onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                    className="text-zinc-400 hover:text-white shrink-0 flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>{isExpanded ? 'Hide Curriculum' : `View Curriculum (${goal.tasks.length})`}</span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>

              </div>

              {/* Expandable Daily Curriculum Drawer */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10 space-y-2 bg-[#090C13]">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 py-1">
                    <span>AI-Generated Daily Milestones</span>
                    <span>Click circle to toggle status</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {goal.tasks.map((task) => {
                      const isDone = task.status === 'Completed';
                      const isMissed = task.status === 'Missed';

                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                            isDone ? 'bg-white/[0.02] border-white/5 opacity-70' :
                            isMissed ? 'bg-rose-500/10 border-rose-500/20' :
                            'bg-white/[0.04] border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1">
                            <button
                              onClick={() => onToggleTaskStatus(goal.id, task.id)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isDone ? 'bg-emerald-500 border-emerald-400 text-black' :
                                isMissed ? 'bg-rose-500/20 border-rose-500 text-rose-400' :
                                'border-zinc-500 hover:border-white'
                              }`}
                            >
                              {isDone && <CheckCircle2 size={13} className="text-black" />}
                              {isMissed && <AlertTriangle size={12} className="text-rose-400" />}
                            </button>

                            <div>
                              <span className={`font-semibold ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>
                                {task.title}
                              </span>
                              {task.notes && (
                                <p className="text-[10px] text-zinc-400 font-sans mt-0.5">{task.notes}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-zinc-400">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] uppercase font-bold text-zinc-300">
                              {task.type}
                            </span>
                            <span>{task.durationMinutes}m</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
        </div>

    </div>
  );
};
