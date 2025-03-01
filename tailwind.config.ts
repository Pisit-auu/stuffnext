import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        yellow_FFA601: '#FFA601',
        human_C5A880: '#C5A880',
        secondary: '#00394f',
      },
      fontFamily: {
        thai: ['Noto Sans Thai', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
