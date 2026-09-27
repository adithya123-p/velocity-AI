export type GoalCategory = 
  | 'Exam' 
  | 'Assignment' 
  | 'Project' 
  | 'Coding' 
  | 'Habit' 
  | 'Personal' 
  | 'Other';

export type GoalDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

export type PressureLevel = 'Comfortable' | 'Falling Behind' | 'High Pressure' | 'Critical';

export type TaskType = 'Learning' | 'Milestone' | 'Revision' | 'Buffer' | 'Practice';

export type TaskStatus = 'Pending' | 'Completed' | 'Missed';

export interface Task {
  id: string;
  goalId: string;
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  title: string;
  durationMinutes: number;
  priority: 'Low' | 'Medium' | 'High';
  type: TaskType;
  status: TaskStatus;
  notes?: string;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  startDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  totalHours: number;
  completedHours: number;
  difficulty: GoalDifficulty;
  description: string;
  status: PressureLevel;
  tasks: Task[];
  createdAt: string;
}

export interface ConsequenceScenario {
  scenarioName: string;
  delayDays: number;
  expectedCompletionDate: string;
  dailyWorkloadHours: number;
  bufferDaysLeft: number;
  revisionDaysLeft: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  riskPercentage: number;
  statusLabel: string;
  description: string;
  visualBarWidth: number; // percentage for bar chart (e.g. 80, 100, 125, etc.)
  barColor: string;
}

export interface PressureAnalysis {
  currentStatus: PressureLevel;
  score: number; // 0 - 100
  daysLeft: number;
  hoursLeft: number;
  dailyRequiredHours: number;
  completionPercentage: number;
  recommendedDailyEffort: number; // in hours or minutes
  missedTaskCount: number;
  adaptiveAdvice: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'YouTube' | 'Doc' | 'Exercise' | 'Article';
  url: string;
  durationOrPages: string;
  channelOrAuthor: string;
  thumbnail?: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  goalId?: string;
  timestamp: string;
  resources?: LearningResource[];
  practiceQuestions?: PracticeQuestion[];
  keyPoints?: string[];
}

export interface SkillItem {
  name: string;
  category: string;
  proficiencyPercentage: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: GoalCategory;
  description: string;
  metrics: string;
  completedDate: string;
  skills: string[];
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  streakDays: number;
  totalXp: number;
  level: number;
  completedGoalsCount: number;
  tasksCompletedCount: number;
  productivityScore: number;
  portfolioSkills: SkillItem[];
  achievements: AchievementBadge[];
  portfolioProjects: PortfolioProject[];
}

export interface RescheduleEvent {
  id: string;
  goalId: string;
  goalTitle: string;
  timestamp: string;
  missedDayTitle: string;
  explanation: string;
  previousDailyHours: number;
  newDailyHours: number;
  adjustedTaskCount: number;
  accepted: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reschedule';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
