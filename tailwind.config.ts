import type { Config } from 'tailwindcss'

// Design-Tokens aus design-focused.md. Die Skalen ERSETZEN die Tailwind-Defaults,
// damit keine Werte außerhalb des Systems verwendet werden können.
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
      input: 'var(--input-h)',
      icon: 'var(--icon)',
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
      display: ['var(--text-display)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
    },
    fontWeight: {
      normal: '400',
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
    },
    borderRadius: {
      none: '0',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      full: 'var(--radius-full)',
    },
    boxShadow: {
      none: 'none',
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: {
        50: 'var(--primary-50)',
        100: 'var(--primary-100)',
        200: 'var(--primary-200)',
        500: 'var(--primary-500)',
        600: 'var(--primary-600)',
        700: 'var(--primary-700)',
        800: 'var(--primary-800)',
      },
      accent: { 500: 'var(--accent-500)', 600: 'var(--accent-600)' },
      neutral: {
        0: 'var(--neutral-0)',
        50: 'var(--neutral-50)',
        100: 'var(--neutral-100)',
        200: 'var(--neutral-200)',
        400: 'var(--neutral-400)',
        600: 'var(--neutral-600)',
        800: 'var(--neutral-800)',
        900: 'var(--neutral-900)',
      },
      success: 'var(--success)',
      warning: 'var(--warning)',
      error: 'var(--error)',
      // Rollen-Tokens
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      muted: 'var(--color-text-muted)',
      border: 'var(--color-border)',
      'on-primary': 'var(--color-on-primary)',
      'on-primary-muted': 'var(--color-on-primary-muted)',
      dark: 'var(--color-dark)',
    },
    extend: {
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      maxWidth: { container: 'var(--container)', measure: 'var(--measure)' },
      transitionDuration: { fast: '150ms', card: '200ms', image: '500ms' },
      translate: { 'lift-sm': 'var(--lift-sm)', 'lift-md': 'var(--lift-md)' },
    },
  },
  plugins: [],
}

export default config
