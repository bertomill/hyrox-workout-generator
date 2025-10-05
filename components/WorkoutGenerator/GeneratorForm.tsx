/**
 * Workout Generator Form Component
 * 
 * Modal interface for generating a new Hyrox workout.
 * Allows user to select fitness level (beginner/intermediate/advanced) and triggers workout generation.
 * Features bottom slide-up animation following iOS/Cal AI design patterns.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FitnessLevel } from '@/lib/types';

export interface GeneratorFormProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when workout is generated successfully */
  onWorkoutGenerated: (workout: any) => void;
}

/**
 * Workout Generator Modal
 * 
 * Usage:
 * <GeneratorForm 
 *   isOpen={isModalOpen} 
 *   onClose={() => setIsModalOpen(false)}
 *   onWorkoutGenerated={(workout) => console.log(workout)}
 * />
 */
export function GeneratorForm({ isOpen, onClose, onWorkoutGenerated }: GeneratorFormProps) {
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles workout generation API call
   */
  const handleGenerate = async () => {
    if (!selectedLevel) {
      setError('Please select a fitness level');
      return;
    }

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
          userId: 1, // MVP: hardcoded user ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate workout');
      }

      // Success! Pass workout to parent component
      onWorkoutGenerated(data.workout);
      
      // Reset form and close modal
      setSelectedLevel(null);
      onClose();
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate workout');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Close modal when clicking overlay
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay background */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* Modal container - slides up from bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Generate Workout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Select your fitness level to generate a personalized Hyrox workout
            </p>

            {/* Fitness Level Selection Cards */}
            <div className="space-y-3 mb-6">
              <FitnessLevelCard
                level="beginner"
                title="Beginner"
                description="New to Hyrox or fitness training"
                isSelected={selectedLevel === 'beginner'}
                onClick={() => setSelectedLevel('beginner')}
              />
              <FitnessLevelCard
                level="intermediate"
                title="Intermediate"
                description="Regular training, comfortable with intensity"
                isSelected={selectedLevel === 'intermediate'}
                onClick={() => setSelectedLevel('intermediate')}
              />
              <FitnessLevelCard
                level="advanced"
                title="Advanced"
                description="Experienced athlete, competitive level"
                isSelected={selectedLevel === 'advanced'}
                onClick={() => setSelectedLevel('advanced')}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!selectedLevel || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Workout'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Fitness Level Selection Card
 * Individual card for each fitness level option
 */
interface FitnessLevelCardProps {
  level: FitnessLevel;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function FitnessLevelCard({ 
  title, 
  description, 
  isSelected, 
  onClick 
}: FitnessLevelCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-150
        ${isSelected 
          ? 'border-[#E63946] bg-[#FEF2F2] shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {/* Selection indicator */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${isSelected ? 'border-[#E63946] bg-[#E63946]' : 'border-gray-300'}
        `}>
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

export default GeneratorForm;
