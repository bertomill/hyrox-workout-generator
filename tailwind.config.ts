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
        // Roxify Brand Colors - Referenced from CSS variables
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        
        // Dark Mode Colors - Referenced from CSS variables
        dark: {
          bg: {
            primary: "var(--bg-primary)",
            secondary: "var(--bg-secondary)",
            tertiary: "var(--bg-tertiary)",
          },
          text: {
            primary: "var(--text-primary)",
            secondary: "var(--text-secondary)",
            tertiary: "var(--text-tertiary)",
          },
          border: "var(--border)",
        },
        
        // Light Mode Colors - Referenced from CSS variables
        light: {
          bg: {
            primary: "var(--bg-primary)",
            secondary: "var(--bg-secondary)",
            tertiary: "var(--bg-tertiary)",
          },
          text: {
            primary: "var(--text-primary)",
            secondary: "var(--text-secondary)",
            tertiary: "var(--text-tertiary)",
          },
          border: "var(--border)",
        },
        
        // Data Visualization (work in both modes)
        chart: {
          cyan: "#06D6A0",
          blue: "#7EC8E3",
          purple: "#A855F7",
          orange: "#FFB366",
          pink: "#FF6B6B",
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
