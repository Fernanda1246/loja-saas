// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    "./app/**/*.{js,ts,jsx,tsx,mdx}",          // caso algum projeto use /app na raiz
    "./components/**/*.{js,ts,jsx,tsx,mdx}",   // idem
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
