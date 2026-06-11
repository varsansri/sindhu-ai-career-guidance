/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#060a07',        // green-black base
        panel: '#0a1410',
        card: '#0d1712',
        line: '#1d2c23',
        white: '#ffffff',
        brand: '#1fe06a',      // neon green (primary accent)
        brand2: '#c9f23e',     // acid lime (secondary accent)
        green: '#1fe06a',
        gold: '#c9f23e',
        mint: '#2be3c0',
        mut: '#9fb0a6',        // green-gray muted text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
