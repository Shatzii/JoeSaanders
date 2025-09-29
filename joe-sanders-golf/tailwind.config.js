/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CoolStones Brand Colors - Lifestyle Expansion of Stones Golf
        'cool-black': '#000000', // Matte black - primary brand color
        'cool-gold': '#FFD700', // 24K gold - premium metallic
        'cool-white': '#FFFFFF', // Pure white
        'cool-rose': '#B76E79', // Rose gold - Lady Stones accent
        'cool-stone': '#e7e3da', // Warm stone for text

        // Legacy Uncle Joe Colors (for backward compatibility)
        'joe-black': '#0a0a0a',
        'joe-gold': '#d4af37',
        'joe-white': '#fafafa',
        'joe-stone': '#e7e3da',
        'joe-crimson': '#dc2626',

        // Golf-themed variations
        'golf-gold': '#d4af37',
        'golf-gold-light': '#e6c85a',
        'golf-navy': '#1a365d',
        'golf-navy-light': '#2c5282',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'joe-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'golf-gradient': 'linear-gradient(135deg, #2d5a27 0%, #d4af37 100%)',
        'stones-gradient': 'linear-gradient(135deg, #d4af37 0%, #f9e076 100%)',
        'luxury-gradient': 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
      },
      fontFamily: {
        'joe-display': ['Cormorant Garamond', 'serif'],
        'joe-heading': ['Cormorant Garamond', 'serif'],
        'joe-body': ['Inter', 'system-ui', 'sans-serif'],
        'joe-accent': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'text-pulse': 'textPulse 3s ease-in-out infinite alternate',
        'metal-shine': 'metalShine 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        textPulse: {
          from: { filter: 'drop-shadow(0 0 0.5rem rgba(212, 175, 55, 0.2))' },
          to: { filter: 'drop-shadow(0 0 1.5rem rgba(212, 175, 55, 0.4))' },
        },
        metalShine: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'luxury': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(212, 175, 55, 0.2)',
        'gold': '0 0 15px -3px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
}
