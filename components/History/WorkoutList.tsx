/**
 * Workout List Component ^
 * 
 * Displays a list of all logged workouts in reverse chronological order. ^
 * Fetches data from the history API and renders WorkoutCard components. ^
 */

'use client';

import React, { useEffect, useState } from 'react';
import { WorkoutCard } from './WorkoutCard';

export interface WorkoutListProps {
  userId?: number;
}

/**
 * List component that fetches and displays workout history ^
 * 
 * Usage:
 * <WorkoutList userId={1} /> ^
 */
export function WorkoutList({ userId = 1 }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches workout history from API ^
   */
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/workouts/history?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch workout history');
        }

        setWorkouts(data.workouts || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workout history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  // Loading state ^
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946]"></div>
        <p className="mt-4 text-gray-600">Loading workout history...</p>
      </div>
    );
  }

  // Error state ^
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="font-semibold text-red-900 mb-1">Error Loading History</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  // Empty state ^
  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workouts Yet</h3>
        <p className="text-gray-600 mb-4">
          Start by generating and logging your first workout!
        </p>
      </div>
    );
  }

  // List of workouts ^
  return (
    <div className="space-y-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
      
      {/* Pagination placeholder for future */}
      {workouts.length >= 50 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Showing {workouts.length} workouts
          </p>
        </div>
      )}
    </div>
  );
}

export default WorkoutList;
