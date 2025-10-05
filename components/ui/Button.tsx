/**
 * Button Component
 * 
 * Reusable button component with multiple variants following the Cal AI design aesthetic.
 * Supports primary, secondary, and icon button styles with loading states.
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'icon';
  /** Loading state shows spinner */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Child elements */
  children: React.ReactNode;
}

/**
 * Button component with Cal AI-inspired styling
 * 
 * Usage:
 * <Button variant="primary" onClick={handleClick}>Generate Workout</Button>
 * <Button variant="secondary" isLoading>Processing...</Button>
 */
export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base button styles
  const baseStyles = 'font-semibold rounded-lg transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  // Variant styles
  const variantStyles = {
    primary: 'bg-[#E63946] text-white hover:bg-[#D62828] focus:ring-[#E63946] shadow-sm',
    secondary: 'bg-white text-[#E63946] border-2 border-[#E63946] hover:bg-[#FEF2F2] focus:ring-[#E63946]',
    icon: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          {/* Loading spinner */}
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
