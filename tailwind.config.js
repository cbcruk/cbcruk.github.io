/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      typography(theme) {
        return {
          sm: {
            css: {
              h1: {
                fontWeight: 'normal',
              },
              h2: {
                fontWeight: 'normal',
              },
              h3: {
                fontWeight: 'normal',
              },
              h4: {
                fontWeight: 'normal',
              },
              h5: {
                fontWeight: 'normal',
              },
              h6: {
                fontWeight: 'normal',
              },
              ul: {
                fontSize: '.75rem',
              },
            },
          },
          dark: {
            css: {
              color: 'var(--solarized-primary)',
              'h1, h2, h3, h4, h5, h6, a': {
                color: 'var(--solarized-primary)',
              },
              strong: {
                color: 'var(--solarized-magenta)',
              },
              code: {
                color: 'var(--solarized-green)',
              },
              'pre code': {
                color: 'var(--solarized-primary)',
              },
              hr: {
                borderColor:
                  'var(--solarized-background-highlight)' ||
                  theme('colors.slate.700'),
              },
            },
          },
        }
      },
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
