/**
 * Workout Display Component
 * 
 * Displays a generated Hyrox workout in a clean, organized card layout.
 * Shows all 8 stations and 8 running segments with proper ordering.
 * Follows Cal AI aesthetic with circular progress indicators and card-based design.
 */

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { WorkoutDetails, Station, Run } from '@/lib/types';

export interface WorkoutDisplayProps {
  /** Complete workout data */
  workout: {
    id: number;
    workoutDetails: WorkoutDetails;
    dateGenerated: string;
    status: string;
  };
}

/**
 * Displays a complete Hyrox workout
 * 
 * Usage:
 * <WorkoutDisplay workout={generatedWorkout} />
 */
export function WorkoutDisplay({ workout }: WorkoutDisplayProps) {
  const { workoutDetails } = workout;
  const { fitnessLevel, stations, runs } = workoutDetails;

  /**
   * Merges stations and runs in proper order for display
   * Hyrox format: Run, Station, Run, Station, etc.
   */
  const getOrderedWorkout = () => {
    const ordered: Array<{ type: 'run' | 'station'; data: Run | Station; order: number }> = [];

    // Add all runs
    runs.forEach((run) => {
      ordered.push({ type: 'run', data: run, order: run.order });
    });

    // Add all stations (odd orders: 1, 3, 5, 7, 9, 11, 13, 15)
    stations.forEach((station) => {
      ordered.push({ type: 'station', data: station, order: station.order * 2 - 1 });
    });

    // Sort by order
    return ordered.sort((a, b) => a.order - b.order);
  };

  const orderedWorkout = getOrderedWorkout();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Your Hyrox Workout</CardTitle>
          <FitnessLevelBadge level={fitnessLevel} />
        </div>
        <p className="text-sm text-gray-600">
          Generated on {new Date(workout.dateGenerated).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </CardHeader>

      <CardContent>
        {/* Workout Overview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#E63946]">8</div>
              <div className="text-sm text-gray-600">Stations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#457B9D]">8</div>
              <div className="text-sm text-gray-600">Runs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">8km</div>
              <div className="text-sm text-gray-600">Total Running</div>
            </div>
          </div>
        </div>

        {/* Workout Segments */}
        <div className="space-y-3">
          {orderedWorkout.map((item, index) => (
            <div key={`${item.type}-${index}`}>
              {item.type === 'run' ? (
                <RunSegment run={item.data as Run} sequenceNumber={index + 1} />
              ) : (
                <StationSegment 
                  station={item.data as Station} 
                  sequenceNumber={index + 1}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-900">
            💡 <span className="font-semibold">Pro Tip:</span> Complete all segments in order. 
            Pace yourself on the runs to maintain energy for the stations!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Fitness Level Badge Component
 */
function FitnessLevelBadge({ level }: { level: string }) {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200',
  };

  const color = colors[level as keyof typeof colors] || colors.intermediate;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color} capitalize`}>
      {level}
    </span>
  );
}

/**
 * Run Segment Display
 */
function RunSegment({ run, sequenceNumber }: { run: Run; sequenceNumber: number }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
      {/* Sequence Number */}
      <div className="flex-shrink-0 w-8 h-8 bg-[#457B9D] text-white rounded-full flex items-center justify-center font-semibold text-sm">
        {sequenceNumber}
      </div>

      {/* Run Icon */}
      <div className="flex-shrink-0">
        <svg className="w-6 h-6 text-[#457B9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      {/* Run Details */}
      <div className="flex-grow">
        <div className="font-semibold text-gray-900">Run</div>
        <div className="text-sm text-gray-600">{run.distance}</div>
      </div>

      {/* Run indicator */}
      <div className="text-xs text-gray-500 font-mono">RUN</div>
    </div>
  );
}

/**
 * Station Segment Display
 */
function StationSegment({ station, sequenceNumber }: { station: Station; sequenceNumber: number }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#E63946] transition-colors">
      {/* Sequence Number */}
      <div className="flex-shrink-0 w-8 h-8 bg-[#E63946] text-white rounded-full flex items-center justify-center font-semibold text-sm">
        {sequenceNumber}
      </div>

      {/* Station Icon */}
      <div className="flex-shrink-0">
        <StationIcon stationName={station.name} />
      </div>

      {/* Station Details */}
      <div className="flex-grow">
        <div className="font-semibold text-gray-900 mb-0.5">{station.name}</div>
        <div className="text-sm text-gray-600">
          {station.distance && <span>{station.distance}</span>}
          {station.reps && <span>{station.reps} reps</span>}
          {station.weight && <span className="ml-2 text-gray-500">• {station.weight}</span>}
        </div>
      </div>

      {/* Station number indicator */}
      <div className="text-xs text-gray-500 font-mono">
        STATION {station.order}
      </div>
    </div>
  );
}

/**
 * Station Icon Component
 * Returns appropriate icon for each station type
 */
function StationIcon({ stationName }: { stationName: string }) {
  const iconClass = "w-6 h-6 text-[#E63946]";
  
  // Different icons for different stations (simplified for MVP)
  const getIcon = () => {
    if (stationName.includes('SkiErg') || stationName.includes('Rowing')) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }
    
    // Default icon
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  return getIcon();
}

export default WorkoutDisplay;
