/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",            // Adjust the path if your index.html is in a different directory
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Scan all Vue, JavaScript, TypeScript, JSX, and TSX files in the src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
