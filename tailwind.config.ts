/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Roxify Brand Colors
        primary: "#E63946",
        secondary: "#457B9D",
        accent: "#F77F00",
        success: "#06D6A0",
        warning: "#FCA311",
        error: "#D62828",
        
        // WHOOP-Inspired Dark Mode Colors
        dark: {
          bg: {
            primary: "#1F2937",   // Deep charcoal background
            secondary: "#374151", // Card background
            tertiary: "#4B5563",  // Elevated elements
          },
          text: {
            primary: "#F9FAFB",   // White/off-white
            secondary: "#D1D5DB", // Light gray
            tertiary: "#9CA3AF",  // Muted gray
          },
          border: "#4B5563",      // Subtle borders
        },
        
        // Light Mode Colors (refined)
        light: {
          bg: {
            primary: "#F9FAFB",   // Light gray background
            secondary: "#FFFFFF", // Card background
            tertiary: "#F3F4F6",  // Subtle backgrounds
          },
          text: {
            primary: "#111827",   // Near black
            secondary: "#374151", // Dark gray
            tertiary: "#6B7280",  // Medium gray
          },
          border: "#E5E7EB",      // Light borders
        },
        
        // Data Visualization (work in both modes)
        chart: {
          cyan: "#06D6A0",        // Bright cyan
          blue: "#7EC8E3",        // Light blue
          purple: "#A855F7",      // Purple
          orange: "#FFB366",      // Orange
          pink: "#FF6B6B",        // Coral/pink
        },
      },
      
      // WHOOP-inspired spacing
      borderRadius: {
        'card': '16px',
        'stat': '12px',
      },
      
      // Font families (system fonts like WHOOP)
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      
      // Box shadows for elevation
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'elevated-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
