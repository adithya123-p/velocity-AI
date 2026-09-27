import { Goal, GoalCategory, GoalDifficulty, Task } from './types';
import { getDaysDifference, formatOffsetDate } from './consequenceEngine';

interface CuratedCurriculum {
  [key: string]: {
    milestones: string[];
    revisions: string[];
    practices: string[];
  };
}

const CURATED_KNOWLEDGE: CuratedCurriculum = {
  java: {
    milestones: [
      'Java Syntax, JVM Architecture & Bytecode Basics',
      'Data Types, Operators & Conditional Flow Controls',
      'Loops, Arrays & Multi-Dimensional Matrix Traversal',
      'Methods, Parameter Passing & Scope Resolution',
      'OOP Foundations: Classes, Objects & Constructors',
      'Inheritance, Polymorphism & Method Overriding',
      'Encapsulation, Abstract Classes & Interfaces',
      'Exception Handling, Try-Catch-Finally & Custom Errors',
      'Java Collections Framework: ArrayList & LinkedList',
      'HashMaps, HashSets & Key-Value Lookups',
      'Java Streams API & Functional Lambda Expressions',
      'File I/O, Serialization & Buffered Streams',
      'Multithreading, Runnables & Thread Synchronization'
    ],
    revisions: [
      'Comprehensive Java OOP Architecture Review',
      'Collections Framework Quick-Recall Drill',
      'Full Mock Exam & Java Past Paper Solving'
    ],
    practices: [
      'Code Challenge: Build an In-Memory Banking System',
      'Debugging Session: Concurrency & Memory Leak Scenarios',
      'Timed Coding Sprint: 5 Algorithmic Java Problems'
    ]
  },
  physics: {
    milestones: [
      'Electrostatics: Coulomb\'s Law & Field Superposition',
      'Electric Potential, Equipotential Surfaces & Work Done',
      'Capacitance, Dielectrics & Energy Storage in Circuits',
      'Current Electricity: Ohm\'s Law, Drift Velocity & Resistivity',
      'Kirchhoff\'s Rules, Bridge Circuits & Nodal Analysis',
      'Magnetic Effects of Current & Biot-Savart Law',
      'Ampere\'s Circuital Law & Lorentz Force Applications',
      'Electromagnetic Induction: Faraday\'s & Lenz\'s Laws',
      'Alternating Currents: LC Oscillations, RLC Resonance & Power',
      'Ray Optics: Spherical Mirrors, Lenses & Prism Dispersion',
      'Wave Optics: Young\'s Double Slit & Diffraction Grating',
      'Dual Nature of Radiation & Photoelectric Effect',
      'Nuclear Physics: Binding Energy, Mass Defect & Radioactivity'
    ],
    revisions: [
      'Formula Sheet Memorization & Dimensional Analysis Drill',
      'High-Yield Derivation Review (Faraday, Optics, RLC)',
      'Full Physics Mock Paper with Timed Exam Environment'
    ],
    practices: [
      'Problem Set: 20 Advanced Electrostatics & Magnetism Numericals',
      'Circuit Problem Solving: Complex Multi-Loop RLC Networks',
      'Past 5 Years University & Competitive Examination Questions'
    ]
  },
  python: {
    milestones: [
      'Python Variables, Dynamic Typing & Clean Code Conventions',
      'Lists, Tuples, Slicing & Sequence Operations',
      'Dictionaries, Sets & Hash-Lookup Best Practices',
      'Functions, Args, Kwargs & Decorator Patterns',
      'List Comprehensions & Generator Expressions',
      'File Handling, Context Managers & JSON Serialization',
      'OOP in Python: Classes, Magic Methods (__init__, __str__)',
      'Virtual Environments, Pip & Modular Architecture',
      'HTTP Requests, REST APIs & Parsing JSON Responses',
      'Data Manipulation with Pandas DataFrames',
      'Scientific Computations with NumPy Arrays'
    ],
    revisions: [
      'Python Core Idioms & Built-in Modules Review',
      'Fast Revision: Data Structures & Comprehensions',
      'Full Python Certification / Exam Mock Assessment'
    ],
    practices: [
      'Mini Project: Build a CLI Task & Budget Tracker',
      'Web Scraping Challenge with BeautifulSoup & Requests',
      'Code Refactoring & Unit Testing with Pytest'
    ]
  }
};

