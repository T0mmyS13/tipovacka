import { NextRequest, NextResponse } from 'next/server';
import { LiveSportsDataService } from '@/lib/live-sports-data';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

const liveDataService = new LiveSportsDataService();

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    const user = token ? verifyToken(token) : null;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Starting manual live data update...');
    await liveDataService.updateLiveTips();

    return NextResponse.json({
      success: true,
      message: 'Live data updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Live data update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update live data' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking last update time
export async function GET() {
  try {
    const lastUpdate = await prisma.settings.findUnique({
      where: { key: 'last_live_update' }
    });

    return NextResponse.json({
      success: true,
      data: {
        lastUpdate: lastUpdate?.value || 'Never',
        nextScheduledUpdate: getNextUpdateTime()
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get update status' },
      { status: 500 }
    );
  }
}

function getNextUpdateTime(): string {
  const now = new Date();
  const next = new Date(now);

  // Schedule next update for 6 AM tomorrow
  next.setDate(next.getDate() + 1);
  next.setHours(6, 0, 0, 0);

  return next.toISOString();
}
