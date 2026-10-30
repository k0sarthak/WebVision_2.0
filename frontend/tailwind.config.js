/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dmrc: {
          red: "#E53935",
          darkred: "#B71C1C",
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#172033",
          secondary: "#64748B",
          border: "#E2E8F0",
          success: "#16A34A",
          warning: "#F59E0B",
          error: "#DC2626"
        },
        metro: {
          yellow: "#FBC02D",
          blue: "#1976D2",
          red: "#D32F2F",
          green: "#388E3C",
          violet: "#7B1FA2",
          pink: "#EC407A",
          magenta: "#880E4F",
          airport: "#FF6F00",
          grey: "#757575"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

