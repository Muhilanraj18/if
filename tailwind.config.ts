import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GSAP brand palette
        dark: {
          DEFAULT: "#0e100f",
          surface: "#1a1c1a",
          border: "#2a2c2a",
        },
        light: "#f3f4f6",
        gsap: {
          green: "#8ae614", // Classic GreenSock neon
          purple: "#ce26ff",
          blue: "#26a8ff",
        },
      },
      fontFamily: {
        // Chunky sans for headers, keeping inter for body, monospace for code
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        // Flat Neo-brutalist shadows (GSAP playful style)
        brutal: "8px 8px 0px rgba(138, 230, 20, 0.2)",
        "brutal-hover": "12px 12px 0px rgba(138, 230, 20, 1)",
        "brutal-purple": "8px 8px 0px rgba(206, 38, 255, 0.2)",
        "brutal-purple-hover": "12px 12px 0px rgba(206, 38, 255, 1)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      animation: {
        "mesh-drift": "meshDrift 8s ease-in-out infinite alternate",
        "flame-flicker": "flameFlicker 3s ease-in-out infinite",
        "grain": "grain 0.8s steps(10) infinite",
      },
      keyframes: {
        meshDrift: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        flameFlicker: {
          "0%, 100%": { transform: "scaleY(1) translateY(0)" },
          "50%": { transform: "scaleY(1.08) translateY(-2px)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-3%)" },
          "20%": { transform: "translate(3%,2%)" },
          "30%": { transform: "translate(-1%,4%)" },
          "40%": { transform: "translate(4%,-1%)" },
          "50%": { transform: "translate(-3%,3%)" },
          "60%": { transform: "translate(2%,-2%)" },
          "70%": { transform: "translate(-4%,1%)" },
          "80%": { transform: "translate(1%,-4%)" },
          "90%": { transform: "translate(-2%,2%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
