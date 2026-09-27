import { NextResponse } from 'next/server';
import { getDB, persistDB } from '@/lib/db';
import { Goal } from '@/lib/types';
import { generateDailyPlan } from '@/lib/aiPlanner';
import { calculatePressureAnalysis } from '@/lib/consequenceEngine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-1';

    const db = await getDB();
    const userGoals = db.goals[userId] || db.goals['demo-user-1'] || [];

    return NextResponse.json({
      success: true,
      database: 'connected',
      data: userGoals,
      count: userGoals.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve goals', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, deadline, totalHours, difficulty, description, userId = 'demo-user-1' } = body;

    if (!title || !deadline || !totalHours) {
      return NextResponse.json(
        { success: false, error: 'Missing required goal fields (title, deadline, totalHours)' },
        { status: 400 }
      );
    }

    const generatedTasks = generateDailyPlan(
      title,
      category || 'Other',
      Number(totalHours),
      deadline,
      difficulty || 'Medium'
    );

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      category: category || 'Other',
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      totalHours: Number(totalHours),
      completedHours: 0,
      difficulty: difficulty || 'Medium',
      description: description || '',
      status: 'Comfortable',
      tasks: generatedTasks,
      createdAt: new Date().toISOString()
    };

    // Recalculate status with consequence engine
    const analysis = calculatePressureAnalysis(newGoal);
    newGoal.status = analysis.currentStatus;

    const db = await getDB();
    if (!db.goals[userId]) {
      db.goals[userId] = [];
    }
    db.goals[userId].unshift(newGoal);
    await persistDB(db);

    return NextResponse.json({
      success: true,
      database: 'connected',
      data: newGoal,
      message: 'Goal created and saved to persistent database successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create goal', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user-1', goals } = body;

    if (!Array.isArray(goals)) {
      return NextResponse.json(
        { success: false, error: 'Invalid goals format. Must be an array.' },
        { status: 400 }
      );
    }

    const db = await getDB();
    db.goals[userId] = goals;
    await persistDB(db);

    return NextResponse.json({
      success: true,
      database: 'connected',
      message: 'Goals updated and persisted to database.',
      count: goals.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update goals in database', details: String(error) },
      { status: 500 }
    );
  }
}
