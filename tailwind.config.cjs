/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--atlas-primary)',
        'primary-muted': 'var(--atlas-primary-muted)',
        secondary: 'var(--atlas-secondary)',
        accent: 'var(--atlas-accent)',
        surface: 'var(--atlas-surface)',
        'surface-alt': 'var(--atlas-surface-alt)',
        border: 'var(--atlas-border)',
        danger: 'var(--atlas-danger)',
        success: 'var(--atlas-success)'
      },
      boxShadow: {
        card: '0 8px 20px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl: '1.25rem'
      }
    }
  },
  plugins: []
};

