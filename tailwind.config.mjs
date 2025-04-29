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
        seashell: "#FFF6F2",
        cafeNoir: '#482A09',
        lion: '#BD9B83',
        verde: '#31B855',
        rojo: '#AA5253',
        aliceBlue: '#E8F1F2',
        columbiaBlue: '#a7c6da',
        paynesGray: '#465C69',
        linen: '#F3E8E2',
      },
      keyframes: {
      },
      fontFamily: {
        lora: ['var(--font-lora)', 'serif'],
      },
      animation: {
      },
    },
  },
  plugins: [],
};


