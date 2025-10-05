// TypeScript types for the application

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

// Smart generation types (SESSION 2 features)
export type MoodLevel = 'fresh' | 'normal' | 'tired' | 'exhausted';
export type IntensityLevel = 'light' | 'moderate' | 'hard' | 'beast';
export type WorkoutDuration = 30 | 45 | 60 | 90;

// Station names for preferences
export type StationName = 
  | 'SkiErg' 
  | 'Sled Push' 
  | 'Sled Pull' 
  | 'Burpee Broad Jumps' 
  | 'Rowing' 
  | 'Farmers Carry' 
  | 'Sandbag Lunges' 
  | 'Wall Balls';

export interface WorkoutGenerationParams {
  fitnessLevel: FitnessLevel;
  mood?: MoodLevel;
  intensity?: IntensityLevel;
  duration?: WorkoutDuration;
  excludeStations?: StationName[];
  surpriseMe?: boolean;
}

export type WorkoutStatus = 'pending' | 'completed' | 'skipped';

export interface HyroxStation {
  id: number;
  name: string;
  distance?: string;
  reps?: string;
  weight?: string;
  order: number;
}

export interface HyroxRun {
  id: number;
  distance: string;
  order: number;
}

export interface WorkoutDetails {
  fitnessLevel: FitnessLevel;
  stations: HyroxStation[];
  runs: HyroxRun[];
  userId?: string; // UUID from Supabase Auth
  generatedAt?: string;
  // Smart generation metadata
  mood?: MoodLevel;
  intensity?: IntensityLevel;
  duration?: WorkoutDuration;
  excludedStations?: StationName[];
}

// Aliases for convenience
export type Station = HyroxStation;
export type Run = HyroxRun;

export interface StationPerformance {
  name: string;
  time: string; // Format: "MM:SS"
  order: number;
}

export interface RunPerformance {
  distance: string;
  time: string; // Format: "MM:SS"
  order: number;
}

export interface PerformanceData {
  stations: StationPerformance[];
  runs: RunPerformance[];
  overallTime: string; // Format: "HH:MM:SS" or "MM:SS"
}

// Database models
export interface User {
  id: string; // UUID from Supabase Auth
  email: string;
  password_hash?: string;
  name?: string;
  fitness_level: FitnessLevel;
  created_at: Date;
  updated_at: Date;
}

export interface Workout {
  id: number;
  user_id: string; // UUID from Supabase Auth
  date_generated: Date;
  workout_details: WorkoutDetails;
  status: WorkoutStatus;
  created_at: Date;
}

export interface WorkoutLog {
  id: number;
  workout_id: number;
  user_id: string; // UUID from Supabase Auth
  date_completed: Date;
  performance_data: PerformanceData;
  overall_time?: number; // Total time in seconds
  notes?: string;
  created_at: Date;
}
