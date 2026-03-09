/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Segoe UI"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        studio: {
          bg: 'rgb(var(--studio-bg) / <alpha-value>)',
          surface: 'rgb(var(--studio-surface) / <alpha-value>)',
          'surface-2': 'rgb(var(--studio-surface-2) / <alpha-value>)',
          'surface-3': 'rgb(var(--studio-surface-3) / <alpha-value>)',
          border: 'rgb(var(--studio-border) / <alpha-value>)',
          'border-hover': 'rgb(var(--studio-border-hover) / <alpha-value>)',
          text: 'rgb(var(--studio-text) / <alpha-value>)',
          'text-muted': 'rgb(var(--studio-text-muted) / <alpha-value>)',
          'text-dim': 'rgb(var(--studio-text-dim) / <alpha-value>)',
          accent: 'rgb(var(--studio-accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--studio-accent-hover) / <alpha-value>)',
          'accent-dim': 'rgb(var(--studio-accent-dim) / <alpha-value>)',
          success: 'rgb(var(--studio-success) / <alpha-value>)',
          error: 'rgb(var(--studio-error) / <alpha-value>)',
          warning: 'rgb(var(--studio-warning) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
