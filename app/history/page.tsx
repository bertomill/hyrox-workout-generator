/**
 * History Page ^
 * 
 * Displays workout history with stats and list of all logged workouts. ^
 * Features Cal AI-inspired clean design with performance overview. ^
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { WorkoutList } from '@/components/History/WorkoutList';

export default function HistoryPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  /**
   * Fetches summary statistics ^
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/workouts/history?userId=1');
        const data = await response.json();

        if (response.ok) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workout History</h1>
                <p className="text-sm text-gray-600">Track your progress over time</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Overview Cards */}
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

        {/* Workout History Section */}
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
            💡 <span className="font-semibold">Tip:</span> Tap on any workout to expand and see detailed performance data for each station and run.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
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

      {/* Bottom padding to prevent content from being hidden by nav */}
      <div className="h-20" />
    </main>
  );
}

/**
 * Stats Card Component ^
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
