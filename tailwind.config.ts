import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-hanken-grotesk)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        surface: '#fcf9f8',
        'surface-dim': '#dcd9d9',
        'surface-bright': '#fcf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0eded',
        'surface-container-high': '#eae7e7',
        'surface-container-highest': '#e4e2e1',
        'surface-variant': '#e4e2e1',
        'surface-tint': '#476083',
        background: '#fcf9f8',
        'on-background': '#1b1c1c',
        primary: '#000613',
        'on-primary': '#ffffff',
        'primary-container': '#001f3f',
        'on-primary-container': '#6f88ad',
        'primary-fixed': '#d4e3ff',
        'primary-fixed-dim': '#afc8f0',
        'on-primary-fixed': '#001c3a',
        'on-primary-fixed-variant': '#2f486a',
        secondary: '#645e49',
        'on-secondary': '#ffffff',
        'secondary-container': '#e8dfc5',
        'on-secondary-container': '#68634d',
        'secondary-fixed': '#ebe2c8',
        'secondary-fixed-dim': '#cec6ad',
        'on-secondary-fixed': '#1f1c0b',
        'on-secondary-fixed-variant': '#4c4733',
        tertiary: '#110200',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#391303',
        'on-tertiary-container': '#b5785f',
        'tertiary-fixed': '#ffdbce',
        'tertiary-fixed-dim': '#fdb69a',
        'on-tertiary-fixed': '#351002',
        'on-tertiary-fixed-variant': '#6b3a25',
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#43474e',
        outline: '#74777f',
        'outline-variant': '#c4c6cf',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'inverse-surface': '#303030',
        'inverse-on-surface': '#f3f0f0',
        'inverse-primary': '#afc8f0',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
