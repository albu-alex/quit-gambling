/**
 * Streak Calculator - Business logic for streak calculations
 */

import { MilestoneAchievement } from '../types';

export class StreakCalculator {
  static MILESTONES: MilestoneAchievement[] = [
    { days: 7, badge: '🔥', title: '7 Days Strong' },
    { days: 14, badge: '💪', title: '2 Weeks Strong' },
    { days: 30, badge: '🏆', title: 'One Month Free' },
    { days: 60, badge: '👑', title: 'Two Months King' },
    { days: 100, badge: '⭐', title: 'Century Streak' },
    { days: 365, badge: '🎉', title: 'One Year Victory' },
  ];

  /**
   * Check if user should be prompted for daily check-in
   */
  static shouldPromptCheckIn(lastCheckInDate: string | null): boolean {
    if (!lastCheckInDate) return true;

    const last = new Date(lastCheckInDate);
    const today = new Date();

    return last.toDateString() !== today.toDateString();
  }

  /**
   * Get the next milestone for a given streak
   */
  static getNextMilestone(currentDays: number): MilestoneAchievement | null {
    const nextMilestone = this.MILESTONES.find((m) => m.days > currentDays);
    return nextMilestone || null;
  }

  /**
   * Get milestone for exact day count
   */
  static getMilestoneAtDay(days: number): MilestoneAchievement | null {
    return this.MILESTONES.find((m) => m.days === days) || null;
  }

  /**
   * Get all unlocked milestones up to current streak
   */
  static getUnlockedMilestones(currentDays: number): MilestoneAchievement[] {
    return this.MILESTONES.filter((m) => m.days <= currentDays);
  }

  /**
   * Calculate progress to next milestone as percentage
   */
  static getProgressToNextMilestone(currentDays: number): {
    current: number;
    target: number;
    percentage: number;
  } | null {
    const nextMilestone = this.getNextMilestone(currentDays);
    if (!nextMilestone) return null;

    const lastMilestone = [...this.MILESTONES]
      .reverse()
      .find((m) => m.days < currentDays);

    const rangeStart = lastMilestone?.days ?? 0;
    const rangeEnd = nextMilestone.days;
    const progress = currentDays - rangeStart;
    const total = rangeEnd - rangeStart;

    return {
      current: progress,
      target: total,
      percentage: Math.min(100, (progress / total) * 100),
    };
  }

  /**
   * Generate motivational message based on streak
   */
  static getMotivationalMessage(streak: number): string {
    if (streak === 0) {
      return 'Every journey begins with a single day. You\'ve got this! 💪';
    } else if (streak < 7) {
      return `You're on day ${streak}. Keep the momentum going!`;
    } else if (streak < 30) {
      return `${streak} days free! You're building real strength.`;
    } else if (streak < 100) {
      return `${streak} days! You're a warrior. Don't break it now.`;
    } else {
      return `${streak} days! You're unstoppable. Keep this going forever.`;
    }
  }

  /**
   * Calculate money saved (rough estimation)
   * Based on user's reported monthly spend
   */
  static calculateMoneySaved(streakDays: number, monthlySpend: number): number {
    const dailyAverage = monthlySpend / 30;
    return Math.round(dailyAverage * streakDays);
  }
}
