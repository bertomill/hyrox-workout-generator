'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { FitnessLevel, MoodLevel, IntensityLevel, WorkoutDuration, StationName } from '@/lib/types';

// Dynamic import for theme toggle
const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), { ssr: false });

// Station options for exclusion
const ALL_STATIONS: StationName[] = [
  'SkiErg',
  'Sled Push',
  'Sled Pull',
  'Burpee Broad Jumps',
  'Rowing',
  'Farmers Carry',
  'Sandbag Lunges',
  'Wall Balls',
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile form state
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('intermediate');
  const [goals, setGoals] = useState('');
  const [defaultMood, setDefaultMood] = useState<MoodLevel | ''>('');
  const [defaultIntensity, setDefaultIntensity] = useState<IntensityLevel | ''>('');
  const [defaultDuration, setDefaultDuration] = useState<WorkoutDuration>(60);
  const [excludedStations, setExcludedStations] = useState<StationName[]>([]);

  // Fetch user and profile on mount
  useEffect(() => {
    async function loadUserAndProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      // Fetch user profile
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data.profile) {
          setFitnessLevel(data.profile.fitness_level || 'intermediate');
          setGoals(data.profile.goals || '');
          setDefaultMood(data.profile.default_mood || '');
          setDefaultIntensity(data.profile.default_intensity || '');
          setDefaultDuration(data.profile.default_duration || 60);
          setExcludedStations(data.profile.excluded_stations || []);
        } else if (data.defaults) {
          // Use defaults if no profile exists
          setFitnessLevel(data.defaults.fitness_level);
          setGoals(data.defaults.goals);
          setDefaultMood(data.defaults.default_mood || '');
          setDefaultIntensity(data.defaults.default_intensity || '');
          setDefaultDuration(data.defaults.default_duration);
          setExcludedStations(data.defaults.excluded_stations || []);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserAndProfile();
  }, [router]);

  // Handle profile save
  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fitness_level: fitnessLevel,
          goals,
          default_mood: defaultMood || null,
          default_intensity: defaultIntensity || null,
          default_duration: defaultDuration,
          excluded_stations: excludedStations,
        }),
      });
      
      if (response.ok) {
        alert('✅ Profile saved successfully!');
      } else {
        alert('❌ Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Toggle station exclusion
  const toggleStationExclusion = (station: StationName) => {
    if (excludedStations.includes(station)) {
      setExcludedStations(excludedStations.filter(s => s !== station));
    } else {
      setExcludedStations([...excludedStations, station]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg-primary flex items-center justify-center">
        <div className="text-light-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-light-bg-primary transition-colors duration-200">
      {/* Header */}
      <header className="bg-light-bg-secondary sticky top-0 z-30 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-light-text-primary">Profile</h1>
              <p className="text-sm text-light-text-tertiary">
                {user?.user_metadata?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/">
                <Button variant="secondary" size="sm">← Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Form */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Fitness Level */}
        <Card>
          <CardHeader>
            <CardTitle>Fitness Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setFitnessLevel(level)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    fitnessLevel === level
                      ? 'bg-primary text-white shadow-elevated dark:shadow-elevated-dark'
                      : 'bg-light-bg-tertiary text-light-text-secondary hover:bg-light-border'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Training Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="What are your Hyrox goals? (e.g., Complete first race, improve time, build endurance...)"
              className="w-full px-4 py-3 rounded-lg bg-light-bg-tertiary text-light-text-primary placeholder-light-text-tertiary border-0 focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Default Workout Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Default Workout Preferences</CardTitle>
            <p className="text-sm text-light-text-tertiary mt-1">
              These will be pre-selected when generating workouts (optional)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Default Mood */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">
                Default Mood
              </label>
              <select
                value={defaultMood}
                onChange={(e) => setDefaultMood(e.target.value as MoodLevel | '')}
                className="w-full px-4 py-3 rounded-lg bg-light-bg-tertiary text-light-text-primary border-0 focus:ring-2 focus:ring-primary"
              >
                <option value="">None (choose each time)</option>
                <option value="fresh">Fresh 💪</option>
                <option value="normal">Normal 😊</option>
                <option value="tired">Tired 😴</option>
                <option value="exhausted">Exhausted 😩</option>
              </select>
            </div>

            {/* Default Intensity */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">
                Default Intensity
              </label>
              <select
                value={defaultIntensity}
                onChange={(e) => setDefaultIntensity(e.target.value as IntensityLevel | '')}
                className="w-full px-4 py-3 rounded-lg bg-light-bg-tertiary text-light-text-primary border-0 focus:ring-2 focus:ring-primary"
              >
                <option value="">None (choose each time)</option>
                <option value="light">Light ⚪</option>
                <option value="moderate">Moderate 🟡</option>
                <option value="hard">Hard 🟠</option>
                <option value="beast">Beast Mode 🔴</option>
              </select>
            </div>

            {/* Default Duration */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-2">
                Default Duration
              </label>
              <div className="grid grid-cols-4 gap-3">
                {([30, 45, 60, 90] as WorkoutDuration[]).map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setDefaultDuration(duration)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      defaultDuration === duration
                        ? 'bg-primary text-white shadow-card dark:shadow-card-dark'
                        : 'bg-light-bg-tertiary text-light-text-secondary'
                    }`}
                  >
                    {duration}m
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Excluded Stations */}
        <Card>
          <CardHeader>
            <CardTitle>Stations to Exclude</CardTitle>
            <p className="text-sm text-light-text-tertiary mt-1">
              Select exercises you want to avoid in your workouts
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {ALL_STATIONS.map((station) => (
                <button
                  key={station}
                  onClick={() => toggleStationExclusion(station)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    excludedStations.includes(station)
                      ? 'bg-error text-white shadow-card dark:shadow-card-dark'
                      : 'bg-light-bg-tertiary text-light-text-secondary'
                  }`}
                >
                  {excludedStations.includes(station) ? '✕ ' : ''}{station}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Link href="/">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '✅ Save Profile'}
          </Button>
        </div>
      </div>
    </main>
  );
}

