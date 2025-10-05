/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E63946",
        secondary: "#457B9D",
        accent: "#F77F00",
        success: "#06D6A0",
        warning: "#FCA311",
        error: "#D62828",
      },
    },
  },
  plugins: [],
};
