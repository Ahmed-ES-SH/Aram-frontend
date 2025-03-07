import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main_orange: "#feb803",
        main_blue: "#0080df",
        main_red: "#ff0d69",
        main_dash: "#0f172a",
        secend_dash: "#1f2937",
        secend_text: "#94a3b8",
      },
    },
  },
  plugins: [],
} satisfies Config;
