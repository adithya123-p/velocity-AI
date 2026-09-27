import { NextResponse } from 'next/server';
import { calculatePressureAnalysis, getAllGoalScenarios } from '@/lib/consequenceEngine';
import { Goal } from '@/lib/types';

import { INITIAL_GOALS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let targetGoal = body.goal as Goal | undefined;
    if (!targetGoal && body.goalId) {
      targetGoal = INITIAL_GOALS.find((g) => g.id === body.goalId);
    }
    const customDelay = body.customDelay ?? body.daysSkipped ?? 5;

    if (!targetGoal || !targetGoal.deadline || !targetGoal.totalHours) {
      return NextResponse.json(
        { success: false, error: 'Invalid goal object or goalId passed to Consequence Engine' },
        { status: 400 }
      );
    }

    const scenarios = getAllGoalScenarios(targetGoal, customDelay);
    const pressureAnalysis = calculatePressureAnalysis(targetGoal);

    return NextResponse.json({
      success: true,
      data: {
        goalId: targetGoal.id,
        goalTitle: targetGoal.title,
        pressureAnalysis,
        scenarios
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Consequence simulation failed', details: String(error) },
      { status: 500 }
    );
  }
}
