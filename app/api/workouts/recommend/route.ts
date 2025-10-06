/**
 * GET handler for workout type recommendations
 * 
 * Analyzes recent workout patterns and suggests appropriate workout types
 * based on frequency targets:
 * - Recovery: 1 in 7 days (14.3%)
 * - Long Run: 1 in 4 days (25%)
 * 
 * Authentication: Required (via Supabase session)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRecommendedWorkoutType } from '@/lib/workoutGenerator';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated for recommendations:', user.email);

    // Get workout type recommendation
    const recommendedType = await getRecommendedWorkoutType(user.id);

    // Get additional context about recent workouts
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const { data: recentWorkouts, error: workoutError } = await supabase
      .from('workouts')
      .select('workout_details, created_at')
      .eq('user_id', user.id)
      .gte('created_at', fourteenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (workoutError) {
      console.error('Error fetching recent workouts:', workoutError);
    }

    // Analyze patterns for context
    let analysis = {
      totalWorkouts: recentWorkouts?.length || 0,
      recoveryCount: 0,
      longRunCount: 0,
      standardCount: 0,
      recoveryRatio: 0,
      longRunRatio: 0,
      recommendation: recommendedType,
      message: ''
    };

    if (recentWorkouts && recentWorkouts.length > 0) {
      const workoutTypes = recentWorkouts.map((workout: any) => {
        const details = workout.workout_details;
        if (!details) return 'standard';
        
        const runCount = details.runs?.length || 0;
        const stationCount = details.stations?.length || 0;
        
        if (runCount >= 8 && stationCount <= 2) return 'long_run';
        if (runCount <= 4 && stationCount <= 4) return 'recovery';
        return 'standard';
      });

      analysis.recoveryCount = workoutTypes.filter((t: string) => t === 'recovery').length;
      analysis.longRunCount = workoutTypes.filter((t: string) => t === 'long_run').length;
      analysis.standardCount = workoutTypes.filter((t: string) => t === 'standard').length;
      analysis.recoveryRatio = analysis.recoveryCount / analysis.totalWorkouts;
      analysis.longRunRatio = analysis.longRunCount / analysis.totalWorkouts;

      // Generate contextual message
      if (recommendedType === 'recovery') {
        analysis.message = `You've had ${analysis.recoveryCount} recovery workouts in the last 14 days. Consider a recovery session to maintain the 1-in-7 pattern.`;
      } else if (recommendedType === 'long_run') {
        analysis.message = `You've had ${analysis.longRunCount} long run workouts in the last 14 days. Consider a long run session to maintain the 1-in-4 pattern.`;
      } else {
        analysis.message = `Your workout pattern looks balanced! You've had ${analysis.recoveryCount} recovery and ${analysis.longRunCount} long run workouts recently.`;
      }
    } else {
      analysis.message = 'No recent workouts found. Start with a standard workout!';
    }

    return NextResponse.json({ 
      success: true, 
      analysis 
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting workout recommendations:', error);
    return NextResponse.json({ 
      error: 'Failed to get workout recommendations' 
    }, { status: 500 });
  }
}
