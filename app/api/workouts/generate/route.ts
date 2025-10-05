/**
 * API Route: Generate Workout
 * 
 * POST /api/workouts/generate
 * 
 * Generates a new Hyrox workout based on user's fitness level and saves it to the database.
 * Returns the complete workout details for immediate display.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateWorkout, isValidFitnessLevel } from '@/lib/workoutGenerator';
import { FitnessLevel } from '@/lib/types';

/**
 * POST handler for workout generation
 * 
 * Expected body:
 * {
 *   "fitnessLevel": "beginner" | "intermediate" | "advanced",
 *   "userId": number (optional, defaults to 1 for MVP)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { fitnessLevel, userId = 1 } = body;

    // Validate fitness level
    if (!fitnessLevel || !isValidFitnessLevel(fitnessLevel)) {
      return NextResponse.json(
        { 
          error: 'Invalid fitness level. Must be: beginner, intermediate, or advanced' 
        },
        { status: 400 }
      );
    }

    // Generate workout using the algorithm
    const workoutDetails = generateWorkout(fitnessLevel as FitnessLevel, userId);

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
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating workout:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate workout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - returns info about the generate endpoint
 * Useful for documentation/testing
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/workouts/generate',
    method: 'POST',
    description: 'Generate a new Hyrox workout based on fitness level',
    requiredFields: {
      fitnessLevel: 'beginner | intermediate | advanced',
    },
    optionalFields: {
      userId: 'number (defaults to 1 for MVP)',
    },
    exampleRequest: {
      fitnessLevel: 'intermediate',
      userId: 1,
    },
  });
}
