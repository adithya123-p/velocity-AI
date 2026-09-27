import { Goal, ConsequenceScenario, PressureAnalysis, PressureLevel } from './types';

export function getDaysDifference(deadlineStr: string, fromDateStr?: string): number {
  const deadline = new Date(deadlineStr);
  const now = fromDateStr ? new Date(fromDateStr) : new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatOffsetDate(daysToAdd: number, fromDateStr?: string): string {
  const date = fromDateStr ? new Date(fromDateStr) : new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculatePressureAnalysis(goal: Goal): PressureAnalysis {
  const daysLeft = getDaysDifference(goal.deadline);
  const hoursLeft = Math.max(0, goal.totalHours - goal.completedHours);
  const completionPercentage = goal.totalHours > 0 ? Math.min(100, Math.round((goal.completedHours / goal.totalHours) * 100)) : 0;
  
  const missedTasks = goal.tasks.filter(t => t.status === 'Missed').length;
  const activeDays = Math.max(1, daysLeft);
  const dailyRequiredHours = parseFloat((hoursLeft / activeDays).toFixed(1));

  let currentStatus: PressureLevel = 'Comfortable';
  let score = 88;
  let adaptiveAdvice = 'You are on track! Maintain this steady consistency and you will finish with room for comprehensive review.';

  if (daysLeft === 0 || dailyRequiredHours >= 4.0) {
    currentStatus = 'Critical';
    score = Math.max(25, 45 - missedTasks * 8);
    adaptiveAdvice = 'High deadline density detected. Focus exclusively on highest-yield topics. Adaptive Rescheduling is ready to rebalance your daily targets.';
  } else if (dailyRequiredHours >= 2.5 || missedTasks >= 2) {
    currentStatus = 'High Pressure';
    score = Math.max(50, 68 - missedTasks * 6);
    adaptiveAdvice = 'Deadline pressure is elevating. Increasing daily focus to 2.5+ hours ensures zero last-minute rush.';
  } else if (dailyRequiredHours >= 1.5 || missedTasks >= 1) {
    currentStatus = 'Falling Behind';
    score = 74;
    adaptiveAdvice = 'Slight workload backlog detected. Starting today lets you distribute the extra 30-45 minutes gently across the week.';
  } else {
    currentStatus = 'Comfortable';
    score = Math.min(98, 88 + Math.round(completionPercentage * 0.1));
  }

  return {
    currentStatus,
    score,
    daysLeft,
    hoursLeft,
    dailyRequiredHours,
    completionPercentage,
    recommendedDailyEffort: dailyRequiredHours,
    missedTaskCount: missedTasks,
    adaptiveAdvice
  };
}

export function calculateConsequenceScenario(
  goal: Goal,
  delayDays: number,
  scenarioName: string
): ConsequenceScenario {
  const baseDaysLeft = Math.max(1, getDaysDifference(goal.deadline));
  const remainingHours = Math.max(0.5, goal.totalHours - goal.completedHours);
  
  const effectiveDays = Math.max(1, baseDaysLeft - delayDays);
  const dailyWorkloadHours = parseFloat((remainingHours / effectiveDays).toFixed(1));

  // Buffer calculation: days left minus days needed at 2 hrs/day pace
  const daysNeededBaseline = Math.ceil(remainingHours / 2.0);
  const bufferDaysLeft = Math.max(0, effectiveDays - daysNeededBaseline);
  
  // Revision allowance: ~20% of remaining days, depleted as delay increases
  const baseRevisionDays = Math.max(1, Math.round(baseDaysLeft * 0.2));
  const revisionDaysLeft = Math.max(0, baseRevisionDays - Math.floor(delayDays * 0.45));

  // Determine risk and visual load percentage
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let riskPercentage = 80;
  let statusLabel = 'Comfortable Pace';
  let barColor = 'from-emerald-500 to-green-400';
  let description = 'Smooth and manageable pace. Plenty of buffer time for deep revision and rest.';

  if (effectiveDays <= 1 || dailyWorkloadHours >= 4.0 || delayDays >= 8) {
    riskLevel = 'Severe';
    riskPercentage = 160;
    statusLabel = 'Critical Surge';
    barColor = 'from-rose-500 to-red-600';
    description = `Delaying ${delayDays} days pushes daily workload to ${dailyWorkloadHours}h/day with zero buffer. High risk of late finish.`;
  } else if (dailyWorkloadHours >= 2.6 || delayDays >= 5) {
    riskLevel = 'High';
    riskPercentage = 130;
    statusLabel = 'High Pressure';
    barColor = 'from-amber-500 to-orange-500';
    description = `Workload increases to ${dailyWorkloadHours}h/day (+60%). Little room for unexpected delays or fatigue.`;
  } else if (dailyWorkloadHours >= 1.6 || delayDays >= 2) {
    riskLevel = 'Moderate';
    riskPercentage = 105;
    statusLabel = 'Moderate Pressure';
    barColor = 'from-yellow-400 to-amber-400';
    description = `Workload rises to ${dailyWorkloadHours}h/day. Revision days reduce to ${revisionDaysLeft} days, but still within reach.`;
  } else {
    riskLevel = 'Low';
    riskPercentage = 80;
    statusLabel = 'Optimal & Safe';
    barColor = 'from-emerald-400 to-teal-400';
    description = `Ideal start: ${dailyWorkloadHours}h/day allows ${revisionDaysLeft} dedicated revision days and ${bufferDaysLeft} buffer days.`;
  }

  const completionOffset = delayDays > baseDaysLeft ? delayDays - baseDaysLeft + 2 : 0;
  const expectedCompletionDate = formatOffsetDate(
    completionOffset > 0 ? baseDaysLeft + completionOffset : Math.min(baseDaysLeft, Math.ceil(remainingHours / dailyWorkloadHours) + delayDays)
  );

  return {
    scenarioName,
    delayDays,
    expectedCompletionDate,
    dailyWorkloadHours,
    bufferDaysLeft,
    revisionDaysLeft,
    riskLevel,
    riskPercentage,
    statusLabel,
    description,
    visualBarWidth: Math.min(100, Math.round((riskPercentage / 180) * 100)),
    barColor
  };
}

export function getAllGoalScenarios(goal: Goal, customDelay = 5): ConsequenceScenario[] {
  return [
    calculateConsequenceScenario(goal, 0, 'Scenario A — Start Today'),
    calculateConsequenceScenario(goal, 3, 'Scenario B — Delay 3 Days'),
    calculateConsequenceScenario(goal, 7, 'Scenario C — Delay 7 Days'),
    calculateConsequenceScenario(goal, customDelay, `Custom Delay (${customDelay} Days)`)
  ];
}
