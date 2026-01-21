import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#141414',
          secondary: '#181818',
          tertiary: '#1c1c1c',
          elevated: '#222222',
        },
        border: {
          subtle: '#1f1f1f',
          default: '#262626',
          hover: '#404040',
        },
        text: {
          primary: '#ffffff',
          secondary: '#d4d4d4',
          tertiary: '#a3a3a3',
          muted: '#737373',
        },
        stargate: {
          DEFAULT: '#0fb37c',
          dim: '#0a8c60',
          glow: 'rgba(15, 179, 124, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
