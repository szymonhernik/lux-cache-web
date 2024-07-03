/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        lg: '1024px',
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-suisse)'],
        neue: ['var(--font-suisseNeue)']
      },
      screens: {
        'screen-wide-tall': {
          raw: '(min-width: theme(screens.lg)) and (min-height: 801px)'
        },
        'screen-wide-short': {
          raw: '(min-width: theme(screens.lg)) and (max-height: 800px)'
        },
        'screen-short': {
          raw: '(max-height: 800px)'
        }
      },
      height: {
        // UI
        toolbar: 'var(--height-toolbar)',
        dynamicDisplayBar: 'var(--height-dynamic-display-bar)',
        navbar: 'var(--height-navbar)',
        'navbar-mobile': '4rem'
      },
      width: {
        navbarDesktop: 'var(--width-navbar)',
        toolbarDesktop: 'calc(100vw - theme(width.navbarDesktop))'
      },
      gridTemplateRows: {
        custom: 'repeat(auto-fill, minmax(33vh, 1fr));'
      },
      padding: {
        searchXPadding: 'var(--padding-x-searchbar)'
      },
      inset: {
        searchXPadding: 'var(--padding-x-searchbar)',
        toolbarHeight: 'var(--height-toolbar)',
        dynamicDisplayBar: 'var(--height-dynamic-display-bar)'
      },
      textShadow: {
        DEFAULT: '0px 0px 4px rgba(0, 0, 0, 0.50);'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        highlightGreen: 'hsl(var(--highlight-green))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'surface-brand': 'hsl(var(--surface-brand))',
        'surface-brand-darken': 'hsl(var(--surface-brand-darken))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground)) '
        },
        inverted: {
          DEFAULT: 'hsl(var(--inverted))',
          foreground: 'hsl(var(--inverted-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--surface-secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        disabled: {
          DEFAULT: 'hsl(var(--disabled))',
          foreground: 'hsl(var(--disabled-foreground))'
        }

        // text: {
        //   DEFAULT: 'hsl(var(--color-text))',
        //   secondary: 'hsl(var(--text-secondary))',
        // }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value
          })
        },
        { values: theme('textShadow') }
      )
    })
  ]
}
