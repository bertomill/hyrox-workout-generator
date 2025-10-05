/**
 * Progress Ring Component
 * 
 * Circular progress indicator for displaying workout completion or performance metrics.
 * Used in the Cal AI-inspired aesthetic for visual polish.
 */

import React from 'react';

interface ProgressRingProps {
  /** Progress value between 0 and 100 */
  progress: number;
  /** Size of the ring in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Color of the progress ring */
  color?: string;
  /** Color of the background ring */
  backgroundColor?: string;
  /** Content to display in the center */
  children?: React.ReactNode;
  /** Label text below the percentage */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ProgressRing component displays a circular progress indicator
 * with customizable colors, size, and center content.
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#E63946',
  backgroundColor = '#E5E7EB',
  children,
  label,
  className = '',
}: ProgressRingProps) {
  // Calculate SVG properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(progress)}%
            </div>
            {label && (
              <div className="text-xs text-gray-600 mt-1">{label}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Mini Progress Ring - Smaller version for inline use
 */
export function MiniProgressRing({
  progress,
  color = '#E63946',
  className = '',
}: {
  progress: number;
  color?: string;
  className?: string;
}) {
  return (
    <ProgressRing
      progress={progress}
      size={40}
      strokeWidth={4}
      color={color}
      className={className}
    >
      <span className="text-xs font-semibold text-gray-900">
        {Math.round(progress)}
      </span>
    </ProgressRing>
  );
}
