import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        "plus-jakarta": ["var(--font-plus-jakarta)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Iguana-themed colors
        iguana: {
          50: "hsl(120 40% 96.1%)",
          100: "hsl(120 40% 92.1%)",
          200: "hsl(120 35% 85%)",
          300: "hsl(120 30% 75%)",
          400: "hsl(120 25% 65%)",
          500: "hsl(120 35% 45%)", // Main iguana green
          600: "hsl(120 40% 35%)",
          700: "hsl(120 45% 25%)",
          800: "hsl(120 50% 15%)",
          900: "hsl(120 55% 10%)",
        },
        orange: {
          50: "hsl(25 100% 96%)",
          100: "hsl(25 100% 92%)",
          200: "hsl(25 100% 85%)",
          300: "hsl(25 100% 75%)",
          400: "hsl(25 100% 65%)",
          500: "hsl(25 95% 55%)", // Iguana orange accent
          600: "hsl(25 90% 45%)",
          700: "hsl(25 85% 35%)",
          800: "hsl(25 80% 25%)",
          900: "hsl(25 75% 15%)",
        },
        earth: {
          50: "hsl(35 30% 96%)",
          100: "hsl(35 25% 90%)",
          200: "hsl(35 20% 80%)",
          300: "hsl(35 15% 70%)",
          400: "hsl(35 12% 60%)",
          500: "hsl(35 10% 50%)", // Earth tones
          600: "hsl(35 12% 40%)",
          700: "hsl(35 15% 30%)",
          800: "hsl(35 18% 20%)",
          900: "hsl(35 20% 10%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "iguana-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "iguana-pulse": "iguana-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        "iguana-gradient": "linear-gradient(135deg, hsl(120 35% 45%) 0%, hsl(25 95% 55%) 100%)",
        "iguana-pattern": "url('/iguana-pattern-bg.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
