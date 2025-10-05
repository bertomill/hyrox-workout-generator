/**
 * Main Dashboard Page
 * 
 * Home page of the Hyrox Workout Generator app.
 * Displays workout generation interface and shows the active/generated workout.
 * Mobile-first design following Cal AI aesthetic.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GeneratorForm } from '@/components/WorkoutGenerator/GeneratorForm';
import { WorkoutDisplay } from '@/components/WorkoutGenerator/WorkoutDisplay';

export default function HomePage() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for generated workout
  const [currentWorkout, setCurrentWorkout] = useState<any | null>(null);

  /**
   * Handles successful workout generation
   */
  const handleWorkoutGenerated = (workout: any) => {
    setCurrentWorkout(workout);
    console.log('Workout generated:', workout);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hyrox Trainer</h1>
              <p className="text-sm text-gray-600">Your personal workout generator</p>
            </div>
            {/* Streak indicator (placeholder for future) */}
            <div className="flex items-center gap-1 text-[#F77F00]">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-lg">1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Hero Section - Generate Workout */}
        {!currentWorkout ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-6">
                {/* Hero Icon */}
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#E63946] to-[#D62828] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Ready to Train?
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Generate a personalized Hyrox workout based on your fitness level. 
                  8 stations, 8 runs, one complete training session.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="text-lg px-8"
              >
                Generate Workout
              </Button>

              {/* Info Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-[#E63946] font-bold text-2xl mb-1">8</div>
                  <div className="text-sm text-gray-600">Functional Stations</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-[#457B9D] font-bold text-2xl mb-1">8km</div>
                  <div className="text-sm text-gray-600">Total Running</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-900 font-bold text-2xl mb-1">~60</div>
                  <div className="text-sm text-gray-600">Minutes Average</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Display Generated Workout */
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Current Workout</h2>
                <p className="text-sm text-gray-600">Ready to start training</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                New Workout
              </Button>
            </div>
            <WorkoutDisplay workout={currentWorkout} />
          </>
        )}

        {/* Quick Stats Section (Placeholder for Phase 4) */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Workouts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">—</div>
                <div className="text-sm text-gray-600">Best Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">What is Hyrox?</span> A fitness race combining running with 8 functional workout stations. 
            This app helps you train for it by generating structured workout sessions.
          </p>
        </div>
      </div>

      {/* Floating Action Button (FAB) - Alternative CTA */}
      {!currentWorkout && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#E63946] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#D62828] active:scale-95 transition-all duration-150 flex items-center justify-center z-40"
          aria-label="Generate Workout"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>Hyrox Workout Generator • Built for Athletes</p>
      </footer>

      {/* Workout Generator Modal */}
      <GeneratorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWorkoutGenerated={handleWorkoutGenerated}
      />
    </main>
  );
}