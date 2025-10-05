/**
 * Workout Log Form Component
 * 
 * Form interface for logging workout performance data.
 * Allows user to input times for all 8 stations and 8 runs.
 * Features auto-advance, validation, and success feedback.
 * Follows Cal AI design with smooth, intuitive data entry flow.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TimeInput } from '@/components/ui/TimeInput';
import { WorkoutDetails } from '@/lib/types';

export interface LogFormProps {
  /** Workout to log performance for */
  workout: {
    id: number;
    workoutDetails: WorkoutDetails;
  };
  /** Callback when workout is logged successfully */
  onWorkoutLogged: (loggedWorkout: any) => void;
  /** Callback to close/cancel the form */
  onCancel?: () => void;
}

/**
 * Form for logging workout results
 * 
 * Usage:
 * <LogForm 
 *   workout={currentWorkout}
 *   onWorkoutLogged={(log) => console.log(log)}
 * />
 */
export function LogForm({ workout, onWorkoutLogged, onCancel }: LogFormProps) {
  const { workoutDetails } = workout;
  const { stations, runs } = workoutDetails;

  // State for all station times
  const [stationTimes, setStationTimes] = useState<Record<number, string>>({});
  
  // State for all run times
  const [runTimes, setRunTimes] = useState<Record<number, string>>({});
  
  // State for optional notes
  const [notes, setNotes] = useState('');
  
  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Calculates overall time from all stations and runs
   */
  const calculateOverallTime = (): string => {
    let totalSeconds = 0;

    // Sum station times
    Object.values(stationTimes).forEach((time) => {
      totalSeconds += timeToSeconds(time);
    });

    // Sum run times
    Object.values(runTimes).forEach((time) => {
      totalSeconds += timeToSeconds(time);
    });

    return secondsToTimeString(totalSeconds);
  };

  /**
   * Converts MM:SS to total seconds
   */
  const timeToSeconds = (time: string): number => {
    if (!time) return 0;
    const [minutes, seconds] = time.split(':').map(Number);
    return (minutes * 60) + seconds;
  };

  /**
   * Converts seconds to HH:MM:SS or MM:SS
   */
  const secondsToTimeString = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  /**
   * Checks if form is complete (all times entered)
   */
  const isFormComplete = (): boolean => {
    const allStationsEntered = stations.every((station) => 
      stationTimes[station.id] && stationTimes[station.id].length > 0
    );
    const allRunsEntered = runs.every((run) => 
      runTimes[run.id] && runTimes[run.id].length > 0
    );
    return allStationsEntered && allRunsEntered;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete()) {
      setError('Please enter times for all stations and runs');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format performance data
      const performanceData = {
        stations: stations.map((station) => ({
          name: station.name,
          time: stationTimes[station.id],
          order: station.order,
        })),
        runs: runs.map((run) => ({
          distance: run.distance,
          time: runTimes[run.id],
          order: run.order,
        })),
        overallTime: calculateOverallTime(),
      };

      // Submit to API
      const response = await fetch('/api/workouts/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId: workout.id,
          userId: 1, // MVP: hardcoded user ID
          performanceData,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log workout');
      }

      // Success!
      setShowSuccess(true);
      
      // Call success callback after brief delay
      setTimeout(() => {
        onWorkoutLogged(data.workoutLog);
      }, 1500);

    } catch (err) {
      console.error('Log error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success animation
  if (showSuccess) {
    return (
      <Card className="max-w-md mx-auto text-center py-12">
        <CardContent>
          {/* Success Animation */}
          <div className="w-20 h-20 mx-auto bg-[#06D6A0] rounded-full flex items-center justify-center mb-4 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Workout Logged! 🎉</h3>
          <p className="text-gray-600">Great job! Your performance has been saved.</p>
          <p className="text-sm text-gray-500 mt-2">Overall time: {calculateOverallTime()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Log Workout Results</CardTitle>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cancel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Enter your time for each station and run segment
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Station Times Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#E63946] text-white rounded-full flex items-center justify-center text-sm font-bold">
                S
              </span>
              Stations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stations.map((station, index) => (
                <TimeInput
                  key={station.id}
                  id={`station-${station.id}`}
                  label={`${station.order}. ${station.name}`}
                  value={stationTimes[station.id] || ''}
                  onChange={(value) => setStationTimes({ ...stationTimes, [station.id]: value })}
                  autoFocus={index === 0}
                  required
                />
              ))}
            </div>
          </div>

          {/* Run Times Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#457B9D] text-white rounded-full flex items-center justify-center text-sm font-bold">
                R
              </span>
              Runs (1km each)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {runs.map((run) => (
                <TimeInput
                  key={run.id}
                  id={`run-${run.id}`}
                  label={`Run ${run.id} - ${run.distance}`}
                  value={runTimes[run.id] || ''}
                  onChange={(value) => setRunTimes({ ...runTimes, [run.id]: value })}
                  required
                />
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? Any observations?"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946] focus:outline-none transition-colors"
            />
          </div>

          {/* Overall Time Preview */}
          {isFormComplete() && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Overall Time:</span>
                <span className="text-2xl font-bold text-blue-900 font-mono">
                  {calculateOverallTime()}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={!onCancel}
              isLoading={isSubmitting}
              disabled={!isFormComplete() || isSubmitting}
            >
              {isSubmitting ? 'Logging...' : 'Log Workout'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default LogForm;
