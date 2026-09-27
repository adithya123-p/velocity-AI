'use client';

import React, { useState } from 'react';
import { UserProfile, AchievementBadge, PortfolioProject } from '@/lib/types';
import { Award, Trophy, Flame, Zap, CheckCircle2, Share2, Code, Target, BookOpen, ExternalLink, Sliders } from '../ui/Icons';

interface PortfolioViewProps {
  profile: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ profile, onUpdateProfile }) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShareCard = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextLevelXp = profile.level * 600;
  const currentLevelProgress = Math.min(100, Math.round(((profile.totalXp % 600) / 600) * 100));

  return (
    <div className="space-y-6">
      
      {/* Profile Header Showcase Card */}
      <div className="p-6 sm:p-8 rounded-3xl iqoo-glass border border-white/15 relative overflow-hidden bg-gradient-to-br from-[#10141E] via-[#0C0F17] to-[#151928]">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFDE00]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#FFDE00] p-1 bg-gradient-to-tr from-[#FFDE00] to-[#FF6700] shadow-xl shadow-[#FFDE00]/20">
                <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center font-black text-2xl text-[#FFDE00]">
                  AV
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#FFDE00] text-black font-extrabold text-[10px] font-mono shadow-md">
                LVL {profile.level}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFDE00]/15 border border-[#FFDE00]/30 text-[#FFDE00] font-mono font-bold text-[11px] uppercase">
                  Verified Innovator
                </span>
              </div>
              <p className="text-sm font-semibold text-zinc-300 font-mono">{profile.role}</p>
              <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FFDE00] hover:bg-yellow-300 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FFDE00]/20 transition-all hover:scale-105"
            >
              <Share2 size={15} />
              <span>Share Credential</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              <span>Consistency Streak</span>
            </div>
            <p className="text-xl font-black text-white font-mono mt-1">{profile.streakDays} Days</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Trophy size={14} className="text-[#FFDE00]" />
              <span>Total Experience</span>
            </div>
            <p className="text-xl font-black text-[#FFDE00] font-mono mt-1">{profile.totalXp.toLocaleString()} XP</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Tasks Completed</span>
            </div>
            <p className="text-xl font-black text-white font-mono mt-1">{profile.tasksCompletedCount} Crushed</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Target size={14} className="text-[#00F0FF]" />
              <span>Productivity Score</span>
            </div>
            <p className="text-xl font-black text-[#00F0FF] font-mono mt-1">{profile.productivityScore}% Health</p>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
            <span>Level {profile.level} Progression</span>
            <span className="text-white font-bold">{currentLevelProgress}% to Level {profile.level + 1}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#FFDE00] to-[#FF6700]"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Verified Achievement Badges */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-[#FFDE00]" />
            <h3 className="font-extrabold text-base sm:text-lg text-white">Verified Productivity Milestones</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {profile.achievements.filter(a => a.isUnlocked).length} / {profile.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {profile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                ach.isUnlocked
                  ? 'bg-white/[0.04] border-white/15 hover:border-[#FFDE00]/40'
                  : 'bg-white/[0.01] border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  ach.isUnlocked ? 'bg-[#FFDE00]/15 text-[#FFDE00]' : 'bg-zinc-800 text-zinc-600'
                }`}>
                  <Trophy size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{ach.title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{ach.description}</p>
                  {ach.unlockedAt && (
                    <span className="text-[10px] font-mono text-[#FFDE00] mt-1.5 block">
                      Unlocked: {ach.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical & Academic Mastery Radar */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code size={18} className="text-[#00F0FF]" />
            <h3 className="font-extrabold text-base sm:text-lg text-white">Skills & Knowledge Proficiency</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">Continuous Mastery</span>
        </div>

        <div className="space-y-3">
          {profile.portfolioSkills.map((skill, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{skill.name}</span>
                <span className="font-mono text-zinc-400">{skill.proficiencyPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-[#FFDE00]"
                  style={{ width: `${skill.proficiencyPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Projects Showcase */}
      <div className="p-6 rounded-2xl iqoo-glass border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-400" />
            <h3 className="font-extrabold text-base sm:text-lg text-white">Featured Projects & Deliverables</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">High Velocity Outputs</span>
        </div>

        {profile.portfolioProjects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
            <BookOpen size={28} className="text-zinc-500 mx-auto mb-2" />
            <h5 className="font-bold text-sm text-white">No completed projects showcase yet</h5>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              As you complete goals and milestones, your finished projects and portfolio deliverables will automatically be showcased here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.portfolioProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFDE00]/15 text-[#FFDE00]">
                      {proj.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{proj.completedDate}</span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-white mb-1.5">{proj.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">{proj.description}</p>
                  <div className="p-2 rounded-lg bg-white/[0.04] text-[11px] font-mono text-emerald-400 font-semibold mb-3">
                    ⚡ {proj.metrics}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {proj.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share / Export Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0F131D] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white">Productivity Credential Card</h3>
              <button onClick={() => setShowShareModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121624] to-[#0A0D15] border border-[#FFDE00]/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FFDE00]">VELOCITY AI VERIFIED</span>
                <span className="text-xs font-mono text-zinc-400">Score: {profile.productivityScore}%</span>
              </div>
              <h4 className="font-black text-xl text-white">{profile.name}</h4>
              <p className="text-xs text-zinc-300">{profile.role}</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/10">
                <span>🔥 {profile.streakDays}-Day Streak</span>
                <span>⚡ {profile.totalXp.toLocaleString()} Total XP</span>
                <span>🏆 8 Goals Completed</span>
                <span>✅ 64 Tasks Crushed</span>
              </div>
            </div>

            <button
              onClick={handleShareCard}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold text-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{copied ? 'Copied Link to Clipboard!' : 'Copy Shareable Link'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
