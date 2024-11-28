/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Habilita o suporte ao modo escuro
  theme: {
    extend: {
      colors: {
        light: {
          background: "#f9fafb",
          text: "#1f2937",
        },
        dark: {
          background: "#1f2937",
          text: "#f9fafb",
        },
      },
    },
  },
  plugins: [],
};
