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
        background: "var(--background)",
        foreground: "var(--foreground)",
        100: "#2934D0",
        200: "#E94057",
        300: "#E8E6EA",
        400: "#F3F3F3",
        500: "#F27121",
        600: "#000000",
        
      },
    },
  },
  plugins: [],
};
export default config;
