import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        signal: '#C9282D',
        ghost: '#F7F4EF',
        bone: '#E6DFD5',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
};

export default config;
