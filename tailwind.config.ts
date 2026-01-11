import type { Config } from "tailwindcss"

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF7F0",
          dark: "#F5F2EB",
        },
        charcoal: {
          DEFAULT: "#85817B",
          dark: "#4A4543",
          light: "#A8A5A0",
        },
        forest: "#2C5F4F",
        teal: "#3A7A9E",
        gold: "#C9A86A",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-quattrocento)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config
