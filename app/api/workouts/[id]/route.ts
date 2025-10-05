/**
 * API Route: Single Workout Management
 * 
 * PATCH /api/workouts/[id] - Update workout
 * DELETE /api/workouts/[id] - Delete workout
 * GET /api/workouts/[id] - Get single workout
 * 
 * Requires authentication via Supabase Auth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

/**
 * GET handler - Fetch a single workout
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Fetch workout (RLS ensures user can only see their own)
    const sql = `
      SELECT 
        w.id,
        w.user_id,
        w.date_generated,
        w.workout_details,
        w.status,
        w.created_at,
        wl.notes
      FROM workouts w
      LEFT JOIN workout_logs wl ON w.id = wl.workout_id
      WHERE w.id = $1 AND w.user_id = $2
      LIMIT 1;
    `;

    const result = await query(sql, [id, user.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workout: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler - Update a workout
 * 
 * Expected body:
 * {
 *   "status"?: "pending" | "completed" | "skipped",
 *   "notes"?: string,
 *   "workoutDetails"?: object
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status, notes, workoutDetails } = body;

    // Build dynamic UPDATE query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (workoutDetails) {
      updates.push(`workout_details = $${paramCount++}`);
      values.push(JSON.stringify(workoutDetails));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add WHERE clause parameters
    values.push(id);
    values.push(user.id);

    const sql = `
      UPDATE workouts 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount}
      RETURNING id, user_id, date_generated, workout_details, status, created_at;
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found or unauthorized' },
        { status: 404 }
      );
    }

    // If notes are provided, update the workout_logs table
    if (notes !== undefined) {
      const notesSql = `
        UPDATE workout_logs 
        SET notes = $1 
        WHERE workout_id = $2 AND user_id = $3;
      `;
      await query(notesSql, [notes, id, user.id]);
    }

    return NextResponse.json({
      success: true,
      message: 'Workout updated successfully',
      workout: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Delete a workout
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Delete workout (CASCADE will delete related workout_logs)
    const sql = `
      DELETE FROM workouts 
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await query(sql, [id, user.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Workout deleted successfully',
      deletedId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
