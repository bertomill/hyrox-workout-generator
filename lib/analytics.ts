/**
 * Analytics Utilities
 * 
 * Functions for calculating performance metrics, detecting PRs,
 * and preparing data for visualizations.
 */

export interface WorkoutAnalytics {
  id: number;
  dateCompleted: string;
  overallTime: number; // in seconds
  overallTimeFormatted: string;
  fitnessLevel: string;
  performanceData?: {
    stations: Array<{ name: string; time: string; order: number }>;
    runs: Array<{ distance: string; time: string; order: number }>;
  };
}

export interface PersonalRecord {
  type: 'overall' | 'station' | 'run';
  name: string;
  time: number;
  timeFormatted: string;
  achievedAt: string;
  workoutId: number;
  improvement?: number; // seconds improved from previous PR
}

export interface TrendDataPoint {
  date: string;
  time: number; // in seconds
  timeFormatted: string;
  workoutId: number;
  fitnessLevel: string;
}

/**
 * Convert time string (MM:SS or HH:MM:SS) to seconds
 */
export function timeToSeconds(timeString: string): number {
  if (!timeString) return 0;
  
  const parts = timeString.split(':').map(p => parseInt(p, 10));
  
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
}

/**
 * Convert seconds to formatted time string
 */
export function secondsToTime(seconds: number): string {
  if (!seconds || seconds === 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Detect Personal Records from workout history
 */
export function detectPersonalRecords(workouts: WorkoutAnalytics[]): PersonalRecord[] {
  if (!workouts || workouts.length === 0) return [];
  
  const records: PersonalRecord[] = [];
  
  // Sort by date (oldest first) to track progression
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime()
  );
  
  // Track best overall time
  let bestOverallTime = Infinity;
  
  sortedWorkouts.forEach((workout) => {
    if (workout.overallTime < bestOverallTime) {
      const improvement = bestOverallTime === Infinity ? 0 : bestOverallTime - workout.overallTime;
      
      records.push({
        type: 'overall',
        name: 'Overall Time',
        time: workout.overallTime,
        timeFormatted: workout.overallTimeFormatted,
        achievedAt: workout.dateCompleted,
        workoutId: workout.id,
        improvement: improvement > 0 ? improvement : undefined,
      });
      
      bestOverallTime = workout.overallTime;
    }
  });
  
  // Track best station times
  const stationBestTimes: Record<string, { time: number; workout: WorkoutAnalytics }> = {};
  
  sortedWorkouts.forEach((workout) => {
    workout.performanceData?.stations?.forEach((station) => {
      const stationTime = timeToSeconds(station.time);
      
      if (!stationBestTimes[station.name] || stationTime < stationBestTimes[station.name].time) {
        const improvement = stationBestTimes[station.name] 
          ? stationBestTimes[station.name].time - stationTime 
          : 0;
        
        stationBestTimes[station.name] = { time: stationTime, workout };
        
        records.push({
          type: 'station',
          name: station.name,
          time: stationTime,
          timeFormatted: station.time,
          achievedAt: workout.dateCompleted,
          workoutId: workout.id,
          improvement: improvement > 0 ? improvement : undefined,
        });
      }
    });
  });
  
  // Return only the most recent/best records (deduplicate)
  const uniqueRecords = new Map<string, PersonalRecord>();
  
  // Reverse to keep the latest PRs
  records.reverse().forEach((record) => {
    const key = `${record.type}-${record.name}`;
    if (!uniqueRecords.has(key)) {
      uniqueRecords.set(key, record);
    }
  });
  
  return Array.from(uniqueRecords.values()).sort((a, b) => 
    new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
  );
}

/**
 * Prepare trend data for charts (last N workouts)
 */
export function prepareTrendData(workouts: WorkoutAnalytics[], limit: number = 10): TrendDataPoint[] {
  if (!workouts || workouts.length === 0) return [];
  
  // Sort by date (newest first) and take the last N
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime())
    .slice(0, limit)
    .reverse(); // Reverse to show oldest to newest in chart
  
  return recentWorkouts.map((workout) => ({
    date: new Date(workout.dateCompleted).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    time: workout.overallTime,
    timeFormatted: workout.overallTimeFormatted,
    workoutId: workout.id,
    fitnessLevel: workout.fitnessLevel,
  }));
}

/**
 * Calculate improvement percentage between first and last workout
 */
export function calculateImprovement(workouts: WorkoutAnalytics[]): {
  percentage: number;
  secondsImproved: number;
  direction: 'improved' | 'declined' | 'neutral';
} {
  if (!workouts || workouts.length < 2) {
    return { percentage: 0, secondsImproved: 0, direction: 'neutral' };
  }
  
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime()
  );
  
  const firstTime = sorted[0].overallTime;
  const lastTime = sorted[sorted.length - 1].overallTime;
  
  const secondsImproved = firstTime - lastTime;
  const percentage = (secondsImproved / firstTime) * 100;
  
  let direction: 'improved' | 'declined' | 'neutral' = 'neutral';
  if (secondsImproved > 0) direction = 'improved';
  else if (secondsImproved < 0) direction = 'declined';
  
  return {
    percentage: Math.abs(percentage),
    secondsImproved: Math.abs(secondsImproved),
    direction,
  };
}

/**
 * Get current PRs (best times)
 */
export function getCurrentPRs(workouts: WorkoutAnalytics[]): {
  overall?: PersonalRecord;
  stations: PersonalRecord[];
} {
  const allPRs = detectPersonalRecords(workouts);
  
  const overall = allPRs.find(pr => pr.type === 'overall');
  const stations = allPRs.filter(pr => pr.type === 'station').slice(0, 5); // Top 5 most recent
  
  return { overall, stations };
}
