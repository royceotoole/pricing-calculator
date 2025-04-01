/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'neue-haas': ['NeueHaasGroteskDisplayPro', 'sans-serif'],
      },
      letterSpacing: {
        'neue': '0.01em',
      },
      fontWeight: {
        // Override Tailwind's default bold to use 500 weight (Medium)
        normal: 400,
        medium: 500,
        bold: 500, // Use Medium weight for bold
      },
    },
  },
  plugins: [],
}

