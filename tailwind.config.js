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
    colors: ({ colors }) => {
      return {
        ...colors,
        solarized: {
          base00: '#657b83',
          base01: '#586e75',
          base02: '#073642',
          base03: '#002b36',
          base0: '#839496',
          base1: '#93a1a1',
          base2: '#eee8d5',
          base3: '#fdf6e3',
          yellow: '#b58900',
          orange: '#cb4b16',
          red: '#dc322f',
          magent: '#d33682',
          violet: '#6c71c4',
          blue: '#268bd2',
          cyan: '#2aa198',
          green: '#859900',
        },
      }
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
  mode: 'jit',
}
