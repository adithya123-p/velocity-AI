'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { LandingHero } from '@/components/landing/LandingHero';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { GoalsView } from '@/components/goals/GoalsView';
import { TodayView } from '@/components/today/TodayView';
import { ConsequenceEngineView } from '@/components/consequence/ConsequenceEngineView';
import { FutureMeView } from '@/components/future-me/FutureMeView';
import { AIAssistantView } from '@/components/assistant/AIAssistantView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { CreateGoalModal } from '@/components/goals/CreateGoalModal';
import { AuthPage } from '@/components/auth/AuthPage';
import { UserSettingsView } from '@/components/auth/UserSettingsView';
import { useAuth } from '@/lib/AuthContext';
import { Goal, UserProfile, AppNotification, RescheduleEvent } from '@/lib/types';
import { 
  getStoredGoals, 
  saveStoredGoals, 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredNotifications, 
  saveStoredNotifications, 
  resetDemoState,
  fetchDatabaseInitialData 
} from '@/lib/storage';
import { INITIAL_GOALS, INITIAL_PROFILE, INITIAL_NOTIFICATIONS } from '@/lib/mockData';


export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(INITIAL_GOALS[0]?.id || '');
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Load from storage after mount (user-scoped) and sync with persistent database
  useEffect(() => {
    if (!user) return; // wait for auth
    const stored = getStoredProfile();
    // Sync the profile name/email with the registered auth user
    const mergedProfile: UserProfile = {
      ...stored,
      name: user.name,
    };
    const storedGoals = getStoredGoals();
    setGoals(storedGoals);
    if (storedGoals.length > 0) {
      setSelectedGoalId((prev) => prev || storedGoals[0].id);
    }
    setProfile(mergedProfile);
    setNotifications(getStoredNotifications());
    setHasMounted(true);

    // Sync with database backend
    fetchDatabaseInitialData(user.id).then((dbData) => {
      if (dbData && dbData.goals) {
        setGoals(dbData.goals);
        if (dbData.goals.length > 0) {
          setSelectedGoalId((prev) => prev || dbData.goals[0].id);
        }
      }
    });
  }, [user]);

  // Web Audio chime for completions
  const playCompletionChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio not supported or blocked
    }
  };

  const handleUpdateGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    saveStoredGoals(newGoals);
  };

  const handleAddGoal = (newGoal: Goal) => {
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveStoredGoals(updated);
    setSelectedGoalId(newGoal.id);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Goal & AI Plan Active',
      message: `"${newGoal.title}" was structured into ${newGoal.tasks.length} daily milestones.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      linkTab: 'goals'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);

    setActiveTab('goals');
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter(g => g.id !== goalId);
    setGoals(updated);
    saveStoredGoals(updated);
    if (selectedGoalId === goalId && updated.length > 0) {
      setSelectedGoalId(updated[0].id);
    }
  };

  const handleToggleTaskStatus = (goalId: string, taskId: string) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const tasks = g.tasks.map(t => {
          if (t.id === taskId) {
            const nextStatus = t.status === 'Completed' ? 'Pending' as const : 'Completed' as const;
            return { ...t, status: nextStatus };
          }
          return t;
        });
        const completedHours = tasks
          .filter(t => t.status === 'Completed')
          .reduce((acc, curr) => acc + (curr.durationMinutes / 60), 0);
        return {
          ...g,
          tasks,
          completedHours: parseFloat(completedHours.toFixed(1))
        };
      }
      return g;
    });

    handleUpdateGoals(updated);
    handleAddXp(50, 'Updated task status');
  };

  const handleAddXp = (amount: number, reason: string) => {
    playCompletionChime();
    setProfile(prev => {
      const newXp = prev.totalXp + amount;
      const newLevel = Math.floor(newXp / 600) + 1;
      const updated: UserProfile = {
        ...prev,
        totalXp: newXp,
        level: newLevel,
        tasksCompletedCount: prev.tasksCompletedCount + 1
      };
      saveStoredProfile(updated);
      return updated;
    });
  };

  const handleAddRescheduleEvent = (event: RescheduleEvent) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Plan Adjusted Adaptively',
      message: event.explanation,
      type: 'reschedule',
      timestamp: 'Just now',
      read: false,
      linkTab: 'today'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleResetDemo = () => {
    resetDemoState();
    setGoals([]);
    setProfile(INITIAL_PROFILE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('dashboard');
  };

  // Show auth page if not logged in
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center text-[#FFDE00] font-mono text-sm">
        Initializing Velocity AI Engine...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center text-[#FFDE00] font-mono text-sm">
        Loading your workspace...
      </div>
    );
  }

  // Active view router
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingHero
            onStartPlanning={() => setActiveTab('dashboard')}
            onExploreDemo={() => setActiveTab('goals')}
            onOpenConsequence={() => {
              setSelectedGoalId(goals[1]?.id || goals[0]?.id);
              setActiveTab('goals');
            }}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            goals={goals}
            profile={profile}
            onSelectTab={setActiveTab}
            onOpenCreateGoal={() => setIsCreateGoalOpen(true)}
            onOpenConsequence={(goalId) => {
              setSelectedGoalId(goalId);
              setActiveTab('goals');
            }}
          />
        );
      case 'goals':
        return (
          <div className="space-y-8">
            <ConsequenceEngineView
              goals={goals}
              selectedGoalId={selectedGoalId}
              onSelectGoal={setSelectedGoalId}
              onOpenFutureMe={() => setActiveTab('future-me')}
            />
            <div className="pt-4 border-t border-white/10">
              <GoalsView
                goals={goals}
                onOpenCreateGoal={() => setIsCreateGoalOpen(true)}
                onOpenConsequence={(goalId) => {
                  setSelectedGoalId(goalId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDeleteGoal={handleDeleteGoal}
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            </div>
          </div>
        );
      case 'today':
        return (
          <TodayView
            goals={goals}
            onUpdateGoals={handleUpdateGoals}
            onAddXp={handleAddXp}
            onAddRescheduleEvent={handleAddRescheduleEvent}
            onSelectTab={setActiveTab}
          />
        );
      case 'future-me':
        return (
          <FutureMeView
            goals={goals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={setSelectedGoalId}
            onTakeActionNow={(goalId) => {
              setSelectedGoalId(goalId);
              setActiveTab('today');
            }}
          />
        );
      case 'assistant':
        return (
          <AIAssistantView
            goals={goals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={setSelectedGoalId}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            goals={goals}
            profile={profile}
          />
        );
      case 'portfolio':
        return (
          <PortfolioView
            profile={profile}
            onUpdateProfile={setProfile}
          />
        );
      case 'settings':
        return <UserSettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white flex flex-col font-sans iqoo-grid-bg selection:bg-[#FFDE00] selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        notifications={notifications}
        onSelectTab={setActiveTab}
        onMarkNotificationRead={handleMarkNotificationRead}
        onLogout={logout}
      />



      {/* Main Layout Area */}
      <div className="flex-1 flex justify-center w-full min-w-0">
        <div className="flex w-full max-w-7xl mx-auto min-w-0">
          <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-12 w-full max-w-5xl">
            {renderActiveTab()}
          </main>
        </div>
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onSaveGoal={handleAddGoal}
      />

    </div>
  );
}
