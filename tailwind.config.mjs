/** @type {import('tailwindcss').Config} */
export default {
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
        seashell: "var(--seashell)",
        cafeNoir: "var(--cafeNoir)",
        lion: "var(--lion)",
        verde: "var(--verde)",
        rojo: "var(--rojo)",
        rojoTransparente: "var(--rojoTransparente)",
        aliceBlue: "var(--aliceBlue)",
        columbiaBlue: "var(--columbiaBlue)",
        paynesGray: "var(--paynesGray)",
        linen: "var(--linen)",
        darkSeashell: "var(--darkSeashell)",
        darkAliceBlue: "var(--darkAliceBlue)",
        chamoise: "var(--chamoise)",
        ecru: "var(--ecru)",
      },
      keyframes: {
      },
      fontFamily: {
        lora: ['var(--font-lora)', 'serif'],
        admin: ['var(--font-admin)', 'sans-serif'],
      },
      animation: {
      },
    },
  },
  plugins: [],
};


