/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./component/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          pink1: "#F54040",
          pink2: "rgba(254, 113, 113, 0.12);",
          pBar: "#DFDBD8",
          cWhite: "#FFFFFF",
          navBack: "rgba(255, 255, 255, 0.12);",
          cGrey: "#817C7C",
          purple: "#6B65DA",
        },
        animation: {
          marquee: "marquee 26s linear infinite",
        },
        keyframes: {
          marquee: {
            "0%": { transform: "translateX(0%)" },
            "100%": { transform: "translateX(calc(-100% - 32px))" },
          },
        },
      },
      screens: {
        f: "300px",
        xxsm: "360px",
        xsm: "460px",
        sm: "560px",
        smd: "640px",
        md: "760px",
        lg: "860px",
        xl: "1080px",
        xxl: "1280px",
      },
    },
    plugins: [require("tailwindcss"), require("autoprefixer")],
  };