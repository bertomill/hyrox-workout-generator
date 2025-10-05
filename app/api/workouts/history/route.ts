/**
 * API Route: Workout History ^
 * 
 * GET /api/workouts/history ^
 * 
 * Retrieves all logged workouts for a user, ordered by most recent first.!
 * Includes workout details and performance data for progress tracking. ~
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET handler for fetching workout history `
 * 
 * Query parameters:
 * - userId: number (optional, defaults to 1 for MVP)
 * - limit: number (optional, defaults to 50)
 * - offset: number (optional, defaults to 0, for pagination) `
 */
export async function GET(request: NextRequest) {
  try {
    // Check if any database connection string is available `
    const hasDbConfig = process.env.DATABASE_URL || 
                        process.env.POSTGRES_URL_NON_POOLING || 
                        process.env.POSTGRES_URL;
    
    if (!hasDbConfig) {
      console.error('No database configuration found');
      return NextResponse.json(
        { 
          error: 'Database configuration missing',
          details: 'No database connection string found in environment variables'
        },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch workout logs with associated workout details
    const sql = `
      SELECT 
        wl.id,
        wl.workout_id,
        wl.user_id,
        wl.date_completed,
        wl.performance_data,
        wl.overall_time,
        wl.notes,
        wl.created_at,
        w.workout_details,
        w.date_generated,
        w.status
      FROM workout_logs wl
      JOIN workouts w ON wl.workout_id = w.id
      WHERE wl.user_id = $1
      ORDER BY wl.date_completed DESC
      LIMIT $2 OFFSET $3;
    `;

    const values = [userId, limit, offset];
    const result = await query(sql, values);

    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total
      FROM workout_logs
      WHERE user_id = $1;
    `;

    const countResult = await query(countSql, [userId]);
    const totalCount = parseInt(countResult.rows[0]?.total || '0');

    // Format the results
    const workouts = result.rows.map((row) => ({
      id: row.id,
      workoutId: row.workout_id,
      userId: row.user_id,
      dateCompleted: row.date_completed,
      performanceData: row.performance_data,
      overallTime: row.overall_time,
      overallTimeFormatted: formatSecondsToTime(row.overall_time),
      notes: row.notes,
      createdAt: row.created_at,
      workoutDetails: row.workout_details,
      dateGenerated: row.date_generated,
      status: row.status,
    }));

    // Calculate summary statistics
    const stats = calculateStats(workouts);

    return NextResponse.json({
      success: true,
      workouts,
      stats,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Error fetching workout history:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch workout history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Formats seconds to HH:MM:SS or MM:SS string
 */
function formatSecondsToTime(totalSeconds: number | null): string {
  if (!totalSeconds) return '00:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Calculates summary statistics from workout history
 */
function calculateStats(workouts: any[]) {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      averageTime: null,
      bestTime: null,
      recentStreak: 0,
    };
  }

  // Total workouts
  const totalWorkouts = workouts.length;

  // Average time (in seconds)
  const validTimes = workouts.filter(w => w.overallTime).map(w => w.overallTime);
  const averageTime = validTimes.length > 0
    ? Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length)
    : null;

  // Best time (lowest)
  const bestTime = validTimes.length > 0
    ? Math.min(...validTimes)
    : null;

  // Calculate recent streak (consecutive days with workouts)
  const recentStreak = calculateStreak(workouts);

  return {
    totalWorkouts,
    averageTime,
    averageTimeFormatted: averageTime ? formatSecondsToTime(averageTime) : null,
    bestTime,
    bestTimeFormatted: bestTime ? formatSecondsToTime(bestTime) : null,
    recentStreak,
  };
}

/**
 * Calculates workout streak (consecutive days)
 */
function calculateStreak(workouts: any[]): number {
  if (workouts.length === 0) return 0;

  const dates = workouts
    .map(w => new Date(w.dateCompleted).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Sort desc

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Check if most recent workout is today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) {
    return 0; // Streak broken
  }

  // Count consecutive days
  let currentDate = new Date();
  for (const date of dates) {
    const workoutDate = new Date(date);
    const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / 86400000);
    
    if (daysDiff <= streak) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }

  return streak;
}
