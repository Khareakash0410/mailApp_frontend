const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      rotate: {
        '360': '360deg',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}