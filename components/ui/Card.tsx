/**
 * Card Component
 * 
 * iOS-inspired card with no borders, just shadows and spacing.
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
 * Card component with iOS-inspired design
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
  // iOS-style card - no borders, subtle shadow, dark mode support
  const baseStyles = 'bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-card shadow-card dark:shadow-card-dark';

  // Interactive styles - adds hover and press effects
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:shadow-elevated dark:hover:shadow-elevated-dark active:scale-[0.98] transition-all duration-150 ease-out'
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
    <h3 className={`text-xl font-semibold text-light-text-primary dark:text-dark-text-primary ${className}`}>
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
