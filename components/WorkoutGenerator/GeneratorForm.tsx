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
  WorkoutType,
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
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>('moderate');
  const [selectedDuration, setSelectedDuration] = useState<WorkoutDuration>(60);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType>('standard');
  const [excludedStations, setExcludedStations] = useState<StationName[]>([]);
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [workoutRecommendation, setWorkoutRecommendation] = useState<{
    recommendation: WorkoutType | null;
    message: string;
    analysis: any;
  } | null>(null);

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
          setSelectedIntensity(data.profile.default_intensity || 'moderate');
          setSelectedDuration(data.profile.default_duration || 60);
          setExcludedStations(data.profile.excluded_stations || []);
        } else if (data.defaults) {
          // Use system defaults if no profile
          setSelectedLevel(data.defaults.fitness_level);
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
   * Fetch workout recommendations
   */
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await fetch('/api/workouts/recommend');
        const data = await response.json();

        if (data.success && data.analysis) {
          setWorkoutRecommendation({
            recommendation: data.analysis.recommendation,
            message: data.analysis.message,
            analysis: data.analysis
          });

          // Auto-select recommended workout type if available
          if (data.analysis.recommendation) {
            setSelectedWorkoutType(data.analysis.recommendation);
          }
        }
      } catch (error) {
        console.error('Error loading workout recommendations:', error);
      }
    };

    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen]);

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
          intensity: selectedIntensity,
          duration: selectedDuration,
          workoutType: selectedWorkoutType,
          excludeStations: excludedStations.length > 0 ? excludedStations : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate workout');
      }

      onWorkoutGenerated(data.workout);
      setShowSuccess(true);
      // Auto-close after 2 seconds
      setTimeout(() => {
        resetAndClose();
      }, 2000);
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
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-3xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generate Workout</h2>
          <p className="text-sm text-gray-600 mt-1">Adaptive Hyrox training</p>
        </div>
        <button
          onClick={resetAndClose}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Close"
        >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6 bg-white">
        {/* Workout Recommendation Banner */}
        {workoutRecommendation && workoutRecommendation.recommendation && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  💡 Smart Recommendation
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  {workoutRecommendation.message}
                </p>
                <div className="text-xs text-blue-700">
                  <strong>Selected:</strong> {workoutRecommendation.recommendation === 'recovery' ? 'Recovery' : 
                    workoutRecommendation.recommendation === 'long_run' ? 'Long Run' : 'Standard'} workout
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button - Primary Action */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Workout'}
        </Button>

        {/* Customize Toggle */}
        <button
          onClick={() => setShowCustomize(!showCustomize)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
        >
              <span>{showCustomize ? '▼' : '▶'}</span>
              <span>{showCustomize ? 'Hide' : 'Customize'} Workout Options</span>
            </button>

            {/* Collapsible Customization Options */}
            {showCustomize && (
              <div className="space-y-6 pt-2">

            {/* Workout Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                🎯 Workout Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <WorkoutTypeButton
                  type="standard"
                  emoji="🏋️‍♂️"
                  label="Standard"
                  description="4-10 runs, 4-10 stations"
                  isSelected={selectedWorkoutType === 'standard'}
                  onClick={() => setSelectedWorkoutType('standard')}
                />
                <WorkoutTypeButton
                  type="recovery"
                  emoji="🧘‍♂️"
                  label="Recovery"
                  description="2-4 runs, 2-4 stations"
                  isSelected={selectedWorkoutType === 'recovery'}
                  onClick={() => setSelectedWorkoutType('recovery')}
                />
                <WorkoutTypeButton
                  type="long_run"
                  emoji="🏃‍♂️"
                  label="Long Run"
                  description="8-12 runs, 0-2 stations"
                  isSelected={selectedWorkoutType === 'long_run'}
                  onClick={() => setSelectedWorkoutType('long_run')}
                />
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
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
              <label className="block text-sm font-semibold text-gray-900 mb-3">
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
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
              <label className="block text-sm font-semibold text-gray-900 mb-3">
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
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                <span>Station Preferences (Optional)</span>
              </button>
              
              {showAdvanced && (
                <div className="mt-3 p-4 bg-gray-100 rounded-xl">
                  <p className="text-xs text-gray-700 mb-3">Exclude stations you want to avoid:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['SkiErg', 'Sled Push', 'Sled Pull', 'Burpee Broad Jumps', 'Rowing', 'Farmers Carry', 'Sandbag Lunges', 'Wall Balls', 'Push-ups'].map((station) => (
                      <label
                        key={station}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={excludedStations.includes(station as StationName)}
                          onChange={() => toggleStation(station as StationName)}
                          className="w-4 h-4 text-[#E63946] rounded border-gray-200 focus:ring-[#E63946]"
                        />
                        <span className="text-sm text-gray-900">{station}</span>
                      </label>
                    ))}
                  </div>
                  {excludedStations.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      {excludedStations.length} station{excludedStations.length > 1 ? 's' : ''} excluded
                    </p>
                  )}
                </div>
              )}
            </div>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <div className="flex-1">
                    <p className="font-semibold">Workout Generated!</p>
                    <p className="mt-1">Redirecting to your new workout...</p>
                    <button
                      onClick={() => {
                        setShowSuccess(false);
                        setError(null);
                        handleGenerate();
                      }}
                      className="mt-3 px-4 py-2 bg-[#E63946] text-white rounded-lg text-sm font-semibold hover:bg-[#D62828] transition-colors"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Mood Button Component
 */

/**
 * Workout Type Button Component
 */
interface WorkoutTypeButtonProps {
  type: WorkoutType;
  emoji: string;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function WorkoutTypeButton({ emoji, label, description, isSelected, onClick }: WorkoutTypeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-xl text-left transition-all duration-150
        ${isSelected
          ? 'bg-[#E63946] text-white shadow-md scale-105'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }
      `}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs opacity-80 mt-1">{description}</div>
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
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

export default GeneratorForm;