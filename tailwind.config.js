/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue
          light: '#93C5FD',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#10B981', // Green
          light: '#6EE7B7',
          dark: '#065F46',
        },
        accent: {
          DEFAULT: '#F97316', // Orange
          light: '#FDBA74',
          dark: '#C2410C',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 