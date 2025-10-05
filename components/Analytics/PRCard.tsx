/**
 * Personal Record Card Component
 * 
 * Displays personal records (PRs) with celebration styling.
 * Shows overall best time and recent station PRs.
 */

'use client';

import React from 'react';
import { PersonalRecord } from '@/lib/analytics';

export interface PRCardProps {
  record: PersonalRecord;
  rank?: number;
}

/**
 * Get emoji and color for PR type
 */
function getPRStyling(type: PersonalRecord['type']): { emoji: string; color: string; bgColor: string } {
  switch (type) {
    case 'overall':
      return { emoji: '🏆', color: '#E63946', bgColor: 'bg-red-50' };
    case 'station':
      return { emoji: '⚡', color: '#457B9D', bgColor: 'bg-blue-50' };
    case 'run':
      return { emoji: '🏃', color: '#06D6A0', bgColor: 'bg-green-50' };
    default:
      return { emoji: '⭐', color: '#F77F00', bgColor: 'bg-orange-50' };
  }
}

export function PRCard({ record, rank }: PRCardProps) {
  const styling = getPRStyling(record.type);
  const achievedDate = new Date(record.achievedAt);
  const isRecent = Date.now() - achievedDate.getTime() < 7 * 24 * 60 * 60 * 1000; // Within last 7 days

  return (
    <div className={`${styling.bgColor} rounded-xl p-4 border border-gray-100 relative overflow-hidden`}>
      {/* Rank badge for top PRs */}
      {rank !== undefined && rank <= 3 && (
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: styling.color }}
        >
          {rank}
        </div>
      )}

      {/* New badge for recent PRs */}
      {isRecent && (
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-white animate-pulse">
          NEW
        </div>
      )}

      {/* PR Content */}
      <div className="flex items-start gap-3">
        <div className="text-3xl">{styling.emoji}</div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{record.name}</h4>
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono" style={{ color: styling.color }}>
              {record.timeFormatted}
            </span>
            
            {record.improvement && record.improvement > 0 && (
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                -{Math.floor(record.improvement / 60)}:{(record.improvement % 60).toString().padStart(2, '0')} better
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-1">
            {achievedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PRCard;
