/**
 * Card Component
 * 
 * Reusable card container component following the Cal AI design aesthetic.
 * Used for workout displays, stats, and content sections throughout the app.
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether card is interactive (clickable) */
  interactive?: boolean;
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Child elements */
  children: React.ReactNode;
}

/**
 * Card component with clean, modern styling
 * 
 * Usage:
 * <Card>Content goes here</Card>
 * <Card interactive onClick={handleClick}>Clickable card</Card>
 */
export function Card({
  interactive = false,
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  // Base card styles - white background, rounded corners, subtle shadow
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100';

  // Interactive styles - adds hover and press effects
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-150 ease-out'
    : '';

  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header - For card titles and headers
 */
export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Title - Styled title for card headers
 */
export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Card Content - Main content area
 */
export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export default Card;
