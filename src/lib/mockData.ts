import { Goal, UserProfile, AppNotification } from './types';

// Clean initial state for a brand new user
export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_PROFILE: UserProfile = {
  name: 'New User',
  role: '',
  bio: '',
  avatarUrl: '',
  level: 1,
  totalXp: 0,
  streakDays: 0,
  completedGoalsCount: 0,
  tasksCompletedCount: 0,
  productivityScore: 0,
  portfolioSkills: [],
  achievements: [
    {
      id: 'ach-streak-7',
      title: '7-Day Streak',
      description: 'Maintained a 7-day continuous study and execution habit.',
      iconName: 'Flame',
      isUnlocked: false
    },
    {
      id: 'ach-pressure-hero',
      title: 'Pressure Hero',
      description: 'Successfully completed a project flagged as High Pressure before the deadline.',
      iconName: 'Zap',
      isUnlocked: false
    },
    {
      id: 'ach-first-goal',
      title: 'First Goal Completed',
      description: 'Finalized and marked 100% completion on your inaugural learning journey.',
      iconName: 'Trophy',
      isUnlocked: false
    },
    {
      id: 'ach-10-tasks',
      title: '10 Tasks Completed',
      description: 'Crushed 10 focused study and coding tasks without skipping.',
      iconName: 'Award',
      isUnlocked: false
    },
    {
      id: 'ach-consequence-master',
      title: 'Consequence Master',
      description: 'Simulated 5 delay scenarios and chose the zero-procrastination path.',
      iconName: 'Brain',
      isUnlocked: false
    },
    {
      id: 'ach-level-10',
      title: 'Grandmaster Architect',
      description: 'Reach Level 10 by completing 100 cumulative productivity hours.',
      iconName: 'Target',
      isUnlocked: false
    }
  ],
  portfolioProjects: []
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-welcome',
    title: 'Welcome to Velocity AI',
    message: 'Get started by creating your first priority goal to generate an AI study plan.',
    type: 'info',
    timestamp: 'Just now',
    read: false,
    linkTab: 'goals'
  }
];
