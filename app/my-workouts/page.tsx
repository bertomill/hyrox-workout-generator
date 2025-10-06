/**
 * My Workouts Page
 * 
 * Personal workout builder and manager for custom Hyrox workouts.
 * Users can create, edit, and manage their own workout templates.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { WorkoutBuilderForm } from '@/components/WorkoutBuilder/WorkoutBuilderForm';

interface CustomWorkout {
  id: number;
  workout_name: string;
  description: string;
  workout_details: any;
  tags: string[];
  created_at: string;
}

export default function MyWorkoutsPage() {
  const [workouts, setWorkouts] = useState<CustomWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<CustomWorkout | null>(null);

  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      loadCustomWorkouts();
    }
  };

  const loadCustomWorkouts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('source', 'user_created')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error loading custom workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkout = async (workoutData: any) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          workout_name: workoutData.workout_name,
          description: workoutData.description,
          tags: workoutData.tags,
          workout_details: workoutData.workout_details,
          source: 'user_created',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      setWorkouts(prev => [data, ...prev]);
      setShowCreateForm(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleEditWorkout = (workout: CustomWorkout) => {
    setEditingWorkout(workout);
    setShowCreateForm(true);
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">My Workouts</h1>
            <p className="text-gray-600 mb-6">Please sign in to access your custom workouts.</p>
            <Link href="/login">
              <Button variant="primary">Sign In</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Workouts</h1>
              <p className="text-sm text-gray-600 mt-1">Create and manage your custom Hyrox workouts</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="primary"
              size="sm"
            >
              + Create Workout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63946] mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading your workouts...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No custom workouts yet</h3>
            <p className="text-gray-600 mb-6">Create your first custom Hyrox workout to get started.</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="primary"
            >
              Create Your First Workout
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{workout.workout_name}</CardTitle>
                      {workout.description && (
                        <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleEditWorkout(workout)}
                      >
                        Edit
                      </Button>
                      <Button variant="secondary" size="sm">
                        Use as Template
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Created {new Date(workout.created_at).toLocaleDateString()}</span>
                    {workout.tags && workout.tags.length > 0 && (
                      <div className="flex gap-1">
                        {workout.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white z-30 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs">Progress</span>
            </Link>
            <Link
              href="/my-workouts"
              className="flex flex-col items-center gap-1 text-[#E63946] font-semibold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-xs">My Workouts</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom padding to prevent content from being hidden by nav */}
      <div className="h-20" />

      {/* Workout Builder Form */}
      <WorkoutBuilderForm
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingWorkout(null);
        }}
        onSave={handleSaveWorkout}
        initialWorkout={editingWorkout}
      />
    </main>
  );
}
