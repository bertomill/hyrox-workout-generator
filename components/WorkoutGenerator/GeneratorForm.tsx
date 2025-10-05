/**
 * Enhanced Workout Generator Form Component (SESSION 2)
 * 
 * Modal interface for generating smart, adaptive Hyrox workouts.1
 * Features:
 * - Mood selector (Fresh/Normal/Tired/Exhausted)1
 * - Intensity dial (Light/Moderate/Hard/Beast Mode)1
 * - Duration selector (30/45/60/90 min)1
 * - Station preferences (exclude certain exercises)1
 * - "Surprise Me" random generation`
 * - Fitness level selection`
 * 
 * Follows Cal AI-inspired design with smooth animations and intuitive UX.`
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  FitnessLevel, 
  MoodLevel, 
  IntensityLevel, 
  WorkoutDuration, 
  StationName 
} from '@/lib/types';

export interface GeneratorFormProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when workout is generated successfully */
  onWorkoutGenerated: (workout: any) => void;
}

/**
 * Enhanced Workout Generator Modal with Smart Generation Features
 * Now pulls defaults from user profile!
 */
export function GeneratorForm({ isOpen, onClose, onWorkoutGenerated }: GeneratorFormProps) {
  // Form state (initialized from profile)
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>('intermediate');
  const [selectedMood, setSelectedMood] = useState<MoodLevel>('normal');
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>('moderate');
  const [selectedDuration, setSelectedDuration] = useState<WorkoutDuration>(60);
  const [excludedStations, setExcludedStations] = useState<StationName[]>([]);
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  /**
   * Fetch user profile and set defaults
   */
  useEffect(() => {
    if (!isOpen || profileLoaded) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.profile) {
          // Set form defaults from profile
          setSelectedLevel(data.profile.fitness_level || 'intermediate');
          setSelectedMood(data.profile.default_mood || 'normal');
          setSelectedIntensity(data.profile.default_intensity || 'moderate');
          setSelectedDuration(data.profile.default_duration || 60);
          setExcludedStations(data.profile.excluded_stations || []);
        } else if (data.defaults) {
          // Use system defaults if no profile
          setSelectedLevel(data.defaults.fitness_level);
          setSelectedMood(data.defaults.default_mood || 'normal');
          setSelectedIntensity(data.defaults.default_intensity || 'moderate');
          setSelectedDuration(data.defaults.default_duration);
          setExcludedStations(data.defaults.excluded_stations || []);
        }
        
        setProfileLoaded(true);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Continue with defaults if profile fetch fails
        setProfileLoaded(true);
      }
    };

    fetchProfile();
  }, [isOpen, profileLoaded]);

  /**
   * Handles the "Surprise Me" random generation
   */
  const handleSurpriseMe = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fitnessLevel: selectedLevel,
          surpriseMe: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate workout');
      }

      onWorkoutGenerated(data.workout);
      resetAndClose();
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate workout');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handles custom workout generation with all parameters
   */
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fitnessLevel: selectedLevel,
          mood: selectedMood,
          intensity: selectedIntensity,
          duration: selectedDuration,
          excludeStations: excludedStations.length > 0 ? excludedStations : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate workout');
      }

      onWorkoutGenerated(data.workout);
      resetAndClose();
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate workout');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Reset form and close modal
   */
  const resetAndClose = () => {
    setExcludedStations([]);
    setError(null);
    onClose();
  };

  /**
   * Toggle station exclusion
   */
  const toggleStation = (station: StationName) => {
    setExcludedStations(prev =>
      prev.includes(station)
        ? prev.filter(s => s !== station)
        : [...prev, station]
    );
  };

  /**
   * Handle overlay click to close
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetAndClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay background */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* Modal container - slides up from bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Workout</h2>
              <p className="text-sm text-gray-500 mt-1">Adaptive Hyrox training</p>
            </div>
            <button
              onClick={resetAndClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Surprise Me Button - Featured */}
            <div className="relative">
              <button
                onClick={handleSurpriseMe}
                disabled={isGenerating}
                className="w-full p-6 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#F77F00] text-white font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🎲</span>
                  <span>Surprise Me!</span>
                </div>
                <p className="text-sm font-normal mt-1 opacity-90">Random adaptive workout</p>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-medium">Or customize</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💭 How are you feeling today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <MoodButton
                  mood="fresh"
                  emoji="💪"
                  label="Fresh"
                  isSelected={selectedMood === 'fresh'}
                  onClick={() => setSelectedMood('fresh')}
                />
                <MoodButton
                  mood="normal"
                  emoji="😊"
                  label="Normal"
                  isSelected={selectedMood === 'normal'}
                  onClick={() => setSelectedMood('normal')}
                />
                <MoodButton
                  mood="tired"
                  emoji="😴"
                  label="Tired"
                  isSelected={selectedMood === 'tired'}
                  onClick={() => setSelectedMood('tired')}
                />
                <MoodButton
                  mood="exhausted"
                  emoji="🥵"
                  label="Exhausted"
                  isSelected={selectedMood === 'exhausted'}
                  onClick={() => setSelectedMood('exhausted')}
                />
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🔥 Intensity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                <IntensityButton
                  intensity="light"
                  label="Light"
                  color="bg-[#06D6A0]"
                  isSelected={selectedIntensity === 'light'}
                  onClick={() => setSelectedIntensity('light')}
                />
                <IntensityButton
                  intensity="moderate"
                  label="Moderate"
                  color="bg-[#457B9D]"
                  isSelected={selectedIntensity === 'moderate'}
                  onClick={() => setSelectedIntensity('moderate')}
                />
                <IntensityButton
                  intensity="hard"
                  label="Hard"
                  color="bg-[#F77F00]"
                  isSelected={selectedIntensity === 'hard'}
                  onClick={() => setSelectedIntensity('hard')}
                />
                <IntensityButton
                  intensity="beast"
                  label="Beast"
                  color="bg-[#E63946]"
                  isSelected={selectedIntensity === 'beast'}
                  onClick={() => setSelectedIntensity('beast')}
                />
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ⏱️ Workout Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([30, 45, 60, 90] as WorkoutDuration[]).map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`
                      px-4 py-3 rounded-xl font-medium transition-all duration-150
                      ${selectedDuration === duration
                        ? 'bg-[#E63946] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Fitness Level Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🎯 Fitness Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                <FitnessButton
                  level="beginner"
                  label="Beginner"
                  isSelected={selectedLevel === 'beginner'}
                  onClick={() => setSelectedLevel('beginner')}
                />
                <FitnessButton
                  level="intermediate"
                  label="Intermediate"
                  isSelected={selectedLevel === 'intermediate'}
                  onClick={() => setSelectedLevel('intermediate')}
                />
                <FitnessButton
                  level="advanced"
                  label="Advanced"
                  isSelected={selectedLevel === 'advanced'}
                  onClick={() => setSelectedLevel('advanced')}
                />
              </div>
            </div>

            {/* Advanced Options - Station Preferences */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                <span>Station Preferences (Optional)</span>
              </button>
              
              {showAdvanced && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-3">Exclude stations you want to avoid:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['SkiErg', 'Sled Push', 'Sled Pull', 'Burpee Broad Jumps', 'Rowing', 'Farmers Carry', 'Sandbag Lunges', 'Wall Balls'].map((station) => (
                      <label
                        key={station}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={excludedStations.includes(station as StationName)}
                          onChange={() => toggleStation(station as StationName)}
                          className="w-4 h-4 text-[#E63946] rounded border-gray-300 focus:ring-[#E63946]"
                        />
                        <span className="text-sm text-gray-700">{station}</span>
                      </label>
                    ))}
                  </div>
                  {excludedStations.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {excludedStations.length} station{excludedStations.length > 1 ? 's' : ''} excluded
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-semibold">Error generating workout</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Custom Workout'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Mood Button Component
 */
interface MoodButtonProps {
  mood: MoodLevel;
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function MoodButton({ emoji, label, isSelected, onClick }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-xl text-center transition-all duration-150
        ${isSelected
          ? 'bg-[#E63946] text-white shadow-md scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-xs font-medium">{label}</div>
    </button>
  );
}

/**
 * Intensity Button Component
 */
interface IntensityButtonProps {
  intensity: IntensityLevel;
  label: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

function IntensityButton({ label, color, isSelected, onClick }: IntensityButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-xl font-medium text-sm transition-all duration-150
        ${isSelected
          ? `${color} text-white shadow-md scale-105`
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

/**
 * Fitness Level Button Component
 */
interface FitnessButtonProps {
  level: FitnessLevel;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function FitnessButton({ label, isSelected, onClick }: FitnessButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-3 rounded-xl font-medium transition-all duration-150
        ${isSelected
          ? 'bg-[#E63946] text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

export default GeneratorForm;