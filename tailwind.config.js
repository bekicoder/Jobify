/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // App Router pages
    "./pages/**/*.{js,ts,jsx,tsx}",    // optional, if using Pages Router
    "./components/**/*.{js,ts,jsx,tsx}" // your components folder
  ],
  safelist:[
    "bg-[#1E1E1E]",
    "bg-[#121212]",
    "even:bg-zinc-900",
    "even:bg-gray-100",
    "hover:bg-zinc-950",
    "hover:bg-gray-200",
    "bg-green-100",
    "bg-purple-100",
    "bg-blue-100",
    "text-green-600",
    "text-purple-600",
    "text-blue-600",
    "md:bg-[#1E1E1E]",
    "hover:bg-[#1E1E1E]"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
