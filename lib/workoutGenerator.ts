/**
 * Enhanced Workout Generator Module (SESSION 2 + AI Enhancement)
 * 
 * This module generates personalized Hyrox workouts using:
 * 1. AI-powered generation (OpenAI) - primary method
 * 2. Rule-based generation - fallback if AI unavailable
 * 
 * Factors considered:
 * - Fitness level (beginner/intermediate/advanced)
 * - Mood (fresh/normal/tired/exhausted)
 * - Intensity preference (light/moderate/hard/beast)
 * - Duration (30/45/60/90 minutes)
 * - Station preferences (exclude certain exercises)
 */

import { 
  WorkoutDetails, 
  FitnessLevel, 
  Station, 
  Run, 
  MoodLevel,
  IntensityLevel,
  WorkoutDuration,
  StationName,
  WorkoutGenerationParams
} from './types';
import { generateWorkoutWithAI } from './aiWorkoutGenerator';

/**
 * Station configurations by fitness level
 * Based on official Hyrox standards with adjustments for different experience levels
 */
const STATION_CONFIGS = {
  beginner: {
    skierg: { name: 'SkiErg', distance: '1000m', unit: 'm' },
    sledPush: { name: 'Sled Push', distance: '50m', weight: '50kg', unit: 'm' },
    sledPull: { name: 'Sled Pull', distance: '50m', weight: '70kg', unit: 'm' },
    burpeeBroadJumps: { name: 'Burpee Broad Jumps', distance: '80m', unit: 'm' },
    rowing: { name: 'Rowing', distance: '1000m', unit: 'm' },
    farmersCarry: { name: 'Farmers Carry', distance: '200m', weight: '2x16kg', unit: 'm' },
    sandbagLunges: { name: 'Sandbag Lunges', distance: '100m', weight: '20kg', unit: 'm' },
    wallBalls: { name: 'Wall Balls', reps: '100', weight: '4kg', unit: 'reps' },
  },
  intermediate: {
    skierg: { name: 'SkiErg', distance: '1000m', unit: 'm' },
    sledPush: { name: 'Sled Push', distance: '50m', weight: '102kg', unit: 'm' },
    sledPull: { name: 'Sled Pull', distance: '50m', weight: '78kg', unit: 'm' },
    burpeeBroadJumps: { name: 'Burpee Broad Jumps', distance: '80m', unit: 'm' },
    rowing: { name: 'Rowing', distance: '1000m', unit: 'm' },
    farmersCarry: { name: 'Farmers Carry', distance: '200m', weight: '2x24kg', unit: 'm' },
    sandbagLunges: { name: 'Sandbag Lunges', distance: '100m', weight: '20kg', unit: 'm' },
    wallBalls: { name: 'Wall Balls', reps: '100', weight: '6kg', unit: 'reps' },
  },
  advanced: {
    skierg: { name: 'SkiErg', distance: '1000m', unit: 'm' },
    sledPush: { name: 'Sled Push', distance: '50m', weight: '152kg', unit: 'm' },
    sledPull: { name: 'Sled Pull', distance: '50m', weight: '103kg', unit: 'm' },
    burpeeBroadJumps: { name: 'Burpee Broad Jumps', distance: '80m', unit: 'm' },
    rowing: { name: 'Rowing', distance: '1000m', unit: 'm' },
    farmersCarry: { name: 'Farmers Carry', distance: '200m', weight: '2x32kg', unit: 'm' },
    sandbagLunges: { name: 'Sandbag Lunges', distance: '100m', weight: '30kg', unit: 'm' },
    wallBalls: { name: 'Wall Balls', reps: '100', weight: '9kg', unit: 'reps' },
  },
};

/**
 * Mood and intensity affect COMPOSITION (which stations to include), not individual distances
 * This keeps Hyrox standards while varying workout volume
 */
const STATION_SELECTION_CONFIG: Record<MoodLevel, Record<IntensityLevel, number>> = {
  fresh: { light: 6, moderate: 7, hard: 8, beast: 8 },
  normal: { light: 5, moderate: 6, hard: 7, beast: 8 },
  tired: { light: 4, moderate: 5, hard: 6, beast: 7 },
  exhausted: { light: 3, moderate: 4, hard: 5, beast: 6 },
};

/**
 * Duration affects run distances
 */
const DURATION_CONFIGS: Record<WorkoutDuration, { runDistance: string; runCount: number }> = {
  30: { runDistance: '500m', runCount: 8 },
  45: { runDistance: '750m', runCount: 8 },
  60: { runDistance: '1km', runCount: 8 },
  90: { runDistance: '1.5km', runCount: 8 },
};

/**
 * Generates a complete Hyrox workout based on multiple parameters
 * 
 * Attempts AI generation first, falls back to rule-based if AI fails.
 * 
 * @param fitnessLevel - User's fitness level (beginner/intermediate/advanced)
 * @param userId - User ID (UUID from Supabase Auth)
 * @param params - Optional generation parameters (mood, intensity, duration, etc.)
 * @returns Complete workout details object
 */
