'use client';

import React, { useState } from 'react';
import { Goal, AIAssistantMessage, LearningResource, PracticeQuestion } from '@/lib/types';
import { Brain, Send, Youtube, BookOpen, ExternalLink, Sparkles, CheckCircle2, HelpCircle, Check, X } from '../ui/Icons';

interface AIAssistantViewProps {
  goals: Goal[];
  selectedGoalId?: string;
  onSelectGoal: (id: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal
}) => {
  const currentGoal = goals.find(g => g.id === selectedGoalId) || goals[0];
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: currentGoal
        ? `Hello! I'm your AI study copilot for "${currentGoal.title}". Ask me anything — concept breakdowns, study strategies, practice questions, or resource recommendations. I'll give you targeted answers to keep you ahead of your deadline! ⚡`
        : `Hello! I'm your Velocity AI study assistant. Ask me anything about your goals, study strategies, or specific topics. Once you create a goal, I'll give you hyper-targeted answers based on your deadlines and progress. ⚡`,
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = currentGoal ? [
    { label: `Break down "${currentGoal.title}"`, query: `Give me a step-by-step breakdown of how to master ${currentGoal.title}` },
    { label: 'Study plan for today', query: `What should I focus on today for my goal: ${currentGoal.title}?` },
    { label: 'Common mistakes to avoid', query: `What are the most common mistakes when studying ${currentGoal.title}?` },
    { label: 'Practice quiz', query: `Give me a practice quiz question about ${currentGoal.title}` }
  ] : [
    { label: 'How to set effective goals', query: 'What makes a goal effective and achievable?' },
    { label: 'Best study techniques', query: 'What are the most effective study techniques backed by research?' },
    { label: 'Beat procrastination', query: 'How do I stop procrastinating and start working on my goals?' },
    { label: 'Active recall explained', query: 'How does active recall work and why is it better than re-reading?' }
  ];

  const handleSendMessage = async (queryToSend?: string) => {
    const text = queryToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, goalTitle: currentGoal?.title })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages(prev => [...prev, data.data]);
      } else {
        throw new Error(data.error);
      }
    } catch {
      // Offline fallback
      setTimeout(() => {
        const fallbackMsg: AIAssistantMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: `Here is a structured explanation for "${text}" tailored for your goal "${currentGoal?.title}": Understanding this core concept first will save you ~45 minutes of trial-and-error debugging during your next session.`,
          keyPoints: [
            'Core principle: Break the topic down into small testable units.',
            'Implementation detail: Verify boundary conditions and input types.',
            'Retention tip: Solve 2 practical problems right after reading.'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          resources: [
            {
              id: 'res-1',
              title: `${text} — Deep Dive & Concept Masterclass`,
              type: 'YouTube',
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(text)}`,
              durationOrPages: '15 mins',
              channelOrAuthor: 'Top Tech Educator'
            }
          ]
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Goal Anchor */}
      <div className="p-5 rounded-2xl iqoo-glass border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-wider mb-1">
            <Brain size={15} />
            <span>Task-Aware AI Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">&quot;Help Me Complete This&quot;</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Ask targeted questions directly connected to your active goal syllabus and milestones.
          </p>
        </div>

        {/* Goal Anchor Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Context Goal:</span>
          <select
            value={currentGoal?.id}
            onChange={(e) => onSelectGoal(e.target.value)}
            className="bg-[#0B0D13] border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-[#00F0FF]"
          >
            {goals.map((g) => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-mono text-zinc-500 shrink-0">Try asking:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.query)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white shrink-0 transition-colors flex items-center gap-1.5"
          >
            <Sparkles size={12} className="text-[#FFDE00]" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-medium shadow-lg shadow-[#FFDE00]/10 rounded-tr-none'
                  : 'iqoo-glass border border-white/15 text-zinc-200 rounded-tl-none space-y-4'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Key Takeaways */}
              {msg.keyPoints && msg.keyPoints.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
                  <div className="font-bold text-[#FFDE00] flex items-center gap-1.5 font-mono">
                    <Sparkles size={13} />
                    <span>Key Takeaways for Your Exam / Project:</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                    {msg.keyPoints.map((pt, idx) => (
                      <li key={idx} className="leading-snug">{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curated YouTube & Learning Resource Cards */}
              {msg.resources && msg.resources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold block">
                    Curated Learning Resources & YouTube Tutorials
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#FFDE00]/40 transition-all flex items-start gap-2.5 group"
                      >
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                          {res.type === 'YouTube' ? <Youtube size={16} /> : <BookOpen size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs text-white group-hover:text-[#FFDE00] transition-colors truncate">
                            {res.title}
                          </h5>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            {res.channelOrAuthor} • {res.durationOrPages}
                          </p>
                        </div>
                        <ExternalLink size={12} className="text-zinc-500 group-hover:text-white" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Practice Questions */}
              {msg.practiceQuestions && msg.practiceQuestions.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <HelpCircle size={14} />
                    <span>Quick Recall Check (Test Your Understanding)</span>
                  </span>

                  {msg.practiceQuestions.map((pq) => {
                    const chosenIdx = selectedAnswers[pq.id];
                    const isAnswered = chosenIdx !== undefined;

                    return (
                      <div key={pq.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                        <p className="font-semibold text-white">{pq.question}</p>
                        
                        <div className="space-y-1.5">
                          {pq.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === pq.answerIndex;
                            const isSelected = chosenIdx === optIdx;

                            let btnStyle = 'bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.08]';
                            if (isAnswered) {
                              if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                              else if (isSelected && !isCorrect) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuizOption(pq.id, optIdx)}
                                className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between text-xs ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && isCorrect && <Check size={14} className="text-emerald-400" />}
                                {isAnswered && isSelected && !isCorrect && <X size={14} className="text-rose-400" />}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className="p-2 rounded-lg bg-white/[0.04] text-[11px] text-zinc-300 font-sans leading-relaxed">
                            <strong>Explanation:</strong> {pq.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="text-[10px] text-zinc-500 font-mono text-right mt-1">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-4 rounded-2xl iqoo-glass border border-white/10 text-xs text-zinc-400 w-48">
            <Sparkles size={14} className="text-[#FFDE00] animate-spin-slow" />
            <span>Consulting syllabus AI...</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="p-2 rounded-2xl iqoo-glass border border-white/15 flex items-center gap-2 shadow-2xl">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask anything about "${currentGoal?.title || 'your goal'}"...`}
          className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#FFDE00] to-[#FF9E00] text-black font-extrabold hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>

    </div>
  );
};
