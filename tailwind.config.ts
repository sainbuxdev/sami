import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Restrained, Apple-inspired neutral palette driven by CSS variables.
        ink: {
          DEFAULT: "#0b0b0f",
          soft: "#1c1c22",
        },
        haze: {
          DEFAULT: "#f5f5f7",
          200: "#e8e8ed",
        },
        accent: {
          DEFAULT: "#2563eb",
          soft: "#6366f1",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#128C7E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.125rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(16,16,24,0.08), 0 4px 24px -8px rgba(16,16,24,0.06)",
        lift: "0 12px 40px -12px rgba(16,16,24,0.22), 0 4px 16px -8px rgba(16,16,24,0.12)",
        glow: "0 30px 80px -30px rgba(37,99,235,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
