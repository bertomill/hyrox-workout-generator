/**
 * Performance Chart Component
 * 
 * Beautiful line chart showing workout performance trends over time.
 * Uses Recharts for responsive, interactive visualizations.
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendDataPoint } from '@/lib/analytics';

export interface PerformanceChartProps {
  data: TrendDataPoint[];
  title?: string;
  color?: string;
}

/**
 * Custom tooltip for the chart
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-900">{data.date}</p>
      <p className="text-lg font-bold text-[#E63946]">{data.timeFormatted}</p>
      <p className="text-xs text-gray-600 capitalize">{data.fitnessLevel} Level</p>
    </div>
  );
};

/**
 * Format seconds to MM:SS for Y-axis
 */
const formatYAxis = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export function PerformanceChart({ data, title = 'Performance Trend', color = '#E63946' }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-600 font-medium">Not enough data yet</p>
        <p className="text-sm text-gray-500 mt-1">Complete at least 2 workouts to see trends</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
            name="Overall Time (seconds)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Trend Indicator */}
      {data.length >= 2 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {data[0].time > data[data.length - 1].time ? (
            <>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-sm font-medium text-green-600">
                Improving! {Math.round((data[0].time - data[data.length - 1].time) / 60)} min faster
              </span>
            </>
          ) : data[0].time < data[data.length - 1].time ? (
            <>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-orange-600">
                Keep pushing! Times are up slightly
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-600">
              Maintaining consistent performance
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default PerformanceChart;
