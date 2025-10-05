/**
 * Profile API Route
 * 
 * GET: Fetch user profile and preferences
 * PATCH: Update user profile and preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { query } from '@/lib/db';

/**
 * GET /api/profile
 * Fetches the authenticated user's profile
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user profile
    const result = await query(
      `SELECT 
        id,
        user_id,
        fitness_level,
        goals,
        default_mood,
        default_intensity,
        default_duration,
        excluded_stations,
        created_at,
        updated_at
      FROM user_profiles
      WHERE user_id = $1`,
      [user.id]
    );

    // If no profile exists, return defaults
    if (result.rows.length === 0) {
      return NextResponse.json({
        profile: null,
        defaults: {
          fitness_level: 'intermediate',
          goals: '',
          default_mood: null,
          default_intensity: null,
          default_duration: 60,
          excluded_stations: [],
        }
      });
    }

    return NextResponse.json({
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Updates the authenticated user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      fitness_level,
      goals,
      default_mood,
      default_intensity,
      default_duration,
      excluded_stations,
    } = body;

    // Check if profile exists
    const existingProfile = await query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [user.id]
    );

    if (existingProfile.rows.length === 0) {
      // Create new profile
      const result = await query(
        `INSERT INTO user_profiles (
          user_id,
          fitness_level,
          goals,
          default_mood,
          default_intensity,
          default_duration,
          excluded_stations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          user.id,
          fitness_level || 'intermediate',
          goals || '',
          default_mood || null,
          default_intensity || null,
          default_duration || 60,
          JSON.stringify(excluded_stations || []),
        ]
      );

      return NextResponse.json({
        profile: result.rows[0],
        message: 'Profile created successfully'
      });
    } else {
      // Update existing profile
      const result = await query(
        `UPDATE user_profiles 
        SET 
          fitness_level = COALESCE($2, fitness_level),
          goals = COALESCE($3, goals),
          default_mood = $4,
          default_intensity = $5,
          default_duration = COALESCE($6, default_duration),
          excluded_stations = COALESCE($7, excluded_stations),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        RETURNING *`,
        [
          user.id,
          fitness_level,
          goals,
          default_mood,
          default_intensity,
          default_duration,
          excluded_stations ? JSON.stringify(excluded_stations) : null,
        ]
      );

      return NextResponse.json({
        profile: result.rows[0],
        message: 'Profile updated successfully'
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

