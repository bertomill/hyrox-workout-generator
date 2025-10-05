/**
 * Main Dashboard Page
 * 
 * Home page of Roxify - your adaptive Hyrox training companion.
 * Displays workout generation interface and shows the active/generated workout.
 * Mobile-first design following Cal AI aesthetic.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GeneratorForm } from '@/components/WorkoutGenerator/GeneratorForm';
import { WorkoutDisplay } from '@/components/WorkoutGenerator/WorkoutDisplay';
import { LogForm } from '@/components/WorkoutLogger/LogForm';

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for generated workout
  const [currentWorkout, setCurrentWorkout] = useState<any | null>(null);
  
  // State for showing log form
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
  
  // State for logged workouts count
  const [loggedWorkoutsCount, setLoggedWorkoutsCount] = useState(0);
  
  // State for user
  const [user, setUser] = useState<any | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Check auth status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoadingAuth(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  /**
   * Handles successful workout generation
   */
  const handleWorkoutGenerated = (workout: any) => {
    setCurrentWorkout(workout);
    setIsLoggingWorkout(false);
    console.log('Workout generated:', workout);
  };
  
  /**
   * Handles successful workout logging
   */
  const handleWorkoutLogged = (workoutLog: any) => {
    console.log('Workout logged:', workoutLog);
    setLoggedWorkoutsCount(prev => prev + 1);
    setIsLoggingWorkout(false);
    // Update workout status
    if (currentWorkout) {
      setCurrentWorkout({
        ...currentWorkout,
        status: 'completed',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roxify</h1>
              <p className="text-sm text-gray-600">
                {user ? `Welcome, ${user.user_metadata?.name || user.email}` : 'Train Smarter for Hyrox'}
              </p>
            </div>
            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {user ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.refresh();
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="secondary" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}</div>
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
          /* Display Generated Workout or Log Form */
          <>
            {!isLoggingWorkout ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Current Workout</h2>
                    <p className="text-sm text-gray-600">
                      {currentWorkout.status === 'completed' ? 'Completed!' : 'Ready to start training'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {currentWorkout.status !== 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsLoggingWorkout(true)}
                      >
                        Log Workout
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                    >
                      New Workout
                    </Button>
                  </div>
                </div>
                <WorkoutDisplay workout={currentWorkout} />
                
                {/* Completion Badge */}
                {currentWorkout.status === 'completed' && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#06D6A0] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-green-900">Workout Completed!</div>
                      <div className="text-sm text-green-700">Great job! Check your progress to see your results.</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Log Form */
              <LogForm
                workout={currentWorkout}
                onWorkoutLogged={handleWorkoutLogged}
                onCancel={() => setIsLoggingWorkout(false)}
              />
            )}
          </>
        )}

        {/* Quick Stats Section` */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{loggedWorkoutsCount}</div>
                <div className="text-sm text-gray-600">Workouts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">—</div>
                <div className="text-sm text-gray-600">Best Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{loggedWorkoutsCount > 0 ? '1' : '0'}</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner `*/}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-[#E63946] font-semibold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs">Progress</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom padding to prevent content from being hidden by nav */}
      <div className="h-20" />

      {/* Workout Generator Modal */}
      <GeneratorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWorkoutGenerated={handleWorkoutGenerated}
      />
    </main>
  );
}