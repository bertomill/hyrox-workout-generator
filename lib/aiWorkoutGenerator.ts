/**
 * AI-Powered Workout Generator (SESSION 2 Enhancement) ^
 * 
 * Uses Vercel AI Gateway with OpenAI to generate truly adaptive, intelligent Hyrox workouts ^
 * based on user's mood, intensity, fitness level, and preferences. ^
 * 
 * Falls back to rule-based generation if AI fails. ^
 */

import { generateObject } from 'ai';
import { 
  WorkoutDetails, 
  FitnessLevel, 
  MoodLevel,
  IntensityLevel,
  WorkoutDuration,
  StationName,
  WorkoutGenerationParams,
  Station,
  Run
} from './types';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

/**
 * Zod schema for AI workout response ^ 
 */
const workoutSchema = z.object({
  stations: z.array(z.object({
    id: z.number(),
    name: z.string(),
    distance: z.string().optional(),
    weight: z.string().optional(),
    reps: z.string().optional(),
    order: z.number(),
  })),
  runs: z.array(z.object({
    id: z.number(),
    distance: z.string(),
    order: z.number(),
  })),
  coachingNotes: z.string().optional(),
});

/**
 * Generate workout using Vercel AI Gateway + OpenAI ^
 * Now enhanced to use user's custom workouts as inspiration
 */
export async function generateWorkoutWithAI(
  fitnessLevel: FitnessLevel,
  userId: string,
  params?: Partial<WorkoutGenerationParams>
): Promise<WorkoutDetails | null> {
  // Check if AI Gateway API key is configured ^
  // Note: Vercel AI SDK expects AI_GATEWAY_API_KEY (not VERCEL_AI_GATEWAY_API_KEY) ^
  if (!process.env.AI_GATEWAY_API_KEY) {
    console.warn('AI_GATEWAY_API_KEY not configured, falling back to rule-based generation');
    return null;
  }

  // Extract parameters
  const mood = params?.mood || 'normal';
  const intensity = params?.intensity || 'moderate';
  const duration = params?.duration || 60;
  const excludeStations = params?.excludeStations || [];

  // Get user's custom workouts for inspiration
  const customWorkouts = await getUserCustomWorkouts(userId);

  // Build the AI prompt with custom workout context
  const prompt = buildWorkoutPrompt(fitnessLevel, mood, intensity, duration, excludeStations, customWorkouts);

  try {
    // Use Vercel AI Gateway with plain string model identifier ^
    // The AI Gateway automatically intercepts this and routes through the gateway ^
    const { object } = await generateObject({
      model: 'openai/gpt-4o-mini', // Format: provider/model-name ^
      schema: workoutSchema,
      prompt: prompt,
      system: `You are an expert Hyrox trainer and workout designer. You create personalized, safe, and effective Hyrox workouts based on the athlete's current state and goals. Always follow official Hyrox standards but adapt for the athlete's level and condition.`,
    });

    console.log('✅ AI workout generated successfully');

    // Transform AI response to our WorkoutDetails format ^
    const workoutDetails = transformAIResponse(
      object,
      fitnessLevel,
      userId,
      mood,
      intensity,
      duration,
      excludeStations
    );

    return workoutDetails;
  } catch (error) {
    console.error('Error generating workout with AI:', error);
    return null;
  }
}

/**
 * Get user's custom workouts for AI inspiration
 */
async function getUserCustomWorkouts(userId: string): Promise<any[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workouts')
      .select('workout_name, description, tags, workout_details')
      .eq('user_id', userId)
      .eq('source', 'user_created')
      .order('created_at', { ascending: false })
      .limit(5); // Get last 5 custom workouts

    if (error) {
      console.warn('Error fetching custom workouts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Error fetching custom workouts:', error);
    return [];
  }
}

/**
 * Build a detailed prompt for the AI ^
 * Now enhanced with user's custom workout context
 */
