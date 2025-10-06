/**
 * Workout Builder Form Component
 * 
 * Allows users to create custom Hyrox workouts with specific stations, runs, and metadata.
 * Follows the exact structure from the user's example JSON.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Run {
  id: number;
  order: number;
  distance: string;
}

interface Station {
  id: number;
  name: string;
  order: number;
  distance?: string;
  weight?: string;
  reps?: string;
}

interface WorkoutBuilderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: any) => void;
  initialWorkout?: any;
}

const STATION_OPTIONS = [
  'SkiErg',
  'Sled Push', 
  'Sled Pull',
  'Burpee Broad Jumps',
  'Rowing',
  'Farmers Carry',
  'Sandbag Lunges',
  'Wall Balls'
];

const TAG_OPTIONS = [
  'strength',
  'endurance', 
  'competition',
  'recovery',
  'technique',
  'power',
  'conditioning'
];

export function WorkoutBuilderForm({ isOpen, onClose, onSave, initialWorkout }: WorkoutBuilderFormProps) {
  const [workoutName, setWorkoutName] = useState(initialWorkout?.workout_name || '');
  const [description, setDescription] = useState(initialWorkout?.description || '');
  const [tags, setTags] = useState<string[]>(initialWorkout?.tags || []);
  const [runs, setRuns] = useState<Run[]>(initialWorkout?.workout_details?.runs || [
    { id: 1, order: 0, distance: '1km' },
    { id: 2, order: 2, distance: '1km' },
    { id: 3, order: 4, distance: '1km' },
    { id: 4, order: 6, distance: '1km' },
    { id: 5, order: 8, distance: '1km' },
    { id: 6, order: 10, distance: '1km' },
    { id: 7, order: 12, distance: '1km' },
    { id: 8, order: 14, distance: '1km' }
  ]);
  const [stations, setStations] = useState<Station[]>(initialWorkout?.workout_details?.stations || [
    { id: 1, name: 'SkiErg', order: 1, distance: '1000m' },
    { id: 2, name: 'Sled Push', order: 2, weight: '152kg', distance: '50m' },
    { id: 3, name: 'Sled Pull', order: 3, weight: '103kg', distance: '50m' },
    { id: 4, name: 'Burpee Broad Jumps', order: 4, distance: '80m' },
    { id: 5, name: 'Rowing', order: 5, distance: '1000m' },
    { id: 6, name: 'Farmers Carry', order: 6, weight: '2x32kg', distance: '200m' },
    { id: 7, name: 'Sandbag Lunges', order: 7, weight: '30kg', distance: '100m' },
    { id: 8, name: 'Wall Balls', order: 8, reps: '100', weight: '9kg' }
  ]);

  const handleSave = () => {
    const workout = {
      workout_name: workoutName,
      description: description,
      tags: tags,
      workout_details: {
        runs: runs,
        stations: stations,
        generatedAt: new Date().toISOString(),
        fitnessLevel: 'advanced' // Default for custom workouts
      }
    };
    onSave(workout);
  };

  const updateStation = (index: number, field: keyof Station, value: string) => {
    const updatedStations = [...stations];
    updatedStations[index] = { ...updatedStations[index], [field]: value };
    setStations(updatedStations);
  };

  const updateRun = (index: number, field: keyof Run, value: string) => {
    const updatedRuns = [...runs];
    updatedRuns[index] = { ...updatedRuns[index], [field]: value };
    setRuns(updatedRuns);
  };

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl shadow-2xl max-w-4xl mx-auto w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Workout Builder</h2>
            <p className="text-sm text-gray-600 mt-1">Create your custom Hyrox workout</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Workout Name *
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Competition Prep - Strength Focus"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this workout's purpose and focus..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      tags.includes(tag)
                        ? 'bg-[#E63946] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Runs Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏃‍♂️ Running Sections</h3>
            <div className="space-y-3">
              {runs.map((run, index) => (
                <div key={run.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 w-8">Run {index + 1}</span>
                  <input
                    type="text"
                    value={run.distance}
                    onChange={(e) => updateRun(index, 'distance', e.target.value)}
                    placeholder="Distance (e.g., 1km)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stations Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏋️‍♂️ Functional Stations</h3>
            <div className="space-y-4">
              {stations.map((station, index) => (
                <Card key={station.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
                    <select
                      value={station.name}
                      onChange={(e) => updateStation(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                    >
                      {STATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Distance</label>
                      <input
                        type="text"
                        value={station.distance || ''}
                        onChange={(e) => updateStation(index, 'distance', e.target.value)}
                        placeholder="e.g., 1000m"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Weight</label>
                      <input
                        type="text"
                        value={station.weight || ''}
                        onChange={(e) => updateStation(index, 'weight', e.target.value)}
                        placeholder="e.g., 152kg"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Reps</label>
                      <input
                        type="text"
                        value={station.reps || ''}
                        onChange={(e) => updateStation(index, 'reps', e.target.value)}
                        placeholder="e.g., 100"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex-1"
              disabled={!workoutName.trim()}
            >
              Save Workout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
