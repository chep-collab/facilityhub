/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      // card: {
      //   base: "",
      //   background: "bg-white dark:bg-gray-900",
      //   divide: "divide-y divide-gray-200 dark:divide-gray-800",
      //   ring: "ring-1 ring-gray-200 dark:ring-gray-800",
      //   rounded: "rounded-lg",
      //   shadow: "shadow",
      //   body: {
      //     base: "",
      //     background: "",
      //     padding: "px-4 py-2 sm:p-6",
      //   },
      //   header: {
      //     base: "",
      //     background: "",
      //     padding: "px-4 py-5 sm:px-6",
      //   },
      //   footer: {
      //     base: "",
      //     background: "",
      //     padding: "px-4 py-2 sm:px-6",
      //   }
      // font-family{
      //inter:['Inter', 'sans-serif'],
      colors: {
        "grey-stepper": "#344054",
        "grey-medium": "#475367",
        "grey-border": "#667185",
        "primary-green": "#0F973D",
        error: "#E26E6A",
        "grey-green": "#55AA55",
      },
      animation: {
        // Define the custom animation for the glistening effect
        glistening: "glistening 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 1s ease-in-out",

        // Added a custom background image
      },
      keyframes: {
        // Define the keyframes for the glistening effect
        glistening: {
          "0%": {
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.6)",
          },
          "50%": {
            textShadow:
              "0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.7)",
          },
          "100%": {
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.6)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
      },
      backgroundImage: {
        "coming-soon": "url('/assets/landing-page/coming-soon-bg-img.svg')",
      },
    },
    // ,
    // },

    // Custom animation
  },
  plugins: [],
};
