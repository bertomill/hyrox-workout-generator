/**
 * History Page
 * 
 * Displays workout history with stats and list of all logged workouts.
 * Features Cal AI-inspired clean design with performance overview.
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { WorkoutList } from '@/components/History/WorkoutList';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PerformanceChart } from '@/components/Analytics/PerformanceChart';
import { PRCard } from '@/components/Analytics/PRCard';
import { prepareTrendData, getCurrentPRs, WorkoutAnalytics } from '@/lib/analytics';

// Dynamic import to prevent SSR issues with theme
const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), { ssr: false });

export default function HistoryPage() {
  const [stats, setStats] = useState<any>(null);
  const [workouts, setWorkouts] = useState<WorkoutAnalytics[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  /**
   * Fetches summary statistics and workout history
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/workouts/history');
        const data = await response.json();

        if (response.ok) {
          setStats(data.stats);
          setWorkouts(data.workouts || []);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchData();
  }, []);

  // Prepare analytics data
  const trendData = prepareTrendData(workouts, 10);
  const prs = getCurrentPRs(workouts);

  return (
    <main className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors duration-200">
      {/* Header */}
      <header className="bg-light-bg-secondary dark:bg-dark-bg-secondary sticky top-0 z-30 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Workout History</h1>
                <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">Track your progress over time</p>
              </div>
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content` */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Overview Cards` */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatsCard
            label="Total Workouts"
            value={stats?.totalWorkouts || 0}
            icon="📊"
            isLoading={isLoadingStats}
          />
          <StatsCard
            label="Current Streak"
            value={`${stats?.recentStreak || 0} days`}
            icon="🔥"
            isLoading={isLoadingStats}
            highlight={stats?.recentStreak > 0}
          />
          <StatsCard
            label="Best Time"
            value={stats?.bestTimeFormatted || '—'}
            icon="⚡"
            isLoading={isLoadingStats}
          />
          <StatsCard
            label="Avg Time"
            value={stats?.averageTimeFormatted || '—'}
            icon="📈"
            isLoading={isLoadingStats}
          />
        </div>

        {/* Performance Chart - Visual Trends */}
        {workouts.length >= 2 && (
          <Card>
            <CardContent className="p-6">
              <PerformanceChart data={trendData} title="📈 Performance Trend" />
            </CardContent>
          </Card>
        )}

        {/* Personal Records Section */}
        {prs.overall && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🏆</span>
              Personal Records
            </h2>
            
            {/* Overall PR - Prominent */}
            <PRCard record={prs.overall} />
            
            {/* Recent Station PRs */}
            {prs.stations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prs.stations.slice(0, 4).map((pr, index) => (
                  <PRCard key={`${pr.name}-${pr.workoutId}`} record={pr} rank={index + 1} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Ring Overview - Visual Polish */}
        {stats && stats.totalWorkouts > 0 && (
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* Completion Rate */}
                <div className="text-center">
                  <ProgressRing
                    progress={100}
                    size={100}
                    strokeWidth={8}
                    color="#06D6A0"
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">100%</div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                  </ProgressRing>
                  <p className="text-xs text-gray-600 mt-2">Completion Rate</p>
                </div>

                {/* Progress vs Goal (example: 10 workouts goal) */}
                <div className="text-center">
                  <ProgressRing
                    progress={Math.min((stats.totalWorkouts / 10) * 100, 100)}
                    size={100}
                    strokeWidth={8}
                    color="#E63946"
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{stats.totalWorkouts}</div>
                      <div className="text-xs text-gray-600">of 10</div>
                    </div>
                  </ProgressRing>
                  <p className="text-xs text-gray-600 mt-2">Monthly Goal</p>
                </div>

                {/* Consistency (based on streak) */}
                <div className="text-center">
                  <ProgressRing
                    progress={Math.min((stats.recentStreak / 7) * 100, 100)}
                    size={100}
                    strokeWidth={8}
                    color="#F77F00"
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{stats.recentStreak}</div>
                      <div className="text-xs text-gray-600">days</div>
                    </div>
                  </ProgressRing>
                  <p className="text-xs text-gray-600 mt-2">Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout History Section` */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutList userId={1} />
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-900">
            💡 <span className="font-semibold">Tip:</span> Tap on any workout to expand, edit notes, or see detailed performance data for each station and run.
          </p>
        </div>
      </div>

      {/* Bottom Navigation `*/}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/history"
              className="flex flex-col items-center gap-1 text-[#E63946] font-semibold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs">Progress</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom padding to prevent content from being hidden by nav` */}
      <div className="h-20" />
    </main>
  );
}

/**
 * Stats Card Component` ^
 */
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  isLoading?: boolean;
  highlight?: boolean;
}

function StatsCard({ label, value, icon, isLoading, highlight }: StatsCardProps) {
  return (
    <Card className={highlight ? 'border-2 border-[#F77F00] bg-orange-50' : ''}>
      <CardContent className="p-4 text-center">
        <div className="text-2xl mb-1">{icon}</div>
        {isLoading ? (
          <div className="h-8 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
          </div>
        ) : (
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        )}
        <div className="text-xs text-gray-600">{label}</div>
      </CardContent>
    </Card>
  );
}
