import daisyui from "daisyui";
import themes, { black, light } from "daisyui/src/theming/themes";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        glitter: "glitter 3s infinite",
      },
      keyframes: {
        glitter: {
          "0%, 100%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
        },
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "autumn",
      {
        black: {
          ...daisyUIThemes[("dark", "light", "black")],
          primary: "#8b2fc9",
          secondary: "#6F2DA8",
        },
      },
    ],
  },
};
