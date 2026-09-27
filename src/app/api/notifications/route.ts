import { NextResponse } from 'next/server';
import { getDB, persistDB } from '@/lib/db';
import { INITIAL_NOTIFICATIONS } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-1';

    const db = await getDB();
    const notifs = db.notifications[userId] || INITIAL_NOTIFICATIONS;

    return NextResponse.json({
      success: true,
      database: 'connected',
      data: notifs,
      count: notifs.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notifications', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user-1', notifications } = body;

    const db = await getDB();
    db.notifications[userId] = notifications || [];
    await persistDB(db);

    return NextResponse.json({
      success: true,
      database: 'connected',
      message: 'Notifications updated in database.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save notifications', details: String(error) },
      { status: 500 }
    );
  }
}
