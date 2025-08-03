import { NextRequest, NextResponse } from 'next/server';
import { LiveSportsDataService } from '@/lib/live-sports-data';

const liveDataService = new LiveSportsDataService();

export async function POST() {
  try {
    console.log('Manual live data update triggered...');

    // This will use your real API keys to fetch actual data
    await liveDataService.updateLiveTips();

    return NextResponse.json({
      success: true,
      message: 'Live data updated successfully with real API data',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Live data update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update live data: ' + error.message },
      { status: 500 }
    );
  }
}
