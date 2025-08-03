// Daily Data Update Scheduler
// This runs automatically to fetch fresh sports data every day

import { LiveSportsDataService } from '@/lib/live-sports-data';
import { prisma } from '@/lib/prisma';

const liveDataService = new LiveSportsDataService();

export class DataScheduler {
  private static instance: DataScheduler;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): DataScheduler {
    if (!DataScheduler.instance) {
      DataScheduler.instance = new DataScheduler();
    }
    return DataScheduler.instance;
  }

  /**
   * Start the daily data update scheduler
   */
  startScheduler(): void {
    console.log('Starting daily data update scheduler...');

    // Run immediately on startup
    this.runDailyUpdate();

    // Schedule to run every 4 hours
    this.updateInterval = setInterval(async () => {
      await this.runDailyUpdate();
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds

    console.log('Data scheduler started - updates every 4 hours');
  }

  /**
   * Stop the scheduler
   */
  stopScheduler(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('Data scheduler stopped');
    }
  }

  /**
   * Run the daily update process
   */
  private async runDailyUpdate(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Starting scheduled data update...`);

      // Update live tips
      await liveDataService.updateLiveTips();

      // Update last update timestamp
      await prisma.settings.upsert({
        where: { key: 'last_live_update' },
        update: { value: new Date().toISOString() },
        create: { key: 'last_live_update', value: new Date().toISOString() }
      });

      // Update next scheduled update
      const nextUpdate = new Date();
      nextUpdate.setHours(nextUpdate.getHours() + 4);

      await prisma.settings.upsert({
        where: { key: 'next_scheduled_update' },
        update: { value: nextUpdate.toISOString() },
        create: { key: 'next_scheduled_update', value: nextUpdate.toISOString() }
      });

      console.log(`[${new Date().toISOString()}] Scheduled data update completed successfully`);

    } catch (error) {
      console.error(`[${new Date().toISOString()}] Scheduled data update failed:`, error);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): { running: boolean; nextUpdate?: string } {
    return {
      running: this.updateInterval !== null,
      nextUpdate: this.updateInterval ?
        new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() :
        undefined
    };
  }
}

// Auto-start scheduler in production
if (process.env.NODE_ENV === 'production') {
  const scheduler = DataScheduler.getInstance();
  scheduler.startScheduler();
}

export default DataScheduler;
