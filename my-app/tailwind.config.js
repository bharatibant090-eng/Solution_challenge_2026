/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Prevent Tailwind from conflicting with your custom base styles
  corePlugins: {
    // We'll let your :root handle these instead of Tailwind's preflight
    // If you want Tailwind's full preflight, remove this block
  },
};