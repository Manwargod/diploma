/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--sp-primary)',
        secondary: 'var(--sp-secondary)',
        bg: 'var(--sp-bg)',
        surface: 'var(--sp-surface)',
        surface2: 'var(--sp-surface-2)',
        text: 'var(--sp-text)',
        muted: 'var(--sp-muted)',
        border: 'var(--sp-border)',
        success: 'var(--sp-success)',
        warning: 'var(--sp-warning)',
        danger: 'var(--sp-danger)'
      }
    },
  },
  plugins: [],
}

