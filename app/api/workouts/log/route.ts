/**
 * API Route: Log Workout
 * 
 * POST /api/workouts/log
 * 
 * Logs performance data for a completed workout and saves it to the workout_logs table.
 * Updates the workout status to 'completed' in the workouts table.
 * 
 * Requires authentication via Supabase Auth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PerformanceData } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

/**
 * POST handler for logging workout results
 * 
 * Expected body:
 * {
 *   "workoutId": number,
 *   "performanceData": {
 *     "stations": [{ "name": string, "time": "MM:SS", "order": number }],
 *     "runs": [{ "distance": string, "time": "MM:SS", "order": number }],
 *     "overallTime": "HH:MM:SS"
 *   },
 *   "notes": string (optional)
 * }
 * 
 * Authentication: Required (via Supabase session)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if any database connection string is available
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Get authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          details: 'You must be logged in to log workouts'
        },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { workoutId, performanceData, notes = null } = body;
    const userId = user.id; // Use authenticated user's UUID

    // Validate required fields
    if (!workoutId) {
      return NextResponse.json(
        { error: 'Workout ID is required' },
        { status: 400 }
      );
    }

    if (!performanceData || !performanceData.stations || !performanceData.runs) {
      return NextResponse.json(
        { error: 'Performance data is incomplete. Must include stations and runs.' },
        { status: 400 }
      );
    }

    // Calculate overall time in seconds (for sorting/analytics)
    const overallTimeSeconds = convertTimeToSeconds(performanceData.overallTime);

    // Insert workout log into database
    const insertSql = `
      INSERT INTO workout_logs (
        workout_id, 
        user_id, 
        date_completed, 
        performance_data, 
        overall_time, 
        notes
      )
      VALUES ($1, $2, NOW(), $3, $4, $5)
      RETURNING id, workout_id, user_id, date_completed, performance_data, overall_time, notes, created_at;
    `;

    const insertValues = [
      workoutId,
      userId,
      JSON.stringify(performanceData),
      overallTimeSeconds,
      notes,
    ];

    const insertResult = await query(insertSql, insertValues);
    const workoutLog = insertResult.rows[0];

    // Update workout status to 'completed'
    const updateSql = `
      UPDATE workouts 
      SET status = $1 
      WHERE id = $2
      RETURNING id, status;
    `;

    const updateValues = ['completed', workoutId];
    const updateResult = await query(updateSql, updateValues);

    if (updateResult.rows.length === 0) {
      console.warn(`Workout ${workoutId} not found during status update`);
    }

    // Return success response with logged workout data
    return NextResponse.json({
      success: true,
      message: 'Workout logged successfully!',
      workoutLog: {
        id: workoutLog.id,
        workoutId: workoutLog.workout_id,
        userId: workoutLog.user_id,
        dateCompleted: workoutLog.date_completed,
        performanceData: workoutLog.performance_data,
        overallTime: workoutLog.overall_time,
        notes: workoutLog.notes,
        createdAt: workoutLog.created_at,
      },
    }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Error logging workout:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to log workout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Converts time string (HH:MM:SS or MM:SS) to total seconds
 * 
 * @param timeString - Time in format "HH:MM:SS" or "MM:SS"
 * @returns Total seconds as integer
 */
function convertTimeToSeconds(timeString: string): number {
  if (!timeString) return 0;

  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return (hours * 3600) + (minutes * 60) + seconds;
  } else if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return (minutes * 60) + seconds;
  }

  return 0;
}

/**
 * GET handler - returns info about the log endpoint
 * Useful for documentation/testing
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/workouts/log',
    method: 'POST',
    description: 'Log performance data for a completed workout (requires authentication)',
    authentication: 'Required - Supabase session',
    requiredFields: {
      workoutId: 'number',
      performanceData: {
        stations: 'Array<{ name: string, time: string, order: number }>',
        runs: 'Array<{ distance: string, time: string, order: number }>',
        overallTime: 'string (HH:MM:SS or MM:SS)',
      },
    },
    optionalFields: {
      notes: 'string',
    },
    exampleRequest: {
      workoutId: 1,
      performanceData: {
        stations: [
          { name: 'SkiErg', time: '3:45', order: 1 },
          { name: 'Sled Push', time: '1:20', order: 2 },
        ],
        runs: [
          { distance: '1km', time: '4:30', order: 0 },
          { distance: '1km', time: '4:35', order: 2 },
        ],
        overallTime: '75:30',
      },
      notes: 'Felt strong today!',
    },
  });
}
