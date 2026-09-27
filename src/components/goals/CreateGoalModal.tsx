'use client';

import React, { useState } from 'react';
import { Goal, GoalCategory, GoalDifficulty, Task } from '@/lib/types';
import { X, Sparkles, Plus, Trash2, Calendar, Clock, Check, ArrowRight, Sliders } from '../ui/Icons';
import { generateDailyPlan } from '@/lib/aiPlanner';
import { calculatePressureAnalysis, formatOffsetDate } from '@/lib/consequenceEngine';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (newGoal: Goal) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal
}) => {
  const [step, setStep] = useState<'form' | 'review'>('form');

  // Form states
  const [title, setTitle] = useState('Prepare for my Java exam');
  const [category, setCategory] = useState<GoalCategory>('Exam');
  const [deadline, setDeadline] = useState(formatOffsetDate(15));
  const [totalHours, setTotalHours] = useState(20);
  const [difficulty, setDifficulty] = useState<GoalDifficulty>('Hard');
  const [description, setDescription] = useState('Master Java core syntax, OOP principles, Collections Framework, and practice past papers before finals.');

  // Generated Plan
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const categories: GoalCategory[] = ['Exam', 'Assignment', 'Project', 'Coding', 'Habit', 'Personal', 'Other'];
  const difficulties: GoalDifficulty[] = ['Easy', 'Medium', 'Hard', 'Extreme'];

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const tasks = generateDailyPlan(title, category, totalHours, deadline, difficulty);
      setGeneratedTasks(tasks);
      setIsGenerating(false);
      setStep('review');
    }, 450);
  };

  const handleUpdateTaskTitle = (index: number, newTitle: string) => {
    const updated = [...generatedTasks];
    updated[index] = { ...updated[index], title: newTitle };
    setGeneratedTasks(updated);
  };

  const handleDeleteTask = (index: number) => {
    setGeneratedTasks(generatedTasks.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = () => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      category,
      startDate: formatOffsetDate(0),
      deadline,
      totalHours: Number(totalHours),
      completedHours: 0,
      difficulty,
      description,
      status: 'Comfortable',
      tasks: generatedTasks,
      createdAt: new Date().toISOString()
    };

    const analysis = calculatePressureAnalysis(newGoal);
    newGoal.status = analysis.currentStatus;

    onSaveGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0F131D] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFDE00]/10 border border-[#FFDE00]/30 flex items-center justify-center text-[#FFDE00]">
              <Sparkles size={17} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {step === 'form' ? 'Create New Goal & AI Plan' : 'Review & Fine-Tune AI Plan'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {step === 'form' ? 'AI will decompose this into an adaptive curriculum' : `${generatedTasks.length} daily milestones generated`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'form' ? (
            <form onSubmit={handleGeneratePlan} id="goal-form" className="space-y-4">
              
              {/* Goal Title */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 font-bold mb-1.5">
                  Goal Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prepare for my Java exam"
                  className="w-full bg-[#080A0F] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-[#FFDE00] transition-colors"
                />
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 font-bold mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-[#080A0F] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFDE00]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 font-bold mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as GoalDifficulty)}
                    className="w-full bg-[#080A0F] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFDE00]"
                  >
                    {difficulties.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deadline & Total Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 font-bold mb-1.5">
                    Target Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Oct 15, 2026"
                    className="w-full bg-[#080A0F] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFDE00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 font-bold mb-1.5">
                    Estimated Total Work (Hours) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={300}
                    value={totalHours}
                    onChange={(e) => setTotalHours(Number(e.target.value))}
                    className="w-full bg-[#080A0F] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFDE00]"
                  />
                </div>
              </div>

              {/* Optional Description */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 font-bold mb-1.5">
                  Scope & Focus Areas (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline syllabus units, project repo, or specific chapters..."
                  className="w-full bg-[#080A0F] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFDE00]"
                />
              </div>

              {/* Prompt template hint */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-400 font-mono">
                ⚡ The AI planner will structure learning days, practical drills, revision checkpoints, and protective buffer days automatically.
              </div>

            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Generated Curriculum ({generatedTasks.length} sessions)</span>
                <span>You can edit or delete any task</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {generatedTasks.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        t.type === 'Revision' ? 'bg-amber-500/20 text-amber-300' :
                        t.type === 'Buffer' ? 'bg-cyan-500/20 text-cyan-300' :
                        t.type === 'Practice' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-zinc-800 text-zinc-300'
                      }`}>
                        {t.type}
                      </span>
                      <input
                        type="text"
                        value={t.title}
                        onChange={(e) => handleUpdateTaskTitle(idx, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#FFDE00] focus:outline-none text-white font-medium flex-1 px-1 py-0.5"
                      />
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-zinc-400 font-mono">{t.durationMinutes}m</span>
                      <button
                        onClick={() => handleDeleteTask(idx)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0B0D13]">
          {step === 'form' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="goal-form"
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FFDE00]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>{isGenerating ? 'Decomposing Plan...' : 'Generate AI Study Plan'}</span>
                <Sparkles size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Save Goal & Launch Engine</span>
                <Check size={15} />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