export function generateDailyPlan(
  goalTitle: string,
  category: GoalCategory,
  totalHours: number,
  deadlineStr: string,
  difficulty: GoalDifficulty
): Task[] {
  const daysAvailable = Math.max(3, getDaysDifference(deadlineStr));
  const goalLower = goalTitle.toLowerCase();
  
  let curriculumKey = 'generic';
  if (goalLower.includes('java')) curriculumKey = 'java';
  else if (goalLower.includes('physic')) curriculumKey = 'physics';
  else if (goalLower.includes('python')) curriculumKey = 'python';

  const knowledge = CURATED_KNOWLEDGE[curriculumKey] || {
    milestones: [
      'Core Concept Foundations & Fundamentals Exploration',
      'Essential Building Blocks & Architecture Setup',
      'Key Mechanisms & Core Implementation Patterns',
      'Intermediate Features & Practical Synthesis',
      'Advanced Techniques & Optimization Strategies',
      'Edge Cases, Error Handling & Reliability Testing',
      'Real-World Case Study & Integrated Walkthrough',
      'Performance Tuning & Final Refinement'
    ],
    revisions: [
      'Key Takeaways & Conceptual Formula Flashcards',
      'Comprehensive End-to-End System Walkthrough',
      'Final Readiness Checklist & Knowledge Verification'
    ],
    practices: [
      'Hands-on Practical Lab Exercise & Assessment',
      'Timed Mock Test / Prototype Build Session',
      'Troubleshooting & Diagnostic Challenge'
    ]
  };

  const tasks: Task[] = [];
  const targetDays = Math.min(daysAvailable, 24);
  const minutesPerDay = Math.max(30, Math.round((totalHours * 60) / targetDays));

  // Determine schedule breakdown:
  // First 65% days = Learning milestones
  // 15% days = Practice sessions
  // 10% days = Revision
  // Final 10% days = Buffer / Rest & Final Readiness
  const milestoneDaysCount = Math.max(2, Math.floor(targetDays * 0.65));
  const practiceDaysCount = Math.max(1, Math.floor(targetDays * 0.15));
  const revisionDaysCount = Math.max(1, Math.floor(targetDays * 0.10));
  const bufferDaysCount = Math.max(1, targetDays - (milestoneDaysCount + practiceDaysCount + revisionDaysCount));

  let dayCounter = 1;

  // 1. Learning Milestones
  for (let i = 0; i < milestoneDaysCount; i++) {
    const title = knowledge.milestones[i % knowledge.milestones.length] || `Topic Milestone ${i + 1}: Deep Exploration`;
    const priority = i % 3 === 0 ? 'High' : 'Medium';
    tasks.push({
      id: `task-${Date.now()}-${dayCounter}`,
      goalId: '',
      dayNumber: dayCounter,
      dateStr: formatOffsetDate(dayCounter - 1),
      title: `Day ${dayCounter}: ${title}`,
      durationMinutes: minutesPerDay,
      priority,
      type: 'Learning',
      status: 'Pending',
      notes: 'Focus on understanding first principles before jumping to problem solving.'
    });
    dayCounter++;
  }

  // 2. Practice Sessions
  for (let i = 0; i < practiceDaysCount; i++) {
    const title = knowledge.practices[i % knowledge.practices.length] || `Practice Session ${i + 1}: Timed Sprint`;
    tasks.push({
      id: `task-${Date.now()}-${dayCounter}`,
      goalId: '',
      dayNumber: dayCounter,
      dateStr: formatOffsetDate(dayCounter - 1),
      title: `Day ${dayCounter}: [Practice] ${title}`,
      durationMinutes: Math.round(minutesPerDay * 1.1),
      priority: 'High',
      type: 'Practice',
      status: 'Pending',
      notes: 'Simulate realistic test conditions. Close all notes and reference materials.'
    });
    dayCounter++;
  }

  // 3. Revision Days
  for (let i = 0; i < revisionDaysCount; i++) {
    const title = knowledge.revisions[i % knowledge.revisions.length] || `Comprehensive Review ${i + 1}`;
    tasks.push({
      id: `task-${Date.now()}-${dayCounter}`,
      goalId: '',
      dayNumber: dayCounter,
      dateStr: formatOffsetDate(dayCounter - 1),
      title: `Day ${dayCounter}: [Revision] ${title}`,
      durationMinutes: Math.round(minutesPerDay * 0.9),
      priority: 'Medium',
      type: 'Revision',
      status: 'Pending',
      notes: 'Active recall and mind mapping. Revisit previously flagged mistakes.'
    });
    dayCounter++;
  }

  // 4. Buffer Days
  for (let i = 0; i < bufferDaysCount; i++) {
    tasks.push({
      id: `task-${Date.now()}-${dayCounter}`,
      goalId: '',
      dayNumber: dayCounter,
      dateStr: formatOffsetDate(dayCounter - 1),
      title: `Day ${dayCounter}: [Buffer & Rest] Safety Margin & Mental Readiness`,
      durationMinutes: Math.round(minutesPerDay * 0.5),
      priority: 'Low',
      type: 'Buffer',
      status: 'Pending',
      notes: 'Protected flex time. If ahead of schedule, use for restful recharge or optional bonus drills.'
    });
    dayCounter++;
  }

  return tasks;
}

