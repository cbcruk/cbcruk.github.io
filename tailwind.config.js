module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
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
              color: theme('colors.gray.300'),
              'h1, h2, h3, h4, h5, h6, a, code': {
                color: theme('colors.gray.300'),
              },
              hr: {
                borderColor: theme('colors.gray.500'),
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
