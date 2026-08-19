import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        warmwhite: "#FBF9F5",
        champagne: {
          DEFAULT: "#C9A24B",
          light: "#E4CC8C",
          dark: "#A8823A",
        },
        charcoal: {
          DEFAULT: "#2B2926",
          soft: "#4A4742",
        },
        beige: {
          DEFAULT: "#F1EAE0",
          dark: "#E7DCC9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        arabic: ["var(--font-tajawal)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "90rem",
      },
      boxShadow: {
        premium: "0 20px 60px -15px rgba(43, 41, 38, 0.15)",
        card: "0 8px 30px -8px rgba(43, 41, 38, 0.12)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeIn: "fadeIn 0.6s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
