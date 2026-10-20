/** @type {import('tailwindcss').Config} */
// VI 2.0「观象」色板（docs/design/VI-2.0.md）；颜色名沿用 1.x 以兼容存量类名。
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      maxWidth: {
        content: 'var(--content-max-width)',
      },
      colors: {
        china: {
          red: '#E5483B',
          deep: '#9E2A22',
          light: '#EE6A5E',
        },
        fire: {
          gold: '#D9B26A',
          amber: '#D4A25A',
          orange: '#C07A4A',
        },
        cyber: {
          cyan: '#6E8CFF',
          steel: '#8A8578',
        },
        ink: {
          900: '#0D0F14',
          800: '#14171F',
          700: '#1C202A',
          600: '#2A2D36',
        },
      },
      fontFamily: {
        sans: ['var(--vi-font-ui)'],
        serif: ['var(--vi-font-read)'],
        display: ['var(--vi-font-display)'],
        mono: ['var(--vi-font-mono)'],
      },
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-relaxed)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-tight)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-lg)',
        '2xl': 'var(--radius-xl)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        ink: 'var(--ease-ink)',
      },
      boxShadow: {
        ambient: 'var(--shadow-ambient)',
        key: 'var(--shadow-key)',
        glass: 'var(--shadow-glass)',
      },
      backdropBlur: {
        glass: 'var(--glass-blur-md)',
        'glass-sm': 'var(--glass-blur-sm)',
        'glass-lg': 'var(--glass-blur-lg)',
      },
      letterSpacing: {
        'ink-tight': 'var(--tracking-ink-tight)',
        'ink-wide': 'var(--tracking-ink-wide)',
      },
    },
  },
  plugins: [],
};
