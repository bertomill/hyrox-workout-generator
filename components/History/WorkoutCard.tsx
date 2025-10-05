/**
 * Workout Card Component
 * 
 * Displays a summary of a logged workout in the history list.
 * Shows date, overall time, and key stats in a clean card layout.
 * Expandable to show full workout details.
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export interface WorkoutCardProps {
  workout: {
    id: number;
    dateCompleted: string;
    overallTime: number;
    overallTimeFormatted: string;
    performanceData: {
      stations: Array<{ name: string; time: string; order: number }>;
      runs: Array<{ distance: string; time: string; order: number }>;
      overallTime: string;
    };
    workoutDetails: {
      fitnessLevel: string;
      stations: any[];
      runs: any[];
    };
    notes?: string;
  };
  onEdit?: (workoutId: number) => void;
  onDelete?: (workoutId: number) => void;
}

/**
 * Card displaying a single workout log entry
 * 
 * Usage:
 * <WorkoutCard 
 *   workout={workoutLog}
 *   onEdit={(id) => handleEdit(id)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const date = new Date(workout.dateCompleted);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card 
      interactive 
      className="mb-3"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Card Header - Always Visible */}
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{formattedDate}</h3>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full capitalize">
              {workout.workoutDetails.fitnessLevel}
            </span>
          </div>
          <p className="text-sm text-gray-600">{formattedTime}</p>
        </div>

        {/* Overall Time */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {workout.overallTimeFormatted}
          </div>
          <div className="text-xs text-gray-500">Total Time</div>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="ml-3">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Quick Stats Row - Always Visible */}
      <div className="mt-3 flex gap-4 text-sm">
        <div>
          <span className="text-gray-600">Stations:</span>
          <span className="ml-1 font-semibold text-gray-900">8</span>
        </div>
        <div>
          <span className="text-gray-600">Runs:</span>
          <span className="ml-1 font-semibold text-gray-900">8km</span>
        </div>
        {workout.notes && (
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>Note</span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Stations Performance */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#E63946] text-white rounded-full flex items-center justify-center text-xs">
                S
              </span>
              Stations
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {workout.performanceData.stations.map((station, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <span className="text-sm text-gray-700">{station.name}</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {station.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Runs Performance */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#457B9D] text-white rounded-full flex items-center justify-center text-xs">
                R
              </span>
              Runs (1km each)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {workout.performanceData.runs.map((run, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-50 rounded-lg flex justify-between items-center"
                >
                  <span className="text-sm text-gray-700">Run {index + 1}</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {run.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {workout.notes && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="text-xs font-semibold text-yellow-900 mb-1">Notes:</div>
              <p className="text-sm text-yellow-800">{workout.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(workout.id);
                  }}
                  className="flex-1 px-4 py-2 bg-[#457B9D] text-white rounded-lg font-medium hover:bg-[#3a6a84] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Notes
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(workout.id);
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default WorkoutCard;
