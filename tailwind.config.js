export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'purple-900': '#4a1f8c',
        'purple-800': '#6e3bb8',
        'purple-700': '#9b6fd3',
        'purple-accent': '#c8a8e9',
        'purple-light': '#e6d6f5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    }
  },
  plugins: []
}
