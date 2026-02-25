/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // brand palette (CSS variables defined in globals.css)
      brand: "var(--brand)",
      "brand-dark": "var(--brand-dk)",
      "brand-light": "var(--brand-lt)",
      gold: "var(--gold)",
      dark: "var(--dark)",
      dark2: "var(--dark2)",
      mid: "var(--mid)",
      muted: "var(--muted)",
      surface: "var(--surface)",
      white: "var(--white)",
      border: "var(--border)",
      green: "var(--green)",
      // legacy aliases (for older components still using them)
      primary: "var(--brand)",
      secondary: "var(--brand-dk)",
      light: "var(--surface)",
      red: "#ff0000",
      black: "#000000"
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
