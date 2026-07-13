/** @type {import('tailwindcss').Config} */
// 设计令牌沿用 china.html「权力红 · 钢灰 · 赛博青」体系，新增暗色科技感为默认。
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        china: {
          red: '#C41E3A',
          deep: '#8B0000',
          light: '#E63946',
        },
        fire: {
          gold: '#D4AF37',
          amber: '#E8A317',
          orange: '#E85D04',
        },
        cyber: {
          cyan: '#22d3ee',
          steel: '#64748b',
        },
        ink: {
          900: '#0a0e17',
          800: '#0f1623',
          700: '#1a2333',
          600: '#27324a',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
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
