/**
 * AI-Powered Workout Generator (SESSION 2 Enhancement)
 * 
 * Uses OpenAI to generate truly adaptive, intelligent Hyrox workouts
 * based on user's mood, intensity, fitness level, and preferences.
 * 
 * Falls back to rule-based generation if AI fails.
 */

import OpenAI from 'openai';
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

/**
 * Generate workout using OpenAI
 */
export async function generateWorkoutWithAI(
  fitnessLevel: FitnessLevel,
  userId: string,
  params?: Partial<WorkoutGenerationParams>
): Promise<WorkoutDetails | null> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not configured, falling back to rule-based generation');
    return null;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Extract parameters
  const mood = params?.mood || 'normal';
  const intensity = params?.intensity || 'moderate';
  const duration = params?.duration || 60;
  const excludeStations = params?.excludeStations || [];

  // Build the AI prompt
  const prompt = buildWorkoutPrompt(fitnessLevel, mood, intensity, duration, excludeStations);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert Hyrox trainer and workout designer. You create personalized, safe, and effective Hyrox workouts based on the athlete's current state and goals. Always follow official Hyrox standards but adapt for the athlete's level and condition.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      console.error('No response from OpenAI');
      return null;
    }

    // Parse the AI response
    const aiWorkout = JSON.parse(responseContent);
    
    // Transform AI response to our WorkoutDetails format
    const workoutDetails = transformAIResponse(
      aiWorkout,
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
 * Build a detailed prompt for the AI
 */
function buildWorkoutPrompt(
  fitnessLevel: FitnessLevel,
  mood: MoodLevel,
  intensity: IntensityLevel,
  duration: WorkoutDuration,
  excludeStations: StationName[]
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

  return `Generate a personalized Hyrox workout with the following parameters:

**Athlete Profile:**
- Fitness Level: ${fitnessLevel}
- Current Mood/Energy: ${moodDescriptions[mood]}
- Desired Intensity: ${intensityDescriptions[intensity]}
- Available Time: ${duration} minutes

**Constraints:**
${excludeStations.length > 0 ? `- MUST EXCLUDE these stations: ${excludeStations.join(', ')}` : '- No station exclusions'}

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
1. Adapts distances, weights, and volumes based on mood and intensity
2. Adjusts run distances to fit the ${duration} minute timeframe
3. Respects the athlete's current energy state (mood: ${mood})
4. Matches their desired intensity (${intensity})
5. Excludes any restricted stations
6. Provides coaching notes explaining the adaptations

**Response Format (JSON):**
{
  "stations": [
    {
      "id": 1,
      "name": "SkiErg",
      "distance": "1000m",
      "order": 1
    },
    {
      "id": 2,
      "name": "Sled Push",
      "distance": "50m",
      "weight": "102kg",
      "order": 2
    }
    // ... continue for all 8 stations (or fewer if excluded)
  ],
  "runs": [
    {
      "id": 1,
      "distance": "1km",
      "order": 0
    }
    // ... 8 runs total, alternating with stations
  ],
  "coachingNotes": "Brief explanation of adaptations made based on mood and intensity"
}

Generate the workout now.`;
}

/**
 * Transform AI response to our WorkoutDetails format
 */
function transformAIResponse(
  aiWorkout: any,
  fitnessLevel: FitnessLevel,
  userId: string,
  mood: MoodLevel,
  intensity: IntensityLevel,
  duration: WorkoutDuration,
  excludeStations: StationName[]
): WorkoutDetails {
  // Ensure stations have all required fields
  const stations: Station[] = (aiWorkout.stations || []).map((s: any, index: number) => ({
    id: s.id || index + 1,
    name: s.name,
    distance: s.distance,
    weight: s.weight,
    reps: s.reps,
    order: s.order !== undefined ? s.order : index + 1,
  }));

  // Ensure runs have all required fields
  const runs: Run[] = (aiWorkout.runs || []).map((r: any, index: number) => ({
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
