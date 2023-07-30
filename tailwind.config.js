/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mina: {
          primary: "#1f2937",

          secondary: "#202123",

          accent: "#f9682f",

          neutral: "#22272a",
          dark: "#131415",

          // "base-100": "#eceef3",

          info: "#6d84d0",

          success: "#248f7b",

          warning: "#955604",

          error: "#f1414d",
        },
      },
    ],
  },
};
