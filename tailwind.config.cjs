const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'alert-success',
    'alert-error',
    'alert-info',
    'alert-warning',
    ...Array.from({ length: 100 })
      .fill('')
      .map((_, i) => `w-[${i + 1}%]`),
    ...Array.from({ length: 100 })
      .fill('')
      .map((_, i) => `left-[${i + 1}%]`),
    ...Array.from({ length: 100 })
      .fill('')
      .map((_, i) => `right-[${i + 1}%]`)
  ],
  plugins: [
    require('daisyui'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': value => {
            return {
              'animation-delay': value
            }
          }
        },
        {
          values: theme('transitionDelay')
        }
      )
    })
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  daisyui: {
    styled: true,
    themes: [
      {
        dark: {
          primary: '#F5F8E6',
          secondary: '#30aadd',
          accent: '#00ffc6',
          neutral: '#302F2C',
          info: '#6767F4',
          success: '#18B451',
          warning: '#6767F4',
          error: '#E02E64',
          'base-content': '#F5F8E6', // Base text content color
          'base-100': '#302F2C', // Base background color
          '--rounded-box': '16px',
          '--rounded-btn': '4px',
          '--rounded-badge': '2px',
          '--tab-radius': '2px',
          '--btn-text-case': 'normal-case',
          '--navbar-padding': '16px'
        },
        light: {
          primary: '#F5F8E6',
          secondary: '#30aadd',
          accent: '#00ffc6',
          neutral: '#302F2C',
          info: '#6767F4',
          success: '#18B451',
          warning: '#6767F4',
          error: '#E02E64',
          'base-content': '#252621', // Base text content color
          'base-100': '#F5F8E6', // Base background color
          '--rounded-box': '16px',
          '--rounded-btn': '4px',
          '--rounded-badge': '2px',
          '--tab-radius': '2px',
          '--btn-text-case': 'normal-case',
          '--navbar-padding': '16px'
        }
      }
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: 'dark'
  },
  theme: {
    extend: {
      animation: {
        fadeinout: 'fadeinout 390ms ease-in-out infinite',
        marquee: 'marquee 20s linear infinite'
      },
      aspectRatio: {
        '22/23': '22 / 23'
      },
      colors: {
        beige: {
          500: '#ABA692'
        },
        black: {
          500: '#302F2C'
        },
        blue: {
          500: '#6767F4'
        },
        green: {
          500: '#24A854'
        },
        red: {
          500: '#DF3064'
        },
        white: {
          500: '#F5F8E6'
        },
        yellow: {
          500: '#F2E18C'
        }
      },
      fontFamily: {
        sans: ['ApfelGrotezk']
      },
      fontSize: {
        xxs: ['11px', { lineHeight: '11.88px' }],
        xs: ['14px', { lineHeight: '15.12px' }],
        sm: ['16px', { lineHeight: '17.28px' }],
        base: ['18px', { lineHeight: '19px' }],
        lg: ['23px', { lineHeight: '24.84px' }],
        xl: ['36px', { lineHeight: '38.88px' }],
        '2xl': ['47px', { lineHeight: '50.76px' }],
        '3xl': ['64px', { lineHeight: '48px' }]
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))'
      },
      keyframes: {
        fadeinout: {
          '0%': { opacity: '1' },
          '17%': { opacity: '1' },
          '33%': { opacity: '0' },
          '82%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(102%)' },
          '100%': { transform: 'translateX(-100vw)' }
        }
      },
      width: {
        narrowModal: '327px',
        wideModal: '471px'
      },
      zIndex: {
        max: '1000' // High enough to appear above the modal(999)
      }
    }
  }
}