function buildWorkoutPrompt(
  fitnessLevel: FitnessLevel,
  mood: MoodLevel,
  intensity: IntensityLevel,
  duration: WorkoutDuration,
  excludeStations: StationName[],
  customWorkouts: any[] = []
): string {
  const moodDescriptions = {
    fresh: 'feeling fresh, fully recovered, high energy',
    normal: 'feeling normal, ready for a standard workout',
    tired: 'feeling tired, somewhat fatigued but can train',
    exhausted: 'feeling exhausted, low energy, needs recovery-focused training'
  };

  const intensityDescriptions = {
    light: 'wants a light, recovery-focused session',
    moderate: 'wants a moderate, balanced session',
    hard: 'wants a hard, challenging session',
    beast: 'wants a beast mode, maximum effort session'
  };

  // Build custom workout context
  let customWorkoutContext = '';
  if (customWorkouts.length > 0) {
    customWorkoutContext = `

**User's Custom Workout History (for inspiration):**
${customWorkouts.map((workout, index) => `
${index + 1}. "${workout.workout_name}" (${workout.tags?.join(', ') || 'no tags'})
   - Description: ${workout.description || 'No description'}
   - Stations: ${workout.workout_details?.stations?.map((s: any) => s.name).join(', ') || 'N/A'}
`).join('')}

Use these custom workouts as inspiration for creating variations and improvements. Consider the user's preferences and patterns from their custom workouts.`;
  }

  return `Generate a personalized Hyrox workout with the following parameters:

**Athlete Profile:**
- Fitness Level: ${fitnessLevel}
- Current Mood/Energy: ${moodDescriptions[mood]}
- Desired Intensity: ${intensityDescriptions[intensity]}
- Available Time: ${duration} minutes

**Constraints:**
${excludeStations.length > 0 ? `- MUST EXCLUDE these stations: ${excludeStations.join(', ')}` : '- No station exclusions'}${customWorkoutContext}

**Standard Hyrox Stations (adjust as needed):**
1. SkiErg - 1000m (cardio machine)
2. Sled Push - 50m with weight
3. Sled Pull - 50m with weight
4. Burpee Broad Jumps - 80m
5. Rowing - 1000m
6. Farmers Carry - 200m with kettlebells
7. Sandbag Lunges - 100m with sandbag
8. Wall Balls - 100 reps

**Official Hyrox Weights by Level:**
- Beginner: Sled Push 50kg, Sled Pull 70kg, Farmers 2x16kg, Sandbag 20kg, Wall Ball 4kg
- Intermediate: Sled Push 102kg, Sled Pull 78kg, Farmers 2x24kg, Sandbag 20kg, Wall Ball 6kg
- Advanced: Sled Push 152kg, Sled Pull 103kg, Farmers 2x32kg, Sandbag 30kg, Wall Ball 9kg

**Your Task:**
Create a workout that:
1. KEEP standard Hyrox distances/weights (don't modify the official standards above)
2. VARY the composition: select which stations to include based on mood and intensity
   - Fresh + Hard/Beast: Include all 8 stations
   - Normal + Moderate: Include 6-7 stations
   - Tired + Light: Include 4-5 stations (focus on technique)
   - Exhausted: Include 3-4 stations (recovery-focused)
3. Adjust run distances to fit the ${duration} minute timeframe
4. Respect the athlete's current energy state by varying volume (number of stations), not individual distances
5. Exclude any restricted stations
6. Provide coaching notes explaining which stations were selected and why

IMPORTANT: Each station should use its standard Hyrox distance/weight for the fitness level. Adjust the workout by including more or fewer stations, not by modifying individual exercise parameters.

Generate the workout with stations array, runs array, and optional coaching notes.`;
}

/**
 * Transform AI response to our WorkoutDetails format
 */
function transformAIResponse(
  aiWorkout: z.infer<typeof workoutSchema>,
  fitnessLevel: FitnessLevel,
  userId: string,
  mood: MoodLevel,
  intensity: IntensityLevel,
  duration: WorkoutDuration,
  excludeStations: StationName[]
): WorkoutDetails {
  // Ensure stations have all required fields
  const stations: Station[] = aiWorkout.stations.map((s, index) => ({
    id: s.id || index + 1,
    name: s.name,
    distance: s.distance,
    weight: s.weight,
    reps: s.reps,
    order: s.order !== undefined ? s.order : index + 1,
  }));

  // Ensure runs have all required fields
  const runs: Run[] = aiWorkout.runs.map((r, index) => ({
    id: r.id || index + 1,
    distance: r.distance || '1km',
    order: r.order !== undefined ? r.order : index * 2,
  }));

  return {
    fitnessLevel,
    userId,
    stations,
    runs,
    generatedAt: new Date().toISOString(),
    mood,
    intensity,
    duration,
    excludedStations: excludeStations.length > 0 ? excludeStations : undefined,
  };
}