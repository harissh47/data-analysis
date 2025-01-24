/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: require('./typography'),
    extend: {
      colors: {
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#eaecf0',
          250: '#a1a2b6', //for both light and dark theme api access bullet points text color
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          700: '#475467',
          600: '#344054',
          800: '#1d2939',
          900: '#101828',


        },
        // primary: {
        //   25: '#f5f8ff',
        //   50: '#eff4ff',
        //   100: '#d1e0ff',
        //   200: '#b2ccff',
        //   300: '#84adff',
        //   400: '#528bff',
        //   500: '#2970ff',
        //   600: '#155eef',
        //   700: '#004eeb',
        //   800: '#0040c1',
        //   900: '#00359e',
        // },
        // primary: {
        // 25:  '#F1F8D3',
        // 50:  '#E0F0A8',
        // 100: '#C4D35F',
        // 200: '#A3B649',
        // 300: '#8D9F38',
        // 400: '#758C29',
        // 500: '#5D7A1D',
        // 600: '#4D6A14',
        // 700: '#3E5910',
        // 800: '#2F470D',
        // 900: '#1F3708',
        //   25: '#E7EBED',  // Very light grayish blue
        //   50: '#D0D7DD',  // Lighter grayish blue
        //   100: '#AAB9C3',  // Light grayish blue
        //   200: '#8E9EA8',  // Soft grayish blue
        //   300: '#738490',  // Medium grayish blue
        //   400: '#556676',  // Original color (Grayish blue)
        //   500: '#4A5A67',  // Darker grayish blue, closer to primary
        //   600: '#3E4D58',  // Slightly darker grayish blue
        //   700: '#313D46',  // Dark grayish blue
        //   800: '#262F35',  // Darker grayish blue
        //   900: '#1C2226',  // Darkest grayish blue
        // },
        primary: {
          25: '#F7FEC5',  // Very light yellow-green
          // 50:  '#E9F79D',  // Lighter yellow-green
          // 50:  '#FAFDEB',
          100: '#D6F15A',  // Light yellow-green
          200: '#C4E037',  // Soft yellow-green
          300: '#E4FF35',  // Medium yellow-green (Original color)
          400: '#C3E20F',  // Slightly darker yellow-green
          500: '#A1C20A',  // Darker yellow-green, closer to primary
          600: '#8AB40A',  // Primary color (Original color)
          700: '#6E9B08',  // Dark yellow-green
          800: '#527A06',  // Darker yellow-green
          900: '#3F5A04',  // Darkest yellow-green
        },
        blue: {
          // 500: '#E1EFFE',
          500: '#A1C20A',
        },
        green: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          800: '#03543F',

        },
        yellow: {
          100: '#FDF6B2',
          800: '#723B13',
        },
        purple: {
          50: '#D6F15A',
          200: '#DCD7FE',
        },
        indigo: {
          25: '#F5F8FF',
          50: '#EEF4FF',
          100: '#E0EAFF',
          300: '#A4BCFD',
          400: '#8098F9',
          600: '#8AB40A',
          800: '#2D31A6',
        },
      },
      screens: {
        mobile: '100px',
        // => @media (min-width: 100px) { ... }
        tablet: '640px', // 391
        // => @media (min-width: 600px) { ... }
        pc: '769px',
        // => @media (min-width: 769px) { ... }
      },
      boxShadow: {
        'xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'sm': '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
        'md': '0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
        'lg': '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        'xl': '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
        '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      },
      opacity: {
        2: '0.02',
        8: '0.08',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
