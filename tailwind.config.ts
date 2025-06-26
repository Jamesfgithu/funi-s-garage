module.exports = {
  // ...existing config...
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        cobalt: '#0033CC',
        'cobalt-dark': '#002299',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'logo-fade': {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'card-fade': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-up': 'fade-in-up 1s ease-out',
        'logo-fade': 'logo-fade 1.2s cubic-bezier(0.4,0,0.2,1)',
        'card-fade': 'card-fade 0.8s cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  // ...existing config...
};
