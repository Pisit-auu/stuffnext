import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        sunk: "var(--ground-sunk)",
        plate: "var(--plate)",
        rail: "var(--plate-rail)",
        edge: "var(--edge)",
        "edge-strong": "var(--edge-strong)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          rail: "var(--ink-on-rail)",
          "rail-2": "var(--ink-on-rail-2)",
        },
        stock: {
          DEFAULT: "var(--stock)",
          soft: "var(--stock-soft)",
        },
        tag: {
          DEFAULT: "var(--tag)",
          soft: "var(--tag-soft)",
        },
        alert: {
          DEFAULT: "var(--alert)",
          soft: "var(--alert-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-thai)", "system-ui", "sans-serif"],
        // ภาษาไทยไม่มีในฟอนต์ mono จึงตกไปที่ Plex Sans Thai ซึ่งเป็นตระกูลเดียวกัน
        mono: [
          "var(--font-plex-mono)",
          "var(--font-plex-thai)",
          "ui-monospace",
          "monospace",
        ],
      },
      fontSize: {
        meta: ["0.8125rem", { lineHeight: "1.45" }],
        base: ["0.9375rem", { lineHeight: "1.6" }],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        plate: "var(--radius)",
      },
      boxShadow: {
        plate: "var(--shadow-plate)",
        lift: "var(--shadow-lift)",
        drawer: "var(--shadow-drawer)",
      },
      transitionTimingFunction: {
        drawer: "var(--ease)",
      },
      maxWidth: {
        rail: "84rem",
      },
      keyframes: {
        "slide-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        sheen: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "slide-up": "slide-up var(--dur-slow) var(--ease) both",
        "slide-in": "slide-in var(--dur) var(--ease) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
