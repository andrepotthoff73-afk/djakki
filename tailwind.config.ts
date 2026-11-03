import type { Config } from 'tailwindcss'

// Design-Tokens für den Stil „Editorial Monochrom“. Die Skalen ERSETZEN die Tailwind-Defaults.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    spacing: {
      0: '0px',
      px: '1px',
      1: 'var(--space-1)', // 4
      2: 'var(--space-2)', // 8
      3: 'var(--space-3)', // 16
      4: 'var(--space-4)', // 24
      5: 'var(--space-5)', // 32
      6: 'var(--space-6)', // 48
      7: 'var(--space-7)', // 64
      8: 'var(--space-8)', // 80
      9: 'var(--space-9)', // 96
      10: 'var(--space-10)', // 128
      'btn-sm': 'var(--btn-sm)',
      'btn-md': 'var(--btn-md)',
      'btn-lg': 'var(--btn-lg)',
      header: 'var(--header-h)',
    },
    fontSize: {
      xs: ['var(--text-xs)', { lineHeight: 'var(--leading-body)' }],
      sm: ['var(--text-sm)', { lineHeight: 'var(--leading-body)' }],
      base: ['var(--text-base)', { lineHeight: 'var(--leading-body)' }],
      lg: ['var(--text-lg)', { lineHeight: 'var(--leading-lead)' }],
      xl: ['var(--text-xl)', { lineHeight: 'var(--leading-heading)' }],
      '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-heading)' }],
      '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-heading)' }],
      '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-heading)' }],
      title: ['var(--text-title)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
      display: ['var(--text-display)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: 'var(--tracking-tight)',
      normal: '0',
      label: 'var(--tracking-label)',
    },
    lineHeight: {
      body: 'var(--leading-body)',
      lead: 'var(--leading-lead)',
      heading: 'var(--leading-heading)',
      display: 'var(--leading-display)',
    },
    borderRadius: {
      none: '0',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      accent: { 100: 'var(--accent-100)', 500: 'var(--accent-500)', 600: 'var(--accent-600)', 700: 'var(--accent-700)' },
      gray: { 400: 'var(--gray-400)' },
      paper: 'var(--paper)',
      'paper-2': 'var(--paper-2)',
      ink: 'var(--ink)',
      'ink-2': 'var(--ink-2)',
      // Rollen-Tokens
      bg: 'var(--color-bg)',
      text: 'var(--color-text)',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: { container: 'var(--container)', measure: 'var(--measure)' },
      transitionDuration: { fast: '150ms', card: '250ms' },
    },
  },
  plugins: [],
}

export default config
