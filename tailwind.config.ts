import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        signal: '#C9282D',
        ghost: '#F7F4EF',
        bone: '#E6DFD5',
      },
      fontFamily: {
        display: ['Arial Narrow', 'Arial', 'Helvetica Neue', 'sans-serif'],
        sans: ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
