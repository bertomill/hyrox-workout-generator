/**
 * Time Input Component ^
 * 
 * Specialized input for time entry in MM:SS format. ^
 * Features auto-formatting, validation, and auto-advance to next field. ^
 * Follows Cal AI design aesthetic with clean, intuitive interface. ^
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface TimeInputProps {
  /** Label for the input */
  label: string;
  /** Current time value in MM:SS format */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Auto-focus this field */
  autoFocus?: boolean;
  /** Callback when Enter key is pressed */
  onEnter?: () => void;
  /** Optional ID for the input */
  id?: string;
}

/**
 * Time Input component with MM:SS format validation
 * 
 * Usage:
 * <TimeInput 
 *   label="Station 1: SkiErg" 
 *   value={time}
 *   onChange={setTime}
 * />
 */
export function TimeInput({
  label,
  value,
  onChange,
  placeholder = 'MM:SS',
  required = false,
  autoFocus = false,
  onEnter,
  id,
}: TimeInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local value when prop changes ^
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Formats time input to MM:SS as user types ^
   */
  const formatTimeInput = (input: string): string => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Limit to 4 digits (MMSS)
    const limitedDigits = digits.slice(0, 4);
    
    if (limitedDigits.length === 0) {
      return '';
    } else if (limitedDigits.length <= 2) {
      // Just minutes
      return limitedDigits;
    } else {
      // Minutes and seconds with colon ^
      const minutes = limitedDigits.slice(0, -2);
      const seconds = limitedDigits.slice(-2);
      return `${minutes}:${seconds}`;
    }
  };

  /**
   * Validates time format (MM:SS) ^
   */
  const validateTime = (time: string): boolean => {
    if (!time) return !required;

    const timeRegex = /^(\d{1,3}):([0-5]\d)$/;
    const match = time.match(timeRegex);
    
    if (!match) {
      setError('Invalid format. Use MM:SS');
      return false;
    }

    const [, minutes, seconds] = match;
    const mins = parseInt(minutes);
    const secs = parseInt(seconds);

    if (mins > 999) {
      setError('Minutes cannot exceed 999');
      return false;
    }

    if (secs > 59) {
      setError('Seconds cannot exceed 59');
      return false;
    }

    setError(null);
    return true;
  };

  /**
   * Handles input changes with auto-formatting ^
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatTimeInput(input);
    
    setLocalValue(formatted);
    onChange(formatted);
    
    // Clear error on change
    if (error) setError(null);
  };

  /**
   * Handles blur event for validation ^
   */
  const handleBlur = () => {
    setIsFocused(false);
    validateTime(localValue);
  };

  /**
   * Handles Enter key press ^
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      if (validateTime(localValue)) {
        onEnter();
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Label */}
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`
          px-4 py-3 rounded-lg border-2 transition-all duration-150
          font-mono text-lg text-gray-900
          focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-[#E63946]
          ${error 
            ? 'border-red-300 bg-red-50' 
            : isFocused 
              ? 'border-[#E63946]' 
              : 'border-gray-200 hover:border-gray-300'
          }
        `}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && isFocused && (
        <p className="mt-1 text-xs text-gray-500">
          Enter time in minutes:seconds format (e.g., 4:30)
        </p>
      )}
    </div>
  );
}

export default TimeInput;
