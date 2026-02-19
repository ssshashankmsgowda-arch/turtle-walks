/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF7F50", // Coral
        "primary-hover": "#E56A3F",
        secondary: "#95D5B2", // Seafoam Green
        midnight: "#001B48", // Midnight Blue
        "midnight-light": "#002865",
        "background-light": "#F8FAFC", // Slate 50
        "background-dark": "#001B48", // Midnight Blue
        surface: "#FFFFFF",
        "surface-dark": "#0B2553",
        // Keep existing colors for backward compatibility if needed
        saffron: '#FF671F',
        indiaGreen: '#046A38',
        indiaNavy: '#06038D',
        body: '#333333',
        subText: '#5F6368',
        canvas: '#FAFAFA',
        danger: '#D32F2F',
      },
      fontFamily: {
         display: ["Montserrat", "sans-serif"],
         body: ["Inter", "sans-serif"],
         poster: ['Big Shoulders Display', 'sans-serif'], // Keeping for existing components if any
      },
      borderRadius: {
          DEFAULT: "0.5rem",
      },
      backgroundImage: {
          'ocean-gradient': 'linear-gradient(to bottom, rgba(0, 27, 72, 0.6), rgba(0, 27, 72, 0.9))',
      },
      animation: {
        blob: "blob 7s infinite",
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
