import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#38bdf8", // Sky 400 - Celeste (Antes Verde Agua)
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0ea5e9", // Sky 500 - Celeste un poco más oscuro
          foreground: "#ffffff",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
