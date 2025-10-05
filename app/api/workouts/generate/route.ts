/**
 * API Route: Generate Workout
 * 
 * POST /api/workouts/generate
 * 
 * Generates a new Hyrox workout based on user's fitness level and saves it to the database.
 * Returns the complete workout details for immediate display.
 * 
 * Requires authentication via Supabase Auth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateWorkout, isValidFitnessLevel } from '@/lib/workoutGenerator';
import { FitnessLevel } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

/**
 * POST handler for workout generation (SESSION 2 Enhanced)
 * 
 * Expected body:
 * {
 *   "fitnessLevel": "beginner" | "intermediate" | "advanced",
 *   "mood"?: "fresh" | "normal" | "tired" | "exhausted",
 *   "intensity"?: "light" | "moderate" | "hard" | "beast",
 *   "duration"?: 30 | 45 | 60 | 90,
 *   "excludeStations"?: string[],
 *   "surpriseMe"?: boolean
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
          details: 'You must be logged in to generate workouts'
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
    const { 
      fitnessLevel, 
      mood, 
      intensity, 
      duration, 
      excludeStations, 
      surpriseMe 
    } = body;
    const userId = user.id; // Use authenticated user's UUID

    // Validate fitness level
    if (!fitnessLevel || !isValidFitnessLevel(fitnessLevel)) {
      return NextResponse.json(
        { 
          error: 'Invalid fitness level. Must be: beginner, intermediate, or advanced' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Generate workout using the AI-enhanced algorithm
    const workoutDetails = await generateWorkout(
      fitnessLevel as FitnessLevel, 
      userId,
      {
        mood,
        intensity,
        duration,
        excludeStations,
        surpriseMe,
      }
    );

    // Save workout to database
    const sql = `
      INSERT INTO workouts (user_id, date_generated, workout_details, status)
      VALUES ($1, NOW(), $2, $3)
      RETURNING id, user_id, date_generated, workout_details, status, created_at;
    `;

    const values = [
      userId,
      JSON.stringify(workoutDetails),
      'pending', // Initial status
    ];

    const result = await query(sql, values);

    // Return the created workout
    const workout = result.rows[0];

    return NextResponse.json({
      success: true,
      workout: {
        id: workout.id,
        userId: workout.user_id,
        dateGenerated: workout.date_generated,
        workoutDetails: workout.workout_details,
        status: workout.status,
        createdAt: workout.created_at,
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
    console.error('Error generating workout:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate workout',
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
 * GET handler - returns info about the generate endpoint
 * Useful for documentation/testing
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/workouts/generate',
    method: 'POST',
    description: 'Generate a smart, adaptive Hyrox workout (SESSION 2 Enhanced)',
    authentication: 'Required - Supabase session',
    requiredFields: {
      fitnessLevel: 'beginner | intermediate | advanced',
    },
    optionalFields: {
      mood: 'fresh | normal | tired | exhausted (default: normal)',
      intensity: 'light | moderate | hard | beast (default: moderate)',
      duration: '30 | 45 | 60 | 90 minutes (default: 60)',
      excludeStations: 'Array of station names to exclude',
      surpriseMe: 'boolean - randomize mood and intensity',
    },
    exampleRequest: {
      fitnessLevel: 'intermediate',
      mood: 'fresh',
      intensity: 'hard',
      duration: 60,
      excludeStations: ['Wall Balls'],
    },
    exampleSurpriseMe: {
      fitnessLevel: 'intermediate',
      surpriseMe: true,
    },
  });
}
