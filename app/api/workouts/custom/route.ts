/**
 * API Route: Custom Workouts
 * 
 * POST /api/workouts/custom - Save a custom user-created workout
 * GET /api/workouts/custom - Get user's custom workouts
 * PUT /api/workouts/custom/[id] - Update a custom workout
 * DELETE /api/workouts/custom/[id] - Delete a custom workout
 * 
 * Handles user-created workouts with source: 'user_created'
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST - Save a custom workout
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workout_name, description, tags, workout_details } = body;

    // Validate required fields
    if (!workout_name || !workout_details) {
      return NextResponse.json(
        { error: 'Workout name and details are required' },
        { status: 400 }
      );
    }

    // Save custom workout
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        workout_name,
        description: description || null,
        tags: tags || [],
        workout_details,
        source: 'user_created',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving custom workout:', error);
      return NextResponse.json(
        { error: 'Failed to save workout' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workout: data
    }, { status: 201 });

  } catch (error) {
    console.error('Error in custom workout API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get user's custom workouts
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's custom workouts
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('source', 'user_created')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching custom workouts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workouts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workouts: data || []
    });

  } catch (error) {
    console.error('Error in custom workout API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
