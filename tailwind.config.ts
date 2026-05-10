import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent-2) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        glow: "rgb(var(--glow) / <alpha-value>)",
        glow2: "rgb(var(--glow-2) / <alpha-value>)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.12)",
        glow: "0 0 0 1px rgb(var(--border)), 0 24px 80px -24px rgb(var(--glow) / 0.4)",
        ambient: "0 30px 80px -30px rgb(var(--glow) / 0.5), 0 10px 40px -20px rgb(0 0 0 / 0.3)",
        // Apple-style elevated card: tiny inset highlight + shadow
        cinematic:
          "0 1px 0 rgb(255 255 255 / 0.05) inset, 0 2px 8px rgb(0 0 0 / 0.18), 0 24px 60px -20px rgb(0 0 0 / 0.4)",
      },
      backgroundImage: {
        // Aurora used by hero & episode header
        "gradient-aurora":
          "radial-gradient(60% 80% at 30% 10%, rgb(var(--accent) / 0.22) 0%, transparent 60%), radial-gradient(50% 70% at 80% 90%, rgb(var(--accent-2) / 0.18) 0%, transparent 60%)",
        // Soft warm glow used on CTAs
        "gradient-warm":
          "radial-gradient(70% 100% at 50% 0%, rgb(var(--accent) / 0.14) 0%, transparent 60%), radial-gradient(50% 70% at 80% 100%, rgb(var(--accent-2) / 0.16) 0%, transparent 60%)",
        // Used in CompleteEpisodeButton + IntroLoader gold accent moments
        "gradient-amber":
          "radial-gradient(80% 100% at 50% 50%, rgb(var(--accent-2) / 0.22) 0%, transparent 70%)",
      },
      keyframes: {
        breathe: {
          "0%,100%": { transform: "scale(1)",   opacity: "0.85" },
          "50%":     { transform: "scale(1.08)", opacity: "1" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        // Slow pulse on neurons / dots
        "slow-pulse": {
          "0%,100%": { opacity: "0.55", transform: "scale(1)" },
          "50%":     { opacity: "1",    transform: "scale(1.18)" },
        },
        // Ambient glow halo
        "ambient-glow": {
          "0%,100%": { opacity: "0.45" },
          "50%":     { opacity: "0.85" },
        },
        // Scrub line for waveform
        "wave-bar": {
          "0%,100%": { transform: "scaleY(0.4)" },
          "50%":     { transform: "scaleY(1)" },
        },
        // Slow drift of a wide gradient across text — used in hero clip-text
        "gradient-drift": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%":     { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        breathe:        "breathe 6s ease-in-out infinite",
        floaty:         "floaty 8s ease-in-out infinite",
        shimmer:        "shimmer 1.6s linear infinite",
        "slow-pulse":   "slow-pulse 4.5s ease-in-out infinite",
        "ambient-glow": "ambient-glow 6s ease-in-out infinite",
        "wave-bar":     "wave-bar 1.1s ease-in-out infinite",
        "gradient-drift": "gradient-drift 14s ease-in-out infinite",
      },
      transitionTimingFunction: {
        // Apple-ish curves
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
        warm:      "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