export async function generateWorkout(
  fitnessLevel: FitnessLevel,
  userId: string,
  params?: Partial<WorkoutGenerationParams>
): Promise<WorkoutDetails> {
  // Handle "Surprise Me" - randomize mood and intensity
  if (params?.surpriseMe) {
    const randomMood: MoodLevel = ['fresh', 'normal', 'tired', 'exhausted'][Math.floor(Math.random() * 4)] as MoodLevel;
    const randomIntensity: IntensityLevel = ['light', 'moderate', 'hard', 'beast'][Math.floor(Math.random() * 4)] as IntensityLevel;
    
    // Recursively call with randomized parameters
    return generateWorkout(fitnessLevel, userId, {
      ...params,
      mood: randomMood,
      intensity: randomIntensity,
      surpriseMe: false, // Prevent infinite loop
    });
  }

  // Try AI generation first
  try {
    const aiWorkout = await generateWorkoutWithAI(fitnessLevel, userId, params);
    if (aiWorkout) {
      console.log('✅ Workout generated with AI');
      return aiWorkout;
    }
  } catch (error) {
    console.warn('AI generation failed, falling back to rule-based:', error);
  }

  // Fallback to rule-based generation
  console.log('📋 Using rule-based workout generation');
  return generateWorkoutRuleBased(fitnessLevel, userId, params);
}

/**
 * Rule-based workout generation (fallback method)
 * Original algorithm using multipliers and configurations
 */
function generateWorkoutRuleBased(
  fitnessLevel: FitnessLevel,
  userId: string,
  params?: Partial<WorkoutGenerationParams>
): WorkoutDetails {
  const config = STATION_CONFIGS[fitnessLevel];
  
  // Extract parameters with defaults
  const mood = params?.mood || 'normal';
  const intensity = params?.intensity || 'moderate';
  const duration = params?.duration || 60;
  const excludeStations = params?.excludeStations || [];

  // Determine how many stations to include based on mood + intensity
  const stationCount = STATION_SELECTION_CONFIG[mood][intensity];

  // Build all 8 stations with STANDARD Hyrox distances/weights (no adjustments)
  const allStations: Station[] = [
    {
      id: 1,
      name: config.skierg.name,
      distance: config.skierg.distance,
      order: 1,
    },
    {
      id: 2,
      name: config.sledPush.name,
      distance: config.sledPush.distance,
      weight: config.sledPush.weight,
      order: 2,
    },
    {
      id: 3,
      name: config.sledPull.name,
      distance: config.sledPull.distance,
      weight: config.sledPull.weight,
      order: 3,
    },
    {
      id: 4,
      name: config.burpeeBroadJumps.name,
      distance: config.burpeeBroadJumps.distance,
      order: 4,
    },
    {
      id: 5,
      name: config.rowing.name,
      distance: config.rowing.distance,
      order: 5,
    },
    {
      id: 6,
      name: config.farmersCarry.name,
      distance: config.farmersCarry.distance,
      weight: config.farmersCarry.weight,
      order: 6,
    },
    {
      id: 7,
      name: config.sandbagLunges.name,
      distance: config.sandbagLunges.distance,
      weight: config.sandbagLunges.weight,
      order: 7,
    },
    {
      id: 8,
      name: config.wallBalls.name,
      reps: config.wallBalls.reps,
      weight: config.wallBalls.weight,
      order: 8,
    },
  ];

  // Filter out excluded stations first
  let availableStations = allStations.filter(
    station => !excludeStations.includes(station.name as StationName)
  );

  // Select the appropriate number of stations based on mood + intensity
  // Prioritize keeping varied movements (alternate upper/lower, cardio/strength)
  const stations = availableStations.slice(0, Math.min(stationCount, availableStations.length));

  // Get run configuration based on duration
  const runConfig = DURATION_CONFIGS[duration];
  
  // Create runs based on duration
  const runs: Run[] = [];
  for (let i = 0; i < runConfig.runCount; i++) {
    runs.push({
      id: i + 1,
      distance: runConfig.runDistance,
      order: i * 2, // Runs alternate with stations (0, 2, 4, 6, etc.)
    });
  }

  // Return complete workout details
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

/**
 * Validates if a fitness level is valid
 * 
 * @param level - Fitness level to validate
 * @returns True if valid, false otherwise
 */
export function isValidFitnessLevel(level: string): level is FitnessLevel {
  return ['beginner', 'intermediate', 'advanced'].includes(level);
}

/**
 * Gets a description for each station (for UI display)
 * 
 * @param stationName - Name of the station
 * @returns Description string
 */
export function getStationDescription(stationName: string): string {
  const descriptions: Record<string, string> = {
    'SkiErg': 'Full-body cardio on the ski ergometer',
    'Sled Push': 'Push weighted sled across the floor',
    'Sled Pull': 'Pull weighted sled back across the floor',
    'Burpee Broad Jumps': 'Burpee followed by a broad jump forward',
    'Rowing': '1000m on the rowing machine',
    'Farmers Carry': 'Carry kettlebells in each hand',
    'Sandbag Lunges': 'Walking lunges with sandbag on shoulders',
    'Wall Balls': 'Squat and throw medicine ball to target',
  };

  return descriptions[stationName] || 'Complete the prescribed distance or reps';
}