export function recalculateAdaptiveSchedule(
  goal: Goal,
  missedTaskId: string
): {
  updatedGoal: Goal;
  explanation: string;
  previousDailyHours: number;
  newDailyHours: number;
  adjustedTaskCount: number;
} {
  const missedTask = goal.tasks.find(t => t.id === missedTaskId);
  if (!missedTask) {
    return {
      updatedGoal: goal,
      explanation: 'No adjustments required.',
      previousDailyHours: 1.5,
      newDailyHours: 1.5,
      adjustedTaskCount: 0
    };
  }

  // Mark this task as Missed
  const updatedTasks = goal.tasks.map(t => {
    if (t.id === missedTaskId) {
      return { ...t, status: 'Missed' as const };
    }
    return t;
  });

  // Find remaining pending tasks
  const pendingTasks = updatedTasks.filter(t => t.status === 'Pending');
  const missedMinutes = missedTask.durationMinutes;

  if (pendingTasks.length === 0) {
    return {
      updatedGoal: { ...goal, tasks: updatedTasks },
      explanation: "You missed this task, but you have no pending tasks left! Let's plan a quick catch-up sprint.",
      previousDailyHours: 1.5,
      newDailyHours: 2.0,
      adjustedTaskCount: 0
    };
  }

  // Redistribute missed minutes across upcoming pending tasks
  const addedMinutesPerTask = Math.ceil(missedMinutes / pendingTasks.length);
  const adjustedTasks = updatedTasks.map(t => {
    if (t.status === 'Pending') {
      return {
        ...t,
        durationMinutes: t.durationMinutes + addedMinutesPerTask,
        notes: `${t.notes ? t.notes + ' ' : ''}[Adaptive Recovery: +${addedMinutesPerTask}m redistributed from missed session]`
      };
    }
    return t;
  });

  const prevAverageMinutes = Math.round(
    goal.tasks.reduce((acc, t) => acc + t.durationMinutes, 0) / Math.max(1, goal.tasks.length)
  );
  const newAverageMinutes = Math.round(
    adjustedTasks.filter(t => t.status === 'Pending').reduce((acc, t) => acc + t.durationMinutes, 0) / Math.max(1, pendingTasks.length)
  );

  const prevHours = parseFloat((prevAverageMinutes / 60).toFixed(1));
  const newHours = parseFloat((newAverageMinutes / 60).toFixed(1));

  // Constructive, motivating explanation
  const dayName = missedTask.title.split(':')[0] || 'your previous target';
  const explanation = `You missed ${dayName}. To keep your deadline safe, I've redistributed the remaining ${missedMinutes} minutes gently across your ${pendingTasks.length} upcoming sessions (+${addedMinutesPerTask}m/day). No guilt, you're still on track to finish with confidence!`;

  const updatedGoal: Goal = {
    ...goal,
    tasks: adjustedTasks,
    status: newHours >= 3.0 ? 'High Pressure' : newHours >= 2.0 ? 'Falling Behind' : 'Comfortable'
  };

  return {
    updatedGoal,
    explanation,
    previousDailyHours: prevHours,
    newDailyHours: newHours,
    adjustedTaskCount: pendingTasks.length
  };
}
