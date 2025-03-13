/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      maxWidth: {
        '7xl': '80rem',
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue
          light: '#93C5FD',
          dark: '#2563EB',
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