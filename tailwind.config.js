/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1020',
        panel: '#11182e',
        card: '#161f3a',
        line: '#26314f',
        brand: '#5b8cff',
        brand2: '#7c5cff',
        gold: '#ffce4d',
        green: '#2bd9a8',
        mut: '#9aa6c7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
