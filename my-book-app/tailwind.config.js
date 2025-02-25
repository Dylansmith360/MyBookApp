/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-black/50',
    'backdrop-blur-[2px]',
    'scale-100',
    'scale-95',
    'opacity-0',
    'opacity-100'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
