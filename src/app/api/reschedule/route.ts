import { NextResponse } from 'next/server';
import { recalculateAdaptiveSchedule } from '@/lib/aiPlanner';
import { Goal } from '@/lib/types';
import { INITIAL_GOALS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let targetGoal = body.goal as Goal | undefined;
    if (!targetGoal && body.goalId) {
      targetGoal = INITIAL_GOALS.find((g) => g.id === body.goalId);
    }
    const missedTaskId = body.missedTaskId || body.taskId;

    if (!targetGoal || !missedTaskId) {
      return NextResponse.json(
        { success: false, error: 'Goal (or valid goalId) and missedTaskId are required for adaptive rescheduling' },
        { status: 400 }
      );
    }

    const result = recalculateAdaptiveSchedule(targetGoal, missedTaskId);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Adaptive reschedule executed successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Adaptive rescheduling failed', details: String(error) },
      { status: 500 }
    );
  }
}
