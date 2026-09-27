'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';

type Tab = 'login' | 'register';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Consequence Engine',
    desc: 'See exactly what happens if you delay your goals — with real data.',
  },
  {
    icon: '🧠',
    title: 'Adaptive AI Reschedule',
    desc: 'Missed a session? The AI rebuilds your plan automatically.',
  },
  {
    icon: '🔮',
    title: 'Future Me Simulator',
    desc: 'Visualize your 30/60/90-day self based on today\'s choices.',
  },
  {
    icon: '📊',
    title: 'Proof-of-Work Portfolio',
    desc: 'Auto-generate your achievement portfolio as you complete goals.',
  },
];

const AVATAR_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6',
  '#F59E0B', '#10B981', '#3B82F6', '#EF4444',
];

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (password.length === 0) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: '#EF4444' };
  if (score <= 2) return { level: 2, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { level: 3, label: 'Good', color: '#3B82F6' };
  return { level: 4, label: 'Strong', color: '#10B981' };
}

// Floating particle component
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FFDE00' : i % 3 === 1 ? '#00F0FF' : '#8B5CF6',
            animation: `float-particle ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

export function AuthPage() {
  const { login, register, loginGuest } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState('');
  const [featureIdx, setFeatureIdx] = useState(0);
  const [animatingForm, setAnimatingForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const strength = getPasswordStrength(password);

  // Cycle through features
  useEffect(() => {
    const timer = setInterval(() => {
      setFeatureIdx((p) => (p + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const switchTab = (t: Tab) => {
    setAnimatingForm(true);
    setTimeout(() => {
      setTab(t);
      resetForm();
      setAnimatingForm(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 'register') {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    }

    setIsLoading(true);
    try {
      const result =
        tab === 'login'
          ? await login(email, password)
          : await register(name, email, password);

      if (!result.success) {
        setError(result.error || 'Something went wrong.');
      } else if (tab === 'register') {
        setSuccess('Account created! Welcome to Velocity AI ⚡');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,222,0,0.15); }
          50% { box-shadow: 0 0 50px rgba(255,222,0,0.4), 0 0 100px rgba(255,222,0,0.1); }
        }
        @keyframes feature-slide {
          0% { opacity: 0; transform: translateY(12px); }
          15%, 85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-12px); }
        }
        .slide-up { animation: slide-up 0.5s ease-out both; }
        .slide-in-right { animation: slide-in-right 0.5s ease-out both; }
        .glow-logo { animation: glow-pulse 3s ease-in-out infinite; }
        .feature-anim { animation: feature-slide 3s ease-in-out; }
        .form-fade { opacity: 0; transform: translateY(8px); transition: opacity 0.2s, transform 0.2s; }
        .form-visible { opacity: 1; transform: translateY(0); transition: opacity 0.25s, transform 0.25s; }
        .strength-bar { transition: width 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease; }
        .tab-active-line { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.06) inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>

      <div className="min-h-screen min-h-[100dvh] bg-[#080A0F] flex flex-col lg:flex-row overflow-x-hidden">
        
        {/* ── Left Panel: Branding ─────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#0C0E16] via-[#0A0D18] to-[#060810]">
          
          {/* Background layers */}
          <div className="absolute inset-0">
            <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#FFDE00]/6 blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[120px]" />
            <div className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full bg-cyan-500/6 blur-[80px]" />
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,222,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,222,0,0.8) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          <Particles />

          {/* Logo */}
          <div className="relative slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-2">
              <div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFDE00] to-[#FF6700] p-0.5 glow-logo"
                style={{ borderRadius: '18px' }}
              >
                <div className="w-full h-full bg-[#0B0D13] rounded-[16px] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#FFDE00" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-tight">
                  Velocity <span className="text-[#FFDE00]">AI</span>
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-0.5 tracking-widest uppercase">
                  Intelligence OS
                </div>
              </div>
            </div>
          </div>

          {/* Main headline */}
          <div className="relative">
            <div className="slide-up" style={{ animationDelay: '0.25s' }}>
              <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                Turn your goals<br />
                into{' '}
                <span className="bg-gradient-to-r from-[#FFDE00] via-[#FFB800] to-[#FF6700] bg-clip-text text-transparent">
                  unstoppable
                </span>
                <br />momentum.
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed max-w-md">
                The only productivity OS with a built-in Consequence Engine that shows you
                exactly what's at stake — and AI that adapts when life gets in the way.
              </p>
            </div>

            {/* Animated Feature Cards */}
            <div className="mt-10 slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest mb-4">
                Core Features
              </div>
              <div className="space-y-3">
                {FEATURES.map((f, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-500 ${
                      featureIdx === i
                        ? 'border-[#FFDE00]/30 bg-[#FFDE00]/5 shadow-lg shadow-[#FFDE00]/5'
                        : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{f.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{f.desc}</div>
                    </div>
                    {featureIdx === i && (
                      <div className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-[#FFDE00] mt-1.5 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer tagline */}
          <div className="relative slide-up" style={{ animationDelay: '0.55s' }}>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">All data stored locally — no server, no tracking.</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Auth Form ────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-10 py-10 sm:py-12 relative overflow-y-auto min-h-screen lg:min-h-0 bg-[#080A0F]">
          
          {/* Subtle mobile background */}
          <div className="absolute inset-0 lg:hidden">
            <div className="absolute top-[-10%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#FFDE00]/5 blur-[100px]" />
          </div>

          <div className="w-full max-w-[420px] relative">

            {/* Mobile-only logo */}
            <div className="flex lg:hidden items-center gap-3 justify-center mb-8 slide-up">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFDE00] to-[#FF6700] p-0.5">
                <div className="w-full h-full bg-[#0B0D13] rounded-[10px] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#FFDE00" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-black text-white">
                Velocity <span className="text-[#FFDE00]">AI</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8 slide-up" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {tab === 'login' ? 'Welcome back.' : 'Create your account.'}
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                {tab === 'login'
                  ? 'Sign in to access your workspace and goals.'
                  : 'Join thousands building consistent momentum.'}
              </p>
            </div>

            {/* Card */}
            <div
              className="rounded-3xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(14,17,26,0.9)', backdropFilter: 'blur(20px)' }}
            >
              {/* Tab switcher */}
              <div className="flex border-b border-white/8 relative">
                {(['login', 'register'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    id={`auth-tab-${t}`}
                    onClick={() => switchTab(t)}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                      tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : 'Create Account'}
                    {tab === t && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-gradient-to-r from-[#FFDE00] to-[#FF6700] rounded-full tab-active-line" />
                    )}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div
                ref={formRef}
                className={`p-6 space-y-4 ${animatingForm ? 'form-fade' : 'form-visible'}`}
              >
                {/* Name field (register only) */}
                {tab === 'register' && (
                  <div className="slide-up" style={{ animationDelay: '0.05s' }}>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                      Full Name
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 focus:bg-white/[0.09] transition-all"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 focus:bg-white/[0.09] transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={tab === 'register' ? 'Min. 6 characters' : 'Your password'}
                      required
                      autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFDE00]/50 focus:ring-1 focus:ring-[#FFDE00]/20 focus:bg-white/[0.09] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {tab === 'register' && password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            className="flex-1 h-1 rounded-full overflow-hidden bg-white/10"
                          >
                            <div
                              className="h-full rounded-full strength-bar"
                              style={{
                                width: strength.level >= lvl ? '100%' : '0%',
                                backgroundColor: strength.color,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] font-semibold" style={{ color: strength.color }}>
                        {strength.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password (register only) */}
                {tab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 tracking-widest uppercase">
                      Confirm Password
                    </label>
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.06] border text-white text-sm placeholder-zinc-600 focus:outline-none focus:bg-white/[0.09] transition-all ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-500/50 focus:border-red-500/70'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-500/50 focus:border-emerald-500/70'
                          : 'border-white/10 focus:border-[#FFDE00]/50'
                      }`}
                    />
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-[11px] text-red-400 mt-1">Passwords don't match</p>
                    )}
                    {confirmPassword && confirmPassword === password && (
                      <p className="text-[11px] text-emerald-400 mt-1">✓ Passwords match</p>
                    )}
                  </div>
                )}

                {/* Remember me (login only) */}
                {tab === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          rememberMe
                            ? 'bg-[#FFDE00] border-[#FFDE00]'
                            : 'border-white/20 bg-white/5 group-hover:border-white/40'
                        }`}
                      >
                        {rememberMe && (
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400 select-none">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-[#FFDE00]/70 hover:text-[#FFDE00] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Success message */}
                {success && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {success}
                  </div>
                )}

                {/* Submit button */}
                <button
                  id="auth-submit"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #FFDE00 0%, #FF6700 100%)',
                    color: '#000',
                    boxShadow: '0 8px 30px -8px rgba(255,222,0,0.5)',
                  }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  {isLoading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                    </>
                  ) : tab === 'login' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Sign In
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[11px] text-zinc-600 font-mono">or</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Guest Demo button */}
                <button
                  id="auth-guest"
                  type="button"
                  onClick={loginGuest}
                  className="w-full py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-zinc-300 text-sm font-semibold flex items-center justify-center gap-2.5 transition-all group"
                >
                  <span className="text-base">⚡</span>
                  Try Demo — No Account Needed
                  <svg className="opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Switch tab link */}
                <p className="text-center text-xs text-zinc-500 pt-1">
                  {tab === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('register')}
                        className="text-[#FFDE00] font-semibold hover:underline"
                      >
                        Create one free
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="text-[#FFDE00] font-semibold hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Avatar color preview (register) */}
            {tab === 'register' && (
              <div className="mt-4 p-4 rounded-2xl border border-white/8 bg-white/[0.03] slide-up">
                <p className="text-[11px] text-zinc-500 font-mono mb-3 uppercase tracking-widest">Choose your avatar color</p>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-7 h-7 rounded-full border-2 border-transparent hover:scale-110 hover:border-white/40 transition-all"
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-[11px] text-zinc-600 mt-5 font-mono">
              🔒 Stored locally on your device • Zero servers • Full privacy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
