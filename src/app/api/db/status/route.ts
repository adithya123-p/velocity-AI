import { NextResponse } from 'next/server';
import { getDBStats } from '@/lib/db';
import { firebaseConfig } from '@/lib/firebaseConfig';

export async function GET() {
  try {
    const stats = await getDBStats();
    return NextResponse.json({
      success: true,
      provider: 'Google Firebase Cloud Firestore',
      firebase: {
        status: 'connected',
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket,
        appId: firebaseConfig.appId,
        measurementId: firebaseConfig.measurementId
      },
      localSyncStore: stats
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database check failed', details: String(error) },
      { status: 500 }
    );
  }
}
