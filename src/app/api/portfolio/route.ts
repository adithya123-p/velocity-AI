import { NextResponse } from 'next/server';
import { INITIAL_PROFILE } from '@/lib/mockData';
import { UserProfile } from '@/lib/types';

let serverProfile: UserProfile = { ...INITIAL_PROFILE };

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverProfile
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    serverProfile = {
      ...serverProfile,
      ...body
    };

    return NextResponse.json({
      success: true,
      data: serverProfile,
      message: 'Portfolio profile updated successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio profile', details: String(error) },
      { status: 500 }
    );
  }
}
