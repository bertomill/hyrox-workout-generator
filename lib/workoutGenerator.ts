/**
 * Workout Generator Module
 * 
 * This module generates personalized Hyrox workouts based on fitness level. 
 * A Hyrox workout consists of 8 running segments (1km each) interspersed with 8 functional fitness stations. ^ 
 * The intensity (weights, distances) is adjusted based on the user's fitness level.^
 */

import { WorkoutDetails, FitnessLevel, Station, Run } from './types';

/**
 * Station configurations by fitness level
 * Based on official Hyrox standards with adjustments for different experience levels
 */
const STATION_CONFIGS = {
  beginner: {
    skierg: { name: 'SkiErg', distance: '1000m', unit: 'm' },
    sledPush: { name: 'Sled Push', distance: '50m', weight: '150kg', unit: 'm' },
    sledPull: { name: 'Sled Pull', distance: '50m', weight: '100kg', unit: 'm' },
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
 * Generates a complete Hyrox workout based on fitness level
 * 
 * @param fitnessLevel - User's fitness level (beginner/intermediate/advanced)
 * @param userId - User ID for tracking (defaults to 1 for MVP)
 * @returns Complete workout details object
 */
export function generateWorkout(
  fitnessLevel: FitnessLevel,
  userId: number = 1
): WorkoutDetails {
  const config = STATION_CONFIGS[fitnessLevel];

  // Create 8 stations in standard Hyrox order
  const stations: Station[] = [
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

  // Create 8 runs (1km each) - they alternate with stations
  // Run order: 0 (before station 1), 2 (after station 1), 4, 6, 8, 10, 12, 14
  const runs: Run[] = [
    { id: 1, distance: '1km', order: 0 },
    { id: 2, distance: '1km', order: 2 },
    { id: 3, distance: '1km', order: 4 },
    { id: 4, distance: '1km', order: 6 },
    { id: 5, distance: '1km', order: 8 },
    { id: 6, distance: '1km', order: 10 },
    { id: 7, distance: '1km', order: 12 },
    { id: 8, distance: '1km', order: 14 },
  ];

  // Return complete workout details
  return {
    fitnessLevel,
    userId,
    stations,
    runs,
    generatedAt: new Date().toISOString(),
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
