import { NextResponse } from 'next/server';
import { getDB, persistDB } from '@/lib/db';
import { INITIAL_PROFILE } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-1';

    const db = await getDB();
    const profile = db.profiles[userId] || INITIAL_PROFILE;

    return NextResponse.json({
      success: true,
      database: 'connected',
      data: profile
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user-1', profile } = body;

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Missing profile' }, { status: 400 });
    }

    const db = await getDB();
    db.profiles[userId] = profile;
    await persistDB(db);

    return NextResponse.json({
      success: true,
      database: 'connected',
      data: profile,
      message: 'Profile saved to database.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save profile to database', details: String(error) },
      { status: 500 }
    );
  }
}
