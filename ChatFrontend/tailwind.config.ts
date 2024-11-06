import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#1A1920',
        primaryBase: '#292731',
        primaryLighter: '#292731',
        primaryLight: '#23222B',
        primaryDark: '#23222B',
        secondary: '#859F3D',
        textColor: '#F6FCDF',
        borderColor: '#31511E',
        borderSecondaryColor: '#31511E',
        errorColor: '#E33B54',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;

// Color Pallet  Black : #1A1920 , Dark Green: #31511E,  Light Green: #859F3D, Grey: #F6FCDF
