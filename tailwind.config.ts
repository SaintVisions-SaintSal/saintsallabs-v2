import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sal: {
          bg: "#0C0C0F",
          surface: "#111116",
          surface2: "#090910",
          border: "#141420",
          border2: "#1E1E2A",
          border3: "#1C1C24",
          gold: "#F59E0B",
          "gold-hover": "#FBB035",
          "gold-dim": "#D97706",
          green: "#22C55E",
          purple: "#818CF8",
          pink: "#EC4899",
          red: "#EF4444",
          text: "#E8E6E1",
          "text-secondary": "#C8C5BE",
          "text-muted": "#555",
          "text-dim": "#3A3A44",
          "text-ghost": "#2A2A36",
          "text-invisible": "#1A1A24",
          input: "#111118",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "1.4" }],
        "xs": ["11px", { lineHeight: "1.4" }],
        "sm": ["12px", { lineHeight: "1.5" }],
        "base": ["13.5px", { lineHeight: "1.76" }],
        "lg": ["14.5px", { lineHeight: "1.6" }],
        "xl": ["17px", { lineHeight: "1.4" }],
        "2xl": ["21px", { lineHeight: "1.3" }],
      },
      animation: {
        "fade-up": "fadeUp 0.2s ease both",
        "pulse-dot": "pulse 1.2s ease infinite",
        "spin-fast": "spin 0.7s linear infinite",
        "ticker": "ticker 72s linear infinite",
        "blink": "blink 0.9s step-end infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